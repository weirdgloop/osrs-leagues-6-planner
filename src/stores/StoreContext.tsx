import { createContext, type ReactNode, useContext } from "react";
import { rootStore, RootStore } from "./RootStore";

const StoreContext = createContext<RootStore | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
