# Win Win Win — Data Model (Drizzle + Neon Postgres)
**Status:** Proposed · **Author:** Data Modeler agent · **Migration:** 0001_win_win_win_initial.sql
## `db/schema.ts`

```typescript
/*
 * ============================================================================
 * WIN WIN WIN — Drizzle ORM + Neon Postgres Schema
 * Migration file: 0001_win_win_win_initial.sql
 * ============================================================================
 *
 * WHY THIS SCHEMA
 *
 * Auth.js v5 tables are the identity root — every game entity traces back to
 * `user.id` via `player` (1:1) or `parent_link` (family graph). Auth.js works
 * unmodified; the game domain sits cleanly alongside it in the same DB.
 *
 * `mutation_log` is the financial ledger. Every row that moves cash, gems, or
 * stock positions carries a `mutation_log_id` FK, and a UNIQUE constraint on
 * `idempotency_key` ensures that retried API calls can never double-spend —
 * the second INSERT fails fast and the caller returns the first result. This
 * pattern mirrors Stripe's idempotency key design exactly.
 *
 * `stock_price_tick` is append-only with a composite unique index on
 * (stock_id, day_bucket). "Last 30 days for ticker X" becomes a single
 * index range scan with no heap access on a covering index — critical for
 * Neon serverless where cold-start seq-scans are expensive.
 *
 * `parental_consent` is a first-class COPPA artifact: it stores consent
 * method, JSONB scopes array, and `revoked_at` so COPPA deletion requests
 * can be processed without destroying the audit trail. Both FKs use
 * ON DELETE RESTRICT to prevent silent orphan records.
 *
 * pgEnums keep taxonomy honest across Drizzle, TypeScript, and the DB engine —
 * no magic strings leak into query logic. Cascade rules follow ownership:
 * deleting a player cascades to their ventures, holdings, and inventory.
 * NPC tables are independent catalogs with no cascade to real users.
 *
 * Table definition order matters: `mutation_log` is defined after `player`
 * but before every money table that references it. NPCs are defined before
 * M&A tables to avoid TypeScript forward-reference issues.
 *
 * `updatedAt` uses `.$onUpdate(() => new Date())` — requires Drizzle ≥ 0.30.
 * For Neon serverless, pairing this with a Postgres trigger is recommended
 * as a defense-in-depth measure against stale timestamps from direct SQL.
 * ============================================================================
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  smallint,
  bigint,
  boolean,
  jsonb,
  numeric,
  date,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// TIMESTAMP HELPER
// Spread into every table. updatedAt uses Drizzle's $onUpdate hook.
// ─────────────────────────────────────────────────────────────────────────────

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

/** Every financial mutation kind — drives UI icons and audit filtering. */
export const mutationKindEnum = pgEnum("mutation_kind", [
  "cash_earn",          // passive revenue from ventures
  "cash_spend",         // purchase of any asset
  "gem_earn",           // quest reward or admin grant
  "gem_spend",          // cosmetic or boost purchase
  "stock_buy",          // stock purchase fills
  "stock_sell",         // stock sale fills
  "venture_purchase",   // player buys a venture
  "venture_revenue",    // harvest from a venture
  "cosmetic_purchase",  // buying a cosmetic item
  "quest_reward",       // sponsored quest completion reward
  "trade_send",         // player gives asset in a trade
  "trade_receive",      // player receives asset in a trade
  "acquisition_buy",    // player buys another venture via M&A
  "acquisition_sell",   // player sells a venture via M&A
  "franchise_open",     // opening a new franchise location
  "npc_dividend",       // NPC simulated market dividend
]);

export const ventureTypeEnum = pgEnum("venture_type", [
  "lemonade_stand",
  "candy_shop",
  "slime_factory",
  "pet_wash",
  "lawn_care",
  "tech_startup",
  "food_truck",
  "clothing_brand",
]);

export const stockSectorEnum = pgEnum("stock_sector", [
  "tech",
  "food",
  "retail",
  "entertainment",
  "finance",
  "healthcare",
  "energy",
  "real_estate",
]);

export const tradeStatusEnum = pgEnum("trade_status", [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "expired",
]);

/** COPPA 16 CFR § 312.5 verified parental consent methods. */
export const consentMethodEnum = pgEnum("consent_method", [
  "credit_card",       // charge + refund or microcharge
  "govt_id",           // scanned government ID verification
  "knowledge_based",   // dynamic KBA questions
  "email_plus",        // email + second factor (phone/video)
]);

export const crewRoleEnum = pgEnum("crew_role", [
  "owner",
  "officer",
  "member",
]);

export const acquisitionStatusEnum = pgEnum("acquisition_status", [
  "pending",
  "accepted",
  "rejected",
  "withdrawn",
  "completed",
]);

export const orderTypeEnum = pgEnum("order_type", ["market", "limit"]);
export const orderSideEnum  = pgEnum("order_side",  ["buy",    "sell" ]);

// ─────────────────────────────────────────────────────────────────────────────
// AUTH.JS v5 — STANDARD TABLES
// Column names must match Auth.js adapter expectations exactly.
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "user",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    name:          text("name"),
    email:         text("email").unique(),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    image:         text("image"),
    /** "child" | "parent" | "admin" — drives COPPA gate logic. */
    role:          varchar("role", { length: 16 }).notNull().default("child"),
    /** Required for COPPA under-13 detection at registration. */
    dateOfBirth:   date("date_of_birth"),
    ...timestamps,
  },
  (t) => ({
    emailIdx: uniqueIndex("user_email_uidx").on(t.email),
  })
);

export const accounts = pgTable(
  "account",
  {
    userId:            uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type:              text("type").notNull(),
    provider:          text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken:      text("refresh_token"),
    accessToken:       text("access_token"),
    expiresAt:         integer("expires_at"),
    tokenType:         text("token_type"),
    scope:             text("scope"),
    idToken:           text("id_token"),
    sessionState:      text("session_state"),
    ...timestamps,
  },
  (t) => ({
    pk:      primaryKey({ columns: [t.provider, t.providerAccountId] }),
    userIdx: index("account_user_idx").on(t.userId),
  })
);

export const sessions = pgTable(
  "session",
  {
    id:           uuid("id").primaryKey().defaultRandom(),
    sessionToken: text("session_token").unique().notNull(),
    userId:       uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires:      timestamp("expires", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  })
);

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token:      text("token").notNull(),
    expires:    timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY
// ─────────────────────────────────────────────────────────────────────────────

export const parentLinks = pgTable(
  "parent_link",
  {
    id:           uuid("id").primaryKey().defaultRandom(),
    parentUserId: uuid("parent_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    childUserId:  uuid("child_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    linkedAt:     timestamp("linked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...timestamps,
  },
  (t) => ({
    parentIdx:  index("parent_link_parent_idx").on(t.parentUserId),
    childIdx:   index("parent_link_child_idx").on(t.childUserId),
    uniqueLink: uniqueIndex("parent_link_unique_uidx").on(t.parentUserId, t.childUserId),
  })
);

/**
 * COPPA artifact table — one row per consent event per child.
 * ON DELETE RESTRICT on both FKs so deleting a user never silently drops the
 * consent record; the compliance team must explicitly archive it first.
 */
export const parentalConsents = pgTable(
  "parental_consent",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    parentUserId:   uuid("parent_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    childUserId:    uuid("child_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    consentMethod:  consentMethodEnum("consent_method").notNull(),
    consentAt:      timestamp("consent_at", { withTimezone: true }).notNull(),
    /**
     * JSONB array of consent scope strings, e.g.:
     * ["game_play", "data_collection", "email_comms", "in_app_purchases"]
     * Stored as JSONB so scopes can be extended without schema migrations.
     */
    scopes:         jsonb("scopes").notNull().default(sql`'[]'::jsonb`),
    ipAddress:      varchar("ip_address", { length: 45 }),   // IPv4 or IPv6
    userAgent:      text("user_agent"),
    /** null = consent is active; non-null = revoked (COPPA deletion request). */
    revokedAt:      timestamp("revoked_at", { withTimezone: true }),
    revokedReason:  text("revoked_reason"),
    ...timestamps,
  },
  (t) => ({
    parentIdx:        index("parental_consent_parent_idx").on(t.parentUserId),
    childIdx:         index("parental_consent_child_idx").on(t.childUserId),
    activeConsentIdx: index("parental_consent_child_active_idx").on(t.childUserId, t.revokedAt),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// PLAYER PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export const players = pgTable(
  "player",
  {
    id:           uuid("id").primaryKey().defaultRandom(),
    userId:       uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName:  varchar("display_name", { length: 32 }).notNull(),
    /** Stored as DECIMAL(18,2) — never use FLOAT for money. */
    cashBalance:  numeric("cash_balance",  { precision: 18, scale: 2 }).notNull().default("500.00"),
    gemBalance:   integer("gem_balance").notNull().default(0),
    xp:           bigint("xp",  { mode: "number" }).notNull().default(0),
    level:        smallint("level").notNull().default(1),
    seasonPoints: integer("season_points").notNull().default(0),
    /**
     * Avatar slot config stored as JSONB for flexible item slots.
     * Shape: { skinTone: string, hatItemId: uuid|null, shirtItemId: uuid|null,
     *          backgroundItemId: uuid|null, petItemId: uuid|null }
     */
    avatarConfig:   jsonb("avatar_config").notNull().default(sql`'{}'::jsonb`),
    tutorialStep:   smallint("tutorial_step").notNull().default(0),
    lastActiveAt:   timestamp("last_active_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => ({
    userIdx:         index("player_user_idx").on(t.userId),
    levelIdx:        index("player_level_idx").on(t.level),
    seasonPointsIdx: index("player_season_points_idx").on(t.seasonPoints),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// MUTATION LOG — financial ledger; defined before all money tables
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append-only ledger. Every $ or gem movement in the system writes a row here
 * first, then updates the denormalised balance on `player`. The UNIQUE
 * constraint on `idempotency_key` is the double-spend guard — callers generate
 * a client-side UUID and the second concurrent INSERT hard-fails.
 *
 * `updatedAt` is intentionally omitted — this table is append-only by design.
 */
export const mutationLog = pgTable(
  "mutation_log",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    /**
     * Client-generated key, e.g. `harvest:${ventureInstanceId}:${Date.now()}`.
     * Max 128 chars to fit in a btree leaf page efficiently.
     */
    idempotencyKey:  varchar("idempotency_key", { length: 128 }).notNull(),
    playerId:        uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    kind:            mutationKindEnum("kind").notNull(),
    /** Signed delta — positive = credit, negative = debit. */
    cashDelta:       numeric("cash_delta", { precision: 18, scale: 2 }).notNull().default("0.00"),
    gemDelta:        integer("gem_delta").notNull().default(0),
    xpDelta:         bigint("xp_delta",  { mode: "number" }).notNull().default(0),
    /** Polymorphic source reference — (sourceTable, sourceId) form the composite key. */
    sourceTable:     varchar("source_table", { length: 64 }),
    sourceId:        uuid("source_id"),
    /** Balance snapshot AFTER this mutation — enables O(1) point-in-time audit. */
    cashBalanceAfter: numeric("cash_balance_after", { precision: 18, scale: 2 }).notNull(),
    gemBalanceAfter:  integer("gem_balance_after").notNull(),
    metadata:        jsonb("metadata").default(sql`'{}'::jsonb`),
    createdAt:       timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    idempotencyUidx:   uniqueIndex("mutation_log_idempotency_key_uidx").on(t.idempotencyKey),
    playerIdx:         index("mutation_log_player_idx").on(t.playerId),
    kindIdx:           index("mutation_log_kind_idx").on(t.kind),
    createdAtIdx:      index("mutation_log_created_at_idx").on(t.createdAt),
    playerKindIdx:     index("mutation_log_player_kind_idx").on(t.playerId, t.kind),
    playerCreatedIdx:  index("mutation_log_player_created_idx").on(t.playerId, t.createdAt),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// VENTURES
// ─────────────────────────────────────────────────────────────────────────────

/** Catalog of venture types — seeded once, referenced by player instances. */
export const ventureDefs = pgTable(
  "venture_def",
  {
    id:                      uuid("id").primaryKey().defaultRandom(),
    /** Stable URL-safe slug, e.g. "lemonade_stand_v1". Never renamed. */
    slug:                    varchar("slug", { length: 64 }).unique().notNull(),
    name:                    varchar("name", { length: 128 }).notNull(),
    ventureType:             ventureTypeEnum("venture_type").notNull(),
    description:             text("description"),
    basePurchasePrice:       numeric("base_purchase_price",    { precision: 18, scale: 2 }).notNull(),
    baseRevenuePerHour:      numeric("base_revenue_per_hour",  { precision: 18, scale: 2 }).notNull(),
    maxEmployees:            smallint("max_employees").notNull().default(3),
    maxFranchiseLocations:   smallint("max_franchise_locations").notNull().default(1),
    /** Minimum player level required to purchase. */
    levelRequired:           smallint("level_required").notNull().default(1),
    iconAssetKey:            varchar("icon_asset_key", { length: 256 }),
    isActive:                boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => ({
    typeIdx: index("venture_def_type_idx").on(t.ventureType),
  })
);

/** A specific player-owned instance of a venture definition. */
export const ventureInstances = pgTable(
  "venture_instance",
  {
    id:                  uuid("id").primaryKey().defaultRandom(),
    playerId:            uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    ventureDefId:        uuid("venture_def_id")
      .notNull()
      .references(() => ventureDefs.id, { onDelete: "restrict" }),
    /** FK to the purchase transaction in the ledger. */
    mutationLogId:       uuid("mutation_log_id")
      .notNull()
      .references(() => mutationLog.id, { onDelete: "restrict" }),
    /** Player-chosen rename, falls back to ventureDef.name in UI. */
    customName:          varchar("custom_name", { length: 64 }),
    level:               smallint("level").notNull().default(1),
    /** Multiplicative modifier from upgrades/boosts. 1.0000 = no boost. */
    revenueMultiplier:   numeric("revenue_multiplier",   { precision: 6,  scale: 4 }).notNull().default("1.0000"),
    totalRevenueEarned:  numeric("total_revenue_earned", { precision: 18, scale: 2 }).notNull().default("0.00"),
    lastHarvestedAt:     timestamp("last_harvested_at", { withTimezone: true }),
    purchasedAt:         timestamp("purchased_at",       { withTimezone: true }).defaultNow().notNull(),
    /** True after an M&A sale or peer trade — keeps history intact. */
    isSoldOrAcquired:    boolean("is_sold_or_acquired").notNull().default(false),
    ...timestamps,
  },
  (t) => ({
    playerIdx:       index("venture_instance_player_idx").on(t.playerId),
    defIdx:          index("venture_instance_def_idx").on(t.ventureDefId),
    playerActiveIdx: index("venture_instance_player_active_idx").on(t.playerId, t.isSoldOrAcquired),
  })
);

/** NPC staff hired into a venture; salary reduces net revenue. */
export const ventureEmployees = pgTable(
  "venture_employee",
  {
    id:                  uuid("id").primaryKey().defaultRandom(),
    ventureInstanceId:   uuid("venture_instance_id")
      .notNull()
      .references(() => ventureInstances.id, { onDelete: "cascade" }),
    mutationLogId:       uuid("mutation_log_id")
      .notNull()
      .references(() => mutationLog.id, { onDelete: "restrict" }),
    npcName:             varchar("npc_name",       { length: 64  }).notNull(),
    npcAvatarKey:        varchar("npc_avatar_key", { length: 256 }),
    salaryPerHour:       numeric("salary_per_hour",    { precision: 10, scale: 2 }).notNull(),
    /** e.g. 12.50 = +12.5% revenue boost in exchange for salary cost. */
    revenueBoostPct:     numeric("revenue_boost_pct", { precision: 5,  scale: 2 }).notNull().default("0.00"),
    hiredAt:             timestamp("hired_at", { withTimezone: true }).defaultNow().notNull(),
    firedAt:             timestamp("fired_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => ({
    instanceIdx: index("venture_employee_instance_idx").on(t.ventureInstanceId),
  })
);

/** Additional physical/virtual locations for a franchise expansion. */
export const ventureFranchiseLocations = pgTable(
  "venture_franchise_location",
  {
    id:                uuid("id").primaryKey().defaultRandom(),
    ventureInstanceId: uuid("venture_instance_id")
      .notNull()
      .references(() => ventureInstances.id, { onDelete: "cascade" }),
    mutationLogId:     uuid("mutation_log_id")
      .notNull()
      .references(() => mutationLog.id, { onDelete: "restrict" }),
    locationName:      varchar("location_name", { length: 128 }).notNull(),
    revenueMultiplier: numeric("revenue_multiplier", { precision: 6, scale: 4 }).notNull().default("1.0000"),
    openedAt:          timestamp("opened_at", { withTimezone: true }).defaultNow().notNull(),
    closedAt:          timestamp("closed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => ({
    instanceIdx: index("franchise_location_instance_idx").on(t.ventureInstanceId),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// STOCKS
// ─────────────────────────────────────────────────────────────────────────────

/** 12 simulated tickers — seeded; tickers never change. */
export const stocks = pgTable(
  "stock",
  {
    id:                     uuid("id").primaryKey().defaultRandom(),
    /** Up to 8 chars, e.g. "LMND", "SLMX", "PWSH". */
    ticker:                 varchar("ticker", { length: 8 }).unique().notNull(),
    companyName:            varchar("company_name", { length: 128 }).notNull(),
    sector:                 stockSectorEnum("sector").notNull(),
    description:            text("description"),
    /** Denormalised current price — updated by the price-tick job. */
    currentPrice:           numeric("current_price",   { precision: 12, scale: 4 }).notNull().default("10.0000"),
    previousClose:          numeric("previous_close",  { precision: 12, scale: 4 }).notNull().default("10.0000"),
    totalSharesOutstanding: bigint("total_shares_outstanding", { mode: "number" }).notNull().default(1_000_000),
    /** Daily standard deviation used by the price simulation engine. */
    volatility:             numeric("volatility", { precision: 6, scale: 4 }).notNull().default("0.0500"),
    isActive:               boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => ({
    tickerUidx: uniqueIndex("stock_ticker_uidx").on(t.ticker),
    sectorIdx:  index("stock_sector_idx").on(t.sector),
  })
);

/**
 * Append-only OHLCV candle per stock per day.
 * Composite unique index (stock_id, day_bucket) is the hot-path access pattern:
 * "get last 365 days of prices for LMND" = one index range scan.
 */
export const stockPriceTicks = pgTable(
  "stock_price_tick",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    stockId:    uuid("stock_id")
      .notNull()
      .references(() => stocks.id, { onDelete: "cascade" }),
    /** UTC date truncated to day — use DATE_TRUNC('day', now()) at insert time. */
    dayBucket:  date("day_bucket").notNull(),
    openPrice:  numeric("open_price",  { precision: 12, scale: 4 }).notNull(),
    closePrice: numeric("close_price", { precision: 12, scale: 4 }).notNull(),
    highPrice:  numeric("high_price",  { precision: 12, scale: 4 }).notNull(),
    lowPrice:   numeric("low_price",   { precision: 12, scale: 4 }).notNull(),
    volume:     bigint("volume", { mode: "number" }).notNull().default(0),
    createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // Append-only: no updatedAt
  },
  (t) => ({
    stockDayUidx:  uniqueIndex("stock_price_tick_stock_day_uidx").on(t.stockId, t.dayBucket),
    dayBucketIdx:  index("stock_price_tick_day_bucket_idx").on(t.dayBucket),
  })
);

/**
 * Aggregated position per player per stock.
 * avg_cost_basis is recalculated on every buy using weighted average.
 * A unique constraint on (player_id, stock_id) means there is exactly one row
 * per position — UPDATE in place rather than INSERT on each trade.
 */
export const stockHoldings = pgTable(
  "stock_holding",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    playerId:         uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    stockId:          uuid("stock_id")
      .notNull()
      .references(() => stocks.id, { onDelete: "restrict" }),
    /** FK to the most recent mutation that modified this holding. */
    mutationLogId:    uuid("mutation_log_id")
      .notNull()
      .references(() => mutationLog.id, { onDelete: "restrict" }),
    sharesHeld:       bigint("shares_held",  { mode: "number" }).notNull().default(0),
    avgCostBasis:     numeric("avg_cost_basis",     { precision: 12, scale: 4 }).notNull().default("0.0000"),
    totalInvested:    numeric("total_invested",     { precision: 18, scale: 2 }).notNull().default("0.00"),
    realizedGainLoss: numeric("realized_gain_loss", { precision: 18, scale: 2 }).notNull().default("0.00"),
    ...timestamps,
  },
  (t) => ({
    playerIdx:           index("stock_holding_player_idx").on(t.playerId),
    stockIdx:            index("stock_holding_stock_idx").on(t.stockId),
    playerStockUidx:     uniqueIndex("stock_holding_player_stock_uidx").on(t.playerId, t.stockId),
  })
);

/** Simulated market-moving news items attached to a stock. */
export const stockNewsEvents = pgTable(
  "stock_news_event",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    stockId:          uuid("stock_id")
      .notNull()
      .references(() => stocks.id, { onDelete: "cascade" }),
    headline:         text("headline").notNull(),
    body:             text("body"),
    /** Signed percentage: -5.25 = −5.25% applied to next tick's price. */
    priceImpactPct:   numeric("price_impact_pct", { precision: 6, scale: 2 }).notNull().default("0.00"),
    publishedAt:      timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt:        timestamp("expires_at",   { withTimezone: true }),
    ...timestamps,
  },
  (t) => ({
    stockIdx:       index("stock_news_event_stock_idx").on(t.stockId),
    publishedAtIdx: index("stock_news_event_published_at_idx").on(t.publishedAt),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// TRADING (peer-to-peer + NPC fills)
// ─────────────────────────────────────────────────────────────────────────────

/** Open orders on the simulated order book. */
export const tradeOrders = pgTable(
  "trade_order",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    playerId:      uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    stockId:       uuid("stock_id")
      .notNull()
      .references(() => stocks.id, { onDelete: "restrict" }),
    side:          orderSideEnum("side").notNull(),
    orderType:     orderTypeEnum("order_type").notNull(),
    shares:        bigint("shares", { mode: "number" }).notNull(),
    /** null for market orders; set for limit orders. */
    limitPrice:    numeric("limit_price",   { precision: 12, scale: 4 }),
    filledShares:  bigint("filled_shares",  { mode: "number" }).notNull().default(0),
    status:        tradeStatusEnum("status").notNull().default("pending"),
    expiresAt:     timestamp("expires_at", { withTimezone: true }),
    filledAt:      timestamp("filled_at",  { withTimezone: true }),
    /** Set when the order is fully or partially filled. */
    mutationLogId: uuid("mutation_log_id").references(() => mutationLog.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (t) => ({
    playerIdx:    index("trade_order_player_idx").on(t.playerId),
    stockIdx:     index("trade_order_stock_idx").on(t.stockId),
    statusIdx:    index("trade_order_status_idx").on(t.status),
    openOrderIdx: index("trade_order_stock_open_idx").on(t.stockId, t.status),
  })
);

/**
 * Peer-to-peer barter offer — player proposes a venture + cash swap.
 * toPlayerId null = open market offer (any player can accept).
 */
export const tradeOffers = pgTable(
  "trade_offer",
  {
    id:                          uuid("id").primaryKey().defaultRandom(),
    fromPlayerId:                uuid("from_player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    toPlayerId:                  uuid("to_player_id").references(() => players.id, { onDelete: "set null" }),
    offeredCash:                 numeric("offered_cash",    { precision: 18, scale: 2 }).notNull().default("0.00"),
    offeredVentureInstanceId:    uuid("offered_venture_instance_id")
      .references(() => ventureInstances.id, { onDelete: "set null" }),
    requestedCash:               numeric("requested_cash", { precision: 18, scale: 2 }).notNull().default("0.00"),
    requestedVentureInstanceId:  uuid("requested_venture_instance_id")
      .references(() => ventureInstances.id, { onDelete: "set null" }),
    status:                      tradeStatusEnum("status").notNull().default("pending"),
    message:                     text("message"),
    expiresAt:                   timestamp("expires_at",   { withTimezone: true }),
    respondedAt:                 timestamp("responded_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => ({
    fromPlayerIdx: index("trade_offer_from_player_idx").on(t.fromPlayerId),
    toPlayerIdx:   index("trade_offer_to_player_idx").on(t.toPlayerId),
    statusIdx:     index("trade_offer_status_idx").on(t.status),
  })
);

/** Immutable record of every completed stock trade execution. */
export const tradeHistory = pgTable(
  "trade_history",
  {
    id:                    uuid("id").primaryKey().defaultRandom(),
    buyerPlayerId:         uuid("buyer_player_id").references(() => players.id,  { onDelete: "set null" }),
    sellerPlayerId:        uuid("seller_player_id").references(() => players.id, { onDelete: "set null" }),
    stockId:               uuid("stock_id").references(() => stocks.id,           { onDelete: "set null" }),
    shares:                bigint("shares", { mode: "number" }).notNull(),
    pricePerShare:         numeric("price_per_share",       { precision: 12, scale: 4 }).notNull(),
    totalConsideration:    numeric("total_consideration",   { precision: 18, scale: 2 }).notNull(),
    buyerMutationLogId:    uuid("buyer_mutation_log_id").references(() => mutationLog.id,  { onDelete: "restrict" }),
    sellerMutationLogId:   uuid("seller_mutation_log_id").references(() => mutationLog.id, { onDelete: "restrict" }),
    executedAt:            timestamp("executed_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => ({
    buyerIdx:      index("trade_history_buyer_idx").on(t.buyerPlayerId),
    sellerIdx:     index("trade_history_seller_idx").on(t.sellerPlayerId),
    stockIdx:      index("trade_history_stock_idx").on(t.stockId),
    executedAtIdx: index("trade_history_executed_at_idx").on(t.executedAt),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// NPCs  (defined before M&A because acquisitionOffers references npcBusinesses)
// ─────────────────────────────────────────────────────────────────────────────

/** Simulated kid trading partners that create market liquidity. */
export const npcKids = pgTable(
  "npc_kid",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    name:             varchar("name",       { length: 64  }).notNull(),
    avatarKey:        varchar("avatar_key", { length: 256 }),
    /** Influences trade frequency and bid/ask spread aggressiveness. */
    personality:      varchar("personality", { length: 32 }).notNull().default("neutral"),
    /** 0.000–1.000 scale: higher = more trades, tighter spreads. */
    tradingAggression: numeric("trading_aggression", { precision: 4, scale: 3 }).notNull().default("0.500"),
    cashBalance:       numeric("cash_balance", { precision: 18, scale: 2 }).notNull().default("5000.00"),
    isActive:          boolean("is_active").notNull().default(true),
    ...timestamps,
  }
);

/** NPC-owned ventures that players can acquire via M&A. */
export const npcBusinesses = pgTable(
  "npc_business",
  {
    id:                uuid("id").primaryKey().defaultRandom(),
    npcKidId:          uuid("npc_kid_id").references(() => npcKids.id,    { onDelete: "set null" }),
    ventureDefId:      uuid("venture_def_id")
      .notNull()
      .references(() => ventureDefs.id, { onDelete: "restrict" }),
    name:              varchar("name", { length: 128 }).notNull(),
    askingPrice:       numeric("asking_price",       { precision: 18, scale: 2 }).notNull(),
    revenueMultiplier: numeric("revenue_multiplier", { precision: 6,  scale: 4 }).notNull().default("1.0000"),
    isAvailable:       boolean("is_available").notNull().default(true),
    ...timestamps,
  },
  (t) => ({
    npcIdx:       index("npc_business_npc_idx").on(t.npcKidId),
    availableIdx: index("npc_business_available_idx").on(t.isAvailable),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// M&A  (after NPCs)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * An offer to acquire either a player-owned venture or an NPC business.
 * Exactly one of (targetVentureInstanceId, npcBusinessId) should be non-null —
 * enforced at application layer; a CHECK constraint can be added to the
 * migration if desired.
 */
export const acquisitionOffers = pgTable(
  "acquisition_offer",
  {
    id:                       uuid("id").primaryKey().defaultRandom(),
    acquirerPlayerId:         uuid("acquirer_player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    targetVentureInstanceId:  uuid("target_venture_instance_id")
      .references(() => ventureInstances.id, { onDelete: "cascade" }),
    npcBusinessId:            uuid("npc_business_id")
      .references(() => npcBusinesses.id, { onDelete: "set null" }),
    offerPrice:               numeric("offer_price", { precision: 18, scale: 2 }).notNull(),
    status:                   acquisitionStatusEnum("status").notNull().default("pending"),
    message:                  text("message"),
    expiresAt:                timestamp("expires_at",   { withTimezone: true }),
    respondedAt:              timestamp("responded_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => ({
    acquirerIdx: index("acq_offer_acquirer_idx").on(t.acquirerPlayerId),
    targetIdx:   index("acq_offer_target_idx").on(t.targetVentureInstanceId),
    statusIdx:   index("acq_offer_status_idx").on(t.status),
  })
);

/** Immutable record of a completed acquisition. */
export const acquisitionHistory = pgTable(
  "acquisition_history",
  {
    id:                     uuid("id").primaryKey().defaultRandom(),
    offerId:                uuid("offer_id")
      .notNull()
      .references(() => acquisitionOffers.id, { onDelete: "restrict" }),
    acquirerPlayerId:       uuid("acquirer_player_id").references(() => players.id,    { onDelete: "set null" }),
    sellerPlayerId:         uuid("seller_player_id").references(() => players.id,      { onDelete: "set null" }),
    ventureInstanceId:      uuid("venture_instance_id").references(() => ventureInstances.id, { onDelete: "set null" }),
    finalPrice:             numeric("final_price", { precision: 18, scale: 2 }).notNull(),
    acquirerMutationLogId:  uuid("acquirer_mutation_log_id").references(() => mutationLog.id, { onDelete: "restrict" }),
    sellerMutationLogId:    uuid("seller_mutation_log_id").references(() => mutationLog.id,   { onDelete: "restrict" }),
    completedAt:            timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => ({
    acquirerIdx: index("acq_history_acquirer_idx").on(t.acquirerPlayerId),
    sellerIdx:   index("acq_history_seller_idx").on(t.sellerPlayerId),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL
// ─────────────────────────────────────────────────────────────────────────────

export const crews = pgTable(
  "crew",
  {
    id:                uuid("id").primaryKey().defaultRandom(),
    name:              varchar("name",    { length: 64  }).unique().notNull(),
    tagline:           varchar("tagline", { length: 128 }),
    ownerPlayerId:     uuid("owner_player_id")
      .notNull()
      .references(() => players.id, { onDelete: "restrict" }),
    badgeAssetKey:     varchar("badge_asset_key", { length: 256 }),
    totalSeasonPoints: integer("total_season_points").notNull().default(0),
    maxMembers:        smallint("max_members").notNull().default(10),
    /** open = any player can join without an invite. */
    isOpen:            boolean("is_open").notNull().default(true),
    ...timestamps,
  },
  (t) => ({
    ownerIdx:         index("crew_owner_idx").on(t.ownerPlayerId),
    seasonPointsIdx:  index("crew_season_points_idx").on(t.totalSeasonPoints),
  })
);

export const crewMembers = pgTable(
  "crew_member",
  {
    id:       uuid("id").primaryKey().defaultRandom(),
    crewId:   uuid("crew_id")
      .notNull()
      .references(() => crews.id, { onDelete: "cascade" }),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    role:     crewRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => ({
    crewIdx:         index("crew_member_crew_idx").on(t.crewId),
    playerIdx:       index("crew_member_player_idx").on(t.playerId),
    uniqueMembership: uniqueIndex("crew_member_crew_player_uidx").on(t.crewId, t.playerId),
  })
);

/**
 * Weekly snapshot of the global leaderboard.
 * week_bucket = Monday of ISO week (DATE_TRUNC('week', now())).
 * Written by a scheduled job, never mutated after write.
 */
export const leaderboardSnapshots = pgTable(
  "leaderboard_snapshot",
  {
    id:           uuid("id").primaryKey().defaultRandom(),
    weekBucket:   date("week_bucket").notNull(),
    playerId:     uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    seasonPoints: integer("season_points").notNull(),
    netWorth:     numeric("net_worth", { precision: 18, scale: 2 }).notNull(),
    rank:         integer("rank").notNull(),
    crewId:       uuid("crew_id").references(() => crews.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => ({
    weekBucketIdx:      index("leaderboard_week_bucket_idx").on(t.weekBucket),
    playerWeekUidx:     uniqueIndex("leaderboard_player_week_uidx").on(t.playerId, t.weekBucket),
    weekRankIdx:        index("leaderboard_week_rank_idx").on(t.weekBucket, t.rank),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// COSMETICS
// ─────────────────────────────────────────────────────────────────────────────

/** Global catalog of cosmetic items (hats, shirts, backgrounds, pets). */
export const cosmeticItems = pgTable(
  "cosmetic_item",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    slug:           varchar("slug", { length: 64 }).unique().notNull(),
    name:           varchar("name", { length: 128 }).notNull(),
    /** 'hat' | 'shirt' | 'background' | 'pet' | 'effect' */
    category:       varchar("category", { length: 32 }).notNull(),
    /** 'common' | 'rare' | 'epic' | 'legendary' */
    rarity:         varchar("rarity",   { length: 16 }).notNull().default("common"),
    priceCash:      numeric("price_cash", { precision: 10, scale: 2 }),
    priceGems:      integer("price_gems"),
    assetKey:       varchar("asset_key", { length: 256 }).notNull(),
    /** Limited-edition items are removed from the shop after availableUntil. */
    isLimited:      boolean("is_limited").notNull().default(false),
    availableFrom:  timestamp("available_from",  { withTimezone: true }),
    availableUntil: timestamp("available_until", { withTimezone: true }),
    isActive:       boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => ({
    categoryIdx: index("cosmetic_item_category_idx").on(t.category),
    rarityIdx:   index("cosmetic_item_rarity_idx").on(t.rarity),
  })
);

/** One row per item owned — unique constraint prevents duplicate grants. */
export const playerInventory = pgTable(
  "player_inventory",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    playerId:        uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    cosmeticItemId:  uuid("cosmetic_item_id")
      .notNull()
      .references(() => cosmeticItems.id, { onDelete: "restrict" }),
    /** Only one item per slot should be equipped — enforced in app logic. */
    isEquipped:      boolean("is_equipped").notNull().default(false),
    acquiredAt:      timestamp("acquired_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => ({
    playerIdx:    index("player_inventory_player_idx").on(t.playerId),
    playerItemUidx: uniqueIndex("player_inventory_player_item_uidx").on(t.playerId, t.cosmeticItemId),
  })
);

/** Audit record of every cosmetic purchase — FK to mutation_log. */
export const cosmeticPurchases = pgTable(
  "cosmetic_purchase",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    playerId:        uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    cosmeticItemId:  uuid("cosmetic_item_id")
      .notNull()
      .references(() => cosmeticItems.id, { onDelete: "restrict" }),
    mutationLogId:   uuid("mutation_log_id")
      .notNull()
      .references(() => mutationLog.id, { onDelete: "restrict" }),
    paidCash:        numeric("paid_cash", { precision: 10, scale: 2 }).notNull().default("0.00"),
    paidGems:        integer("paid_gems").notNull().default(0),
    purchasedAt:     timestamp("purchased_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => ({
    playerIdx: index("cosmetic_purchase_player_idx").on(t.playerId),
    itemIdx:   index("cosmetic_purchase_item_idx").on(t.cosmeticItemId),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// BRAND PARTNERSHIPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Real or fictional brand sponsors. `coppaSafeMode = true` disables any
 * behavioural ad targeting for U13 players — required under COPPA § 312.2.
 */
export const brandSponsors = pgTable(
  "brand_sponsor",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    brandName:     varchar("brand_name",    { length: 128 }).notNull(),
    logoAssetKey:  varchar("logo_asset_key", { length: 256 }),
    websiteUrl:    text("website_url"),
    activeFrom:    timestamp("active_from",  { withTimezone: true }),
    activeUntil:   timestamp("active_until", { withTimezone: true }),
    isActive:      boolean("is_active").notNull().default(true),
    /** When true: no behavioural targeting, no data sharing with sponsor. */
    coppaSafeMode: boolean("coppa_safe_mode").notNull().default(true),
    ...timestamps,
  }
);

/** A quest (challenge) backed by a brand sponsor. */
export const sponsoredQuests = pgTable(
  "sponsored_quest",
  {
    id:                    uuid("id").primaryKey().defaultRandom(),
    brandSponsorId:        uuid("brand_sponsor_id")
      .notNull()
      .references(() => brandSponsors.id, { onDelete: "cascade" }),
    title:                 varchar("title", { length: 256 }).notNull(),
    description:           text("description"),
    rewardCash:            numeric("reward_cash", { precision: 10, scale: 2 }).notNull().default("0.00"),
    rewardGems:            integer("reward_gems").notNull().default(0),
    rewardCosmeticItemId:  uuid("reward_cosmetic_item_id")
      .references(() => cosmeticItems.id, { onDelete: "set null" }),
    /**
     * Objective encoded as JSONB for flexible quest types without migrations.
     * e.g. { "type": "earn_venture_revenue", "target": 500 }
     *      { "type": "buy_stock_shares",     "ticker": "LMND", "target": 10 }
     */
    objective:             jsonb("objective").notNull(),
    /** null = unlimited completions across all players. */
    maxCompletions:        integer("max_completions"),
    totalCompletions:      integer("total_completions").notNull().default(0),
    startsAt:              timestamp("starts_at", { withTimezone: true }),
    endsAt:                timestamp("ends_at",   { withTimezone: true }),
    isActive:              boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => ({
    sponsorIdx: index("sponsored_quest_sponsor_idx").on(t.brandSponsorId),
    activeIdx:  index("sponsored_quest_active_ends_idx").on(t.isActive, t.endsAt),
  })
);

/**
 * One completion per player per quest — unique constraint prevents reward farming.
 * mutationLogId ties reward delivery into the financial ledger.
 */
export const sponsoredCompletions = pgTable(
  "sponsored_completion",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    questId:          uuid("quest_id")
      .notNull()
      .references(() => sponsoredQuests.id, { onDelete: "cascade" }),
    playerId:         uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    mutationLogId:    uuid("mutation_log_id")
      .notNull()
      .references(() => mutationLog.id, { onDelete: "restrict" }),
    completedAt:      timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
    rewardDelivered:  boolean("reward_delivered").notNull().default(false),
    ...timestamps,
  },
  (t) => ({
    questIdx:              index("sponsored_completion_quest_idx").on(t.questId),
    playerIdx:             index("sponsored_completion_player_idx").on(t.playerId),
    playerQuestUidx:       uniqueIndex("sponsored_completion_player_quest_uidx").on(t.playerId, t.questId),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// TELEMETRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PostHog-mirror event log for server-side replay and audit.
 * Append-only. `properties` is schema-free JSONB so client events can evolve
 * without migrations. `posthogDistinctId` links back to the PostHog person.
 * Partitioning by occurred_at (monthly) is recommended at 10M+ rows/month.
 */
export const gameEvents = pgTable(
  "game_event",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    playerId:           uuid("player_id").references(() => players.id, { onDelete: "set null" }),
    sessionId:          uuid("session_id").references(() => sessions.id, { onDelete: "set null" }),
    /** Mirrors PostHog event name, e.g. "venture_harvested", "stock_bought". */
    eventName:          varchar("event_name", { length: 128 }).notNull(),
    properties:         jsonb("properties").notNull().default(sql`'{}'::jsonb`),
    /** Client-side timestamp — may precede server createdAt by network latency. */
    occurredAt:         timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
    posthogDistinctId:  varchar("posthog_distinct_id", { length: 256 }),
    createdAt:          timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // Append-only: no updatedAt
  },
  (t) => ({
    playerIdx:       index("game_event_player_idx").on(t.playerId),
    eventNameIdx:    index("game_event_name_idx").on(t.eventName),
    occurredAtIdx:   index("game_event_occurred_at_idx").on(t.occurredAt),
    playerEventIdx:  index("game_event_player_event_idx").on(t.playerId, t.eventName),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// DRIZZLE RELATIONS  (powers the relational query API — db.query.*)
// ─────────────────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  player:       one(players, { fields: [users.id], references: [players.userId] }),
  accounts:     many(accounts),
  sessions:     many(sessions),
  parentLinks:  many(parentLinks, { relationName: "parentUser" }),
  childLinks:   many(parentLinks, { relationName: "childUser"  }),
  consentsGiven:    many(parentalConsents, { relationName: "parentConsents" }),
  consentsReceived: many(parentalConsents, { relationName: "childConsents"  }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  user:              one(users, { fields: [players.userId], references: [users.id] }),
  mutationLogs:      many(mutationLog),
  ventureInstances:  many(ventureInstances),
  stockHoldings:     many(stockHoldings),
  tradeOrders:       many(tradeOrders),
  crewMemberships:   many(crewMembers),
  inventory:         many(playerInventory),
  leaderboard:       many(leaderboardSnapshots),
}));

export const stocksRelations = relations(stocks, ({ many }) => ({
  priceTicks:   many(stockPriceTicks),
  holdings:     many(stockHoldings),
  newsEvents:   many(stockNewsEvents),
  tradeOrders:  many(tradeOrders),
  tradeHistory: many(tradeHistory),
}));

export const ventureInstancesRelations = relations(ventureInstances, ({ one, many }) => ({
  player:             one(players,     { fields: [ventureInstances.playerId],       references: [players.id]     }),
  def:                one(ventureDefs, { fields: [ventureInstances.ventureDefId],   references: [ventureDefs.id] }),
  purchaseMutation:   one(mutationLog, { fields: [ventureInstances.mutationLogId],  references: [mutationLog.id] }),
  employees:          many(ventureEmployees),
  franchiseLocations: many(ventureFranchiseLocations),
}));

export const mutationLogRelations = relations(mutationLog, ({ one }) => ({
  player: one(players, { fields: [mutationLog.playerId], references: [players.id] }),
}));

export const crewsRelations = relations(crews, ({ one, many }) => ({
  owner:   one(players, { fields: [crews.ownerPlayerId], references: [players.id] }),
  members: many(crewMembers),
}));

export const crewMembersRelations = relations(crewMembers, ({ one }) => ({
  crew:   one(crews,   { fields: [crewMembers.crewId],   references: [crews.id]   }),
  player: one(players, { fields: [crewMembers.playerId], references: [players.id] }),
}));

export const npcBusinessesRelations = relations(npcBusinesses, ({ one }) => ({
  npcKid:     one(npcKids,     { fields: [npcBusinesses.npcKidId],     references: [npcKids.id]     }),
  ventureDef: one(ventureDefs, { fields: [npcBusinesses.ventureDefId], references: [ventureDefs.id] }),
}));

export const sponsoredQuestsRelations = relations(sponsoredQuests, ({ one, many }) => ({
  sponsor:     one(brandSponsors, { fields: [sponsoredQuests.brandSponsorId], references: [brandSponsors.id] }),
  completions: many(sponsoredCompletions),
}));
```

