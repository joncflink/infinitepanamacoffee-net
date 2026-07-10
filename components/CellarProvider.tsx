"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  addToCellar,
  getServerCellarSnapshot,
  readCellar,
  removeFromCellar,
  subscribeToCellar,
} from "@/lib/cellar";
import {
  getCoffeeByPassportNumber,
  getCollection,
  type CoffeeSizeOption,
  type CoffeeStatus,
} from "@/data/coffees";

/**
 * Rehydrated view of a saved Cellar entry. Only `passportNumber` + `addedAt`
 * are actually persisted (see lib/cellar.ts) — everything else is looked up
 * live from the canonical coffee record so the Cellar never stores a stale
 * copy of data that can change (name, process, status, etc).
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
};

type CellarContextValue = {
  items: SavedCoffee[];
  isSaved: (passportNumber: string) => boolean;
  add: (passportNumber: string) => void;
  remove: (passportNumber: string) => void;
};

const CellarContext = createContext<CellarContextValue | null>(null);

export function CellarProvider({ children }: { children: React.ReactNode }) {
  const rawItems = useSyncExternalStore(
    subscribeToCellar,
    readCellar,
    getServerCellarSnapshot
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
          },
        ];
      }),
    [rawItems]
  );

  const add = useCallback((passportNumber: string) => addToCellar(passportNumber), []);
  const remove = useCallback((passportNumber: string) => removeFromCellar(passportNumber), []);
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
