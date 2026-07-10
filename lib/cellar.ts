/**
 * Storage layer for "My Infinite Cellar™".
 *
 * v1 persists to the visitor's own browser (localStorage) — no accounts,
 * no backend. Every consumer goes through this module's functions rather
 * than touching localStorage directly, so swapping this for a real
 * account-backed store later (e.g. Supabase) only means rewriting the
 * functions in this file — the UI and CellarProvider stay the same.
 */

export type CellarItem = {
  passportNumber: string;
  addedAt: string;
};

const STORAGE_KEY = "infinite-cellar:v1";
const EMPTY: CellarItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CellarItem[] = EMPTY;

function isValidCellarItem(item: unknown): item is CellarItem {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as CellarItem).passportNumber === "string" &&
    typeof (item as CellarItem).addedAt === "string"
  );
}

/** Returns a stable array reference when the underlying data hasn't changed, as required by useSyncExternalStore. */
export function readCellar(): CellarItem[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    // Drop anything that doesn't match today's shape — e.g. entries saved
    // before the pre-launch lotId -> passportNumber rename. Never hand a
    // malformed item to a consumer; better to silently omit it than crash
    // the page (getCoffeeByPassportNumber assumes a real string).
    cachedItems = Array.isArray(parsed) ? parsed.filter(isValidCellarItem) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

export function getServerCellarSnapshot(): CellarItem[] {
  return EMPTY;
}

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) listener();
}

export function subscribeToCellar(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) emitChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function writeCellar(items: CellarItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitChange();
}

export function addToCellar(passportNumber: string): void {
  const items = readCellar();
  if (items.some((item) => item.passportNumber === passportNumber)) return;
  writeCellar([...items, { passportNumber, addedAt: new Date().toISOString() }]);
}

export function removeFromCellar(passportNumber: string): void {
  writeCellar(readCellar().filter((item) => item.passportNumber !== passportNumber));
}
