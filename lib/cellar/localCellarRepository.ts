import type { CellarItem, CellarListener, CellarRepository } from "./types";

/**
 * v1 storage for "My Infinite Cellar™": the visitor's own browser
 * (localStorage), no accounts, no backend. This is the implementation
 * actually used by the app today — see ./index.ts.
 */

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
function list(): CellarItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    const parsed = raw ? JSON.parse(raw) : [];
    // Drop anything that doesn't match today's shape — e.g. entries saved
    // before the pre-launch lotId -> passportNumber rename. Never hand a
    // malformed item to a consumer; better to silently omit it than crash
    // the page (getCoffeeByPassportNumber assumes a real string).
    cachedItems = Array.isArray(parsed) ? parsed.filter(isValidCellarItem) : EMPTY;
  } catch {
    // localStorage.getItem itself can throw, not just JSON.parse — e.g.
    // storage disabled by browser policy/private mode. Degrade to "Cellar
    // looks empty" rather than crash the page.
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function getServerSnapshot(): CellarItem[] {
  return EMPTY;
}

const listeners = new Set<CellarListener>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: CellarListener): () => void {
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

function write(items: CellarItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    // Storage disabled or full — nothing persisted, so don't emitChange()
    // and claim it was. add()/remove() will look like a no-op rather than
    // crash; isSaved() correctly keeps reporting the true (unsaved) state.
    console.error("Cellar write failed:", err);
    return;
  }
  emitChange();
}

function add(passportNumber: string): void {
  const items = list();
  if (items.some((item) => item.passportNumber === passportNumber)) return;
  write([...items, { passportNumber, addedAt: new Date().toISOString() }]);
}

function remove(passportNumber: string): void {
  write(list().filter((item) => item.passportNumber !== passportNumber));
}

export const localCellarRepository: CellarRepository = {
  list,
  add,
  remove,
  subscribe,
  getServerSnapshot,
};
