"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { cellarRepository } from "@/lib/cellar";
import {
  getCoffeeByPassportNumber,
  getCollection,
  type AmazonApprovalStatus,
  type CoffeeSizeOption,
  type CoffeeStatus,
} from "@/data/coffees";
import { logProductEvent } from "@/lib/supabase/track";

/**
 * Rehydrated view of a saved Cellar entry. Only `passportNumber` + `addedAt`
 * are actually persisted (see lib/cellar/, behind the CellarRepository
 * abstraction) — everything else is looked up live from the canonical
 * coffee record so the Cellar never stores a stale copy of data that can
 * change (name, process, status, etc).
 */
export type SavedCoffee = {
  passportNumber: string;
  coffeeName: string;
  collection: string;
  process?: string;
  harvest?: string;
  lotNumber?: string;
  addedAt: string;
  status: CoffeeStatus;
  sizeOptions: CoffeeSizeOption[];
  amazonApprovalRequired?: boolean;
  amazonApprovalStatus?: AmazonApprovalStatus;
};

type CellarContextValue = {
  items: SavedCoffee[];
  isSaved: (passportNumber: string) => boolean;
  add: (passportNumber: string, source?: string) => void;
  remove: (passportNumber: string, source?: string) => void;
};

const CellarContext = createContext<CellarContextValue | null>(null);

export function CellarProvider({ children }: { children: React.ReactNode }) {
  const rawItems = useSyncExternalStore(
    cellarRepository.subscribe,
    cellarRepository.list,
    cellarRepository.getServerSnapshot
  );

  const items = useMemo<SavedCoffee[]>(
    () =>
      rawItems.flatMap((item) => {
        const coffee = getCoffeeByPassportNumber(item.passportNumber);
        if (!coffee) return [];
        return [
          {
            passportNumber: coffee.passportNumber,
            coffeeName: coffee.coffeeName,
            collection: getCollection(coffee),
            process: coffee.process,
            harvest: coffee.harvest,
            lotNumber: coffee.lotNumber,
            addedAt: item.addedAt,
            status: coffee.status,
            sizeOptions: coffee.sizeOptions,
            amazonApprovalRequired: coffee.amazonApprovalRequired,
            amazonApprovalStatus: coffee.amazonApprovalStatus,
          },
        ];
      }),
    [rawItems]
  );

  const add = useCallback((passportNumber: string, source?: string) => {
    cellarRepository.add(passportNumber);
    logProductEvent({ event: "cellar_item_added", passportNumber, source });
  }, []);
  const remove = useCallback((passportNumber: string, source?: string) => {
    cellarRepository.remove(passportNumber);
    logProductEvent({ event: "cellar_item_removed", passportNumber, source });
  }, []);
  const isSaved = useCallback(
    (passportNumber: string) => rawItems.some((item) => item.passportNumber === passportNumber),
    [rawItems]
  );

  return (
    <CellarContext.Provider value={{ items, isSaved, add, remove }}>
      {children}
    </CellarContext.Provider>
  );
}

export function useCellar(): CellarContextValue {
  const ctx = useContext(CellarContext);
  if (!ctx) {
    throw new Error("useCellar must be used within a CellarProvider");
  }
  return ctx;
}
