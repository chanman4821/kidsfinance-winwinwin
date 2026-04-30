"use client";
import { defaultChores, GameState, STORAGE_KEY, todayStr } from "./game";

export function loadState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function saveState(s: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function newGame(kidName: string, ageBand: GameState["ageBand"], petName: string): GameState {
  return {
    kidName,
    ageBand,
    petName,
    petStage: 0,
    xp: 0,
    streakDays: 1,
    lastPlayDate: todayStr(),
    jars: { save: 0, spend: 0, give: 0 },
    goal: null,
    chores: defaultChores(),
    lessonsCompleted: [],
    badges: [],
    createdAt: new Date().toISOString(),
  };
}
