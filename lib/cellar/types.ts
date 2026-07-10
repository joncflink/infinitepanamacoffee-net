/**
 * A saved Cellar record as it is actually persisted. Deliberately minimal —
 * everything else about the coffee (name, process, status, ...) is
 * rehydrated at read time from the canonical coffee record via
 * getCoffeeByPassportNumber, never duplicated into storage. See
 * CellarProvider.tsx.
 */
export type CellarItem = {
  passportNumber: string;
  addedAt: string;
};

export type CellarListener = () => void;

/**
 * Storage abstraction for "My Infinite Cellar™", so the app can start on
 * localStorage (no accounts) and later move to an account-backed store
 * (Supabase `cellar_items`) without changing CellarProvider or any UI.
 *
 * Kept synchronous to match React's useSyncExternalStore, which is what
 * CellarProvider uses to bind this to React state. LocalCellarRepository
 * satisfies that naturally (localStorage is synchronous). A real
 * account-backed implementation (SupabaseCellarRepository) is inherently
 * asynchronous underneath, so it satisfies this interface by keeping an
 * in-memory cache that's hydrated asynchronously and read synchronously —
 * see that file for the tradeoffs this implies. If a future phase needs
 * genuine async reads (e.g. no local cache at all), this interface is the
 * place to widen to Promise-returning methods; don't do that speculatively
 * before it's actually needed.
 */
export interface CellarRepository {
  /** Every saved item, keyed by passportNumber. */
  list(): CellarItem[];
  /** Add a coffee by its permanent Passport Number. No-op if already saved. */
  add(passportNumber: string): void;
  /** Remove a coffee by its Passport Number. No-op if not saved. */
  remove(passportNumber: string): void;
  /** Register a change listener; returns an unsubscribe function. */
  subscribe(listener: CellarListener): () => void;
  /** Snapshot used before hydration (SSR / first client render). */
  getServerSnapshot(): CellarItem[];
}