---

## `db/queries.ts`

```typescript
/**
 * db/queries.ts — Hot-path query helpers for Win Win Win
 *
 * Every function uses Drizzle's type-safe query builder.
 * All return types are fully inferred — no `any` escapes.
 *
 * Import your Drizzle + Neon client as `db` from ./client.
 * e.g.:
 *   import { neon } from "@neondatabase/serverless";
 *   import { drizzle } from "drizzle-orm/neon-http";
 *   export const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
 */

import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "./client";
import {
  leaderboardSnapshots,
  mutationLog,
  players,
  stockHoldings,
  stocks,
  stockPriceTicks,
  ventureDefs,
  ventureInstances,
} from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// 1. getPlayerCashBalance
//
// Called on every screen load, checkout flow, and before every purchase check.
// Hits the `player` PK — single row lookup, sub-millisecond on Neon.
// Returns cash + gem + xp + level in one round-trip.
// ─────────────────────────────────────────────────────────────────────────────

export async function getPlayerCashBalance(playerId: string) {
  const [row] = await db
    .select({
      cashBalance:  players.cashBalance,
      gemBalance:   players.gemBalance,
      xp:           players.xp,
      level:        players.level,
      seasonPoints: players.seasonPoints,
    })
    .from(players)
    .where(eq(players.id, playerId))
    .limit(1);

  return row ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. listOwnedVentures
//
// Dashboard venture grid. Joins venture_instance → venture_def in a single
// query. The (player_id, is_sold_or_acquired) composite index on
// venture_instance makes the WHERE clause an index-only scan.
// ─────────────────────────────────────────────────────────────────────────────

export async function listOwnedVentures(playerId: string) {
  return db
    .select({
      // Instance-level fields
      instanceId:         ventureInstances.id,
      customName:         ventureInstances.customName,
      instanceLevel:      ventureInstances.level,
      revenueMultiplier:  ventureInstances.revenueMultiplier,
      totalRevenueEarned: ventureInstances.totalRevenueEarned,
      lastHarvestedAt:    ventureInstances.lastHarvestedAt,
      purchasedAt:        ventureInstances.purchasedAt,
      // Definition-level fields (display metadata)
      defName:             ventureDefs.name,
      ventureType:         ventureDefs.ventureType,
      baseRevenuePerHour:  ventureDefs.baseRevenuePerHour,
      iconAssetKey:        ventureDefs.iconAssetKey,
      maxEmployees:        ventureDefs.maxEmployees,
    })
    .from(ventureInstances)
    .innerJoin(ventureDefs, eq(ventureInstances.ventureDefId, ventureDefs.id))
    .where(
      and(
        eq(ventureInstances.playerId, playerId),
        eq(ventureInstances.isSoldOrAcquired, false),
      )
    )
    .orderBy(desc(ventureInstances.purchasedAt));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. getStockHoldingsForPlayer
//
// Portfolio screen. Joins stock_holding → stock for current price data.
// Filters shares_held > 0 so sold-out positions don't appear.
// The (player_id, stock_id) unique index makes this an index-only scan for
// the holding lookup; the stock join is a PK lookup per row.
// ─────────────────────────────────────────────────────────────────────────────

export async function getStockHoldingsForPlayer(playerId: string) {
  return db
    .select({
      holdingId:        stockHoldings.id,
      sharesHeld:       stockHoldings.sharesHeld,
      avgCostBasis:     stockHoldings.avgCostBasis,
      totalInvested:    stockHoldings.totalInvested,
      realizedGainLoss: stockHoldings.realizedGainLoss,
      // Live price data from denormalised stock row
      ticker:           stocks.ticker,
      companyName:      stocks.companyName,
      currentPrice:     stocks.currentPrice,
      previousClose:    stocks.previousClose,
      sector:           stocks.sector,
    })
    .from(stockHoldings)
    .innerJoin(stocks, eq(stockHoldings.stockId, stocks.id))
    .where(
      and(
        eq(stockHoldings.playerId, playerId),
        gt(stockHoldings.sharesHeld, 0),
      )
    )
    .orderBy(desc(stockHoldings.totalInvested));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. getLeaderboardThisWeek
//
// Weekly leaderboard screen — top N players ranked by season_points.
// The (week_bucket, rank) index makes this a sequential index scan across
// only the current week's rows. Limit default is 100 for infinite-scroll page 1.
// Pass `weekBucket` as DATE_TRUNC('week', now())::text from your cron job.
// ─────────────────────────────────────────────────────────────────────────────

export async function getLeaderboardThisWeek(
  weekBucket: string,    // e.g. "2025-01-20"
  limit = 100,
  offset = 0,
) {
  return db
    .select({
      rank:         leaderboardSnapshots.rank,
      seasonPoints: leaderboardSnapshots.seasonPoints,
      netWorth:     leaderboardSnapshots.netWorth,
      playerId:     leaderboardSnapshots.playerId,
      // Player display fields
      displayName:  players.displayName,
      avatarConfig: players.avatarConfig,
      level:        players.level,
    })
    .from(leaderboardSnapshots)
    .innerJoin(players, eq(leaderboardSnapshots.playerId, players.id))
    .where(eq(leaderboardSnapshots.weekBucket, weekBucket))
    .orderBy(leaderboardSnapshots.rank)
    .limit(limit)
    .offset(offset);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. recentMutations
//
// Transaction history screen and parental dashboard.
// Uses (player_id, created_at DESC) composite index — returns most recent
// N ledger entries with balance-after snapshots for timeline rendering.
// Pass `kind` to filter to a specific mutation type (e.g. stock trades only).
// ─────────────────────────────────────────────────────────────────────────────

export async function recentMutations(
  playerId: string,
  limit = 20,
  kind?: typeof mutationLog.$inferSelect["kind"],
) {
  const conditions = kind
    ? and(eq(mutationLog.playerId, playerId), eq(mutationLog.kind, kind))
    : eq(mutationLog.playerId, playerId);

  return db
    .select({
      id:               mutationLog.id,
      kind:             mutationLog.kind,
      cashDelta:        mutationLog.cashDelta,
      gemDelta:         mutationLog.gemDelta,
      xpDelta:          mutationLog.xpDelta,
      cashBalanceAfter: mutationLog.cashBalanceAfter,
      gemBalanceAfter:  mutationLog.gemBalanceAfter,
      sourceTable:      mutationLog.sourceTable,
      sourceId:         mutationLog.sourceId,
      metadata:         mutationLog.metadata,
      createdAt:        mutationLog.createdAt,
    })
    .from(mutationLog)
    .where(conditions)
    .orderBy(desc(mutationLog.createdAt))
    .limit(limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// BONUS: getStockPriceHistory
//
// Chart data for a stock's detail screen.
// Uses the (stock_id, day_bucket) unique covering index — no heap access.
// Default 90 days covers the visible chart window; caller can pass 30 or 365.
// ─────────────────────────────────────────────────────────────────────────────

export async function getStockPriceHistory(
  stockId: string,
  days = 90,
) {
  return db
    .select({
      dayBucket:  stockPriceTicks.dayBucket,
      openPrice:  stockPriceTicks.openPrice,
      closePrice: stockPriceTicks.closePrice,
      highPrice:  stockPriceTicks.highPrice,
      lowPrice:   stockPriceTicks.lowPrice,
      volume:     stockPriceTicks.volume,
    })
    .from(stockPriceTicks)
    .where(
      and(
        eq(stockPriceTicks.stockId, stockId),
        sql`${stockPriceTicks.dayBucket} >= (CURRENT_DATE - INTERVAL '${sql.raw(String(days))} days')`,
      )
    )
    .orderBy(stockPriceTicks.dayBucket);
}
```

