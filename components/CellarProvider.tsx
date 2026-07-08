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
  isSaved: (lotId: string) => boolean;
  add: (lotId: string) => void;
  remove: (lotId: string) => void;
};

const CellarContext = createContext<CellarContextValue | null>(null);

export function CellarProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCellar,
    readCellar,
    getServerCellarSnapshot
  );

  const add = useCallback((lotId: string) => addToCellar(lotId), []);
  const remove = useCallback((lotId: string) => removeFromCellar(lotId), []);
  const isSaved = useCallback(
    (lotId: string) => items.some((item) => item.lotId === lotId),
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
