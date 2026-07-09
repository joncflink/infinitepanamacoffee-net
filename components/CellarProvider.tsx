"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import {
  addToCellar,
  getServerCellarSnapshot,
  readCellar,
  removeFromCellar,
  subscribeToCellar,
  type CellarItem,
} from "@/lib/cellar";

type CellarContextValue = {
  items: CellarItem[];
  isSaved: (passportNumber: string) => boolean;
  add: (passportNumber: string) => void;
  remove: (passportNumber: string) => void;
};

const CellarContext = createContext<CellarContextValue | null>(null);

export function CellarProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCellar,
    readCellar,
    getServerCellarSnapshot
  );

  const add = useCallback((passportNumber: string) => addToCellar(passportNumber), []);
  const remove = useCallback((passportNumber: string) => removeFromCellar(passportNumber), []);
  const isSaved = useCallback(
    (passportNumber: string) => items.some((item) => item.passportNumber === passportNumber),
    [items]
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