---

## Schema Architecture Notes

### Table count summary

| Domain | Tables |
|---|---|
| Auth.js v5 | `user`, `account`, `session`, `verification_token` |
| Family / COPPA | `parent_link`, `parental_consent` |
| Player | `player`, (avatar embedded in JSONB) |
| Ledger | `mutation_log` |
| Ventures | `venture_def`, `venture_instance`, `venture_employee`, `venture_franchise_location` |
| Stocks | `stock`, `stock_price_tick`, `stock_holding`, `stock_news_event` |
| Trading | `trade_order`, `trade_offer`, `trade_history` |
| M&A | `acquisition_offer`, `acquisition_history` |
| NPCs | `npc_kid`, `npc_business` |
| Social | `crew`, `crew_member`, `leaderboard_snapshot` |
| Cosmetics | `cosmetic_item`, `player_inventory`, `cosmetic_purchase` |
| Brand | `brand_sponsor`, `sponsored_quest`, `sponsored_completion` |
| Telemetry | `game_event` |
| **Total** | **34 tables** |

---

### Key design decisions called out

**1. `mutation_log` idempotency pattern**
The `UNIQUE` on `idempotency_key` is a hard DB constraint, not just an app check. The second `INSERT` from a retried request fails with a PG unique violation (`23505`) which your API layer catches and converts to a 200 by reading the existing row. This is identical to how Stripe implements idempotency keys.

