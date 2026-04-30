"use client";
import { MARKETS_STORAGE_KEY, MarketsState, newMarketsState, tickPrices } from "./markets";

export function loadMarkets(): MarketsState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MARKETS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MarketsState;
    return tickPrices(parsed);
  } catch {
    return null;
  }
}

export function saveMarkets(s: MarketsState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MARKETS_STORAGE_KEY, JSON.stringify(s));
}

export function resetMarkets(): MarketsState {
  const fresh = newMarketsState();
  saveMarkets(fresh);
  return fresh;
}
