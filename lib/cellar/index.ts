export type { CellarItem, CellarListener, CellarRepository } from "./types";
export { localCellarRepository } from "./localCellarRepository";
export { supabaseCellarRepository } from "./supabaseCellarRepository";

import { localCellarRepository } from "./localCellarRepository";
import type { CellarRepository } from "./types";

/**
 * The Cellar implementation the app actually uses. Swapping the Cellar to
 * an account-backed store later should be this one line — see
 * supabaseCellarRepository.ts for why it isn't this yet.
 */
export const cellarRepository: CellarRepository = localCellarRepository;