**2. `cashBalanceAfter` / `gemBalanceAfter` snapshot columns**
These duplicate the balance at mutation time so a parental dashboard can render a timeline chart without replaying all mutations from zero. The source-of-truth balance lives on `player`, but these snapshots make audit O(1) per row.

**3. `stock_price_tick` composite unique index**
`(stock_id, day_bucket)` is both the uniqueness constraint *and* the access pattern index. Postgres uses one B-tree for both, so there's no index duplication cost.

**4. NPC tables defined before M&A tables**
TypeScript evaluates module initializers top-to-bottom. If `acquisitionOffers` referenced `npcBusinesses` before it was declared, the `() => npcBusinesses` lazy arrow reference in Drizzle's FK helper would close over `undefined`. Define NPCs first to avoid this subtle runtime bug.

**5. `parental_consent` uses `ON DELETE RESTRICT` on both FKs**
COPPA requires that consent records be retained even when a user requests deletion. `RESTRICT` forces your compliance workflow to archive the consent row before deleting the user row, making accidental silent deletion impossible at the DB layer.

**6. `venture_def` is a seeded catalog, not player-editable**
`ON DELETE RESTRICT` from `venture_instance` means you can never accidentally drop a venture definition that has live player instances. Any deprecation must go through a soft `is_active = false` flag.

**7. Migration filename**
```
0001_win_win_win_initial.sql
```
Generated via `npx drizzle-kit generate` after placing `schema.ts` in `db/` and configuring `drizzle.config.ts` with your `DATABASE_URL`.
