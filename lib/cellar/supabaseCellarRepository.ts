import { createClient } from "@/lib/supabase/client";
import type { CellarItem, CellarListener, CellarRepository } from "./types";

/**
 * NOT WIRED INTO THE APP. This is a scaffold for what an account-backed
 * Cellar could look like once auth exists — nothing imports
 * `supabaseCellarRepository` today (see ./index.ts, which exports
 * `localCellarRepository` as the live implementation). Do not switch
 * ./index.ts to this file until both of the following are true:
 *
 *   1. A real auth flow exists and is stable (sign-in/sign-up, session
 *      persistence, sign-out). Phase 8 explicitly says not to force
 *      account creation ahead of that.
 *   2. The `cellar_items` RLS policies in
 *      supabase/migrations/001_initial_infinite_passport_schema.sql have
 *      been reviewed against that real auth flow, not just read.
 *
 * Known schema gap (surfaced here, not silently worked around): the
 * `cellar_items` table as defined in migration 001 keys a row to a coffee
 * via `coffee_id` / `passport_id` — uuid foreign keys into `coffees` and
 * `passports` tables. Those two tables are unused; this app's canonical
 * coffee record lives in data/coffees.ts, addressed by the permanent
 * public `passportNumber` string (e.g. "IPC-000001"), not a Supabase-side
 * uuid. `reorder_events` and `qr_scan_events` hit this same mismatch
 * earlier and were fixed by adding a denormalized `passport_number text`
 * column (migration 010) instead of resolving through the unpopulated
 * FK tables. This file assumes the same fix for `cellar_items`, proposed
 * — not applied — in supabase/migrations/011_cellar_items_passport_number.sql.
 * Until that migration actually runs against the project, every query
 * below will fail.
 *
 * Async/sync mismatch: CellarRepository.list()/getServerSnapshot() are
 * synchronous (see types.ts — that's what useSyncExternalStore requires),
 * but a Supabase read is inherently async. This implementation resolves
 * that with an in-memory cache: call hydrate() once a user session exists
 * to populate it; list() only ever reads that cache. add()/remove()
 * optimistically update the cache (so the UI reacts immediately) and then
 * fire the real write in the background, matching the fire-and-forget
 * pattern already used for analytics in lib/supabase/track.ts. A write
 * that fails is logged, not retried or rolled back — acceptable for
 * fire-and-forget analytics, but worth deciding deliberately (not by
 * default) before this is ever live for something a customer expects to
 * persist reliably.
 */

let cache: CellarItem[] = [];
let currentUserId: string | null = null;
const listeners = new Set<CellarListener>();

function emitChange() {
  for (const listener of listeners) listener();
}

/**
 * Populates the in-memory cache from Supabase for the signed-in user.
 * Not part of CellarRepository — call this once, after auth resolves,
 * before relying on list(). Leaves the cache empty (not an error) when
 * there is no signed-in user, consistent with "don't force account
 * creation."
 */
async function hydrate(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  currentUserId = user?.id ?? null;
  if (!currentUserId) {
    cache = [];
    emitChange();
    return;
  }

  const { data, error } = await supabase
    .from("cellar_items")
    .select("passport_number, added_at")
    .eq("user_id", currentUserId);

  if (error) {
    console.error("Cellar hydrate failed:", error.message);
    return;
  }

  cache = (data ?? [])
    .filter((row): row is { passport_number: string; added_at: string } => !!row.passport_number)
    .map((row) => ({ passportNumber: row.passport_number, addedAt: row.added_at }));
  emitChange();
}

function list(): CellarItem[] {
  return cache;
}

function getServerSnapshot(): CellarItem[] {
  return [];
}

function subscribe(listener: CellarListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function add(passportNumber: string): void {
  if (cache.some((item) => item.passportNumber === passportNumber)) return;
  if (!currentUserId) {
    console.error("Cellar add() called before hydrate() resolved a signed-in user.");
    return;
  }

  const addedAt = new Date().toISOString();
  cache = [...cache, { passportNumber, addedAt }];
  emitChange();

  const supabase = createClient();
  supabase
    .from("cellar_items")
    .insert({ user_id: currentUserId, passport_number: passportNumber, added_at: addedAt })
    .then(({ error }) => {
      if (error) console.error("Cellar add() failed to persist:", error.message);
    });
}

function remove(passportNumber: string): void {
  if (!currentUserId) {
    console.error("Cellar remove() called before hydrate() resolved a signed-in user.");
    return;
  }

  cache = cache.filter((item) => item.passportNumber !== passportNumber);
  emitChange();

  const supabase = createClient();
  supabase
    .from("cellar_items")
    .delete()
    .eq("user_id", currentUserId)
    .eq("passport_number", passportNumber)
    .then(({ error }) => {
      if (error) console.error("Cellar remove() failed to persist:", error.message);
    });
}

export const supabaseCellarRepository: CellarRepository & { hydrate: typeof hydrate } = {
  list,
  add,
  remove,
  subscribe,
  getServerSnapshot,
  hydrate,
};
