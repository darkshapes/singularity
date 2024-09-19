import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createAppStore } from "@/app/store";
import { AppInstance, AppState, AppStore } from "@/types/store";

export const AppContext = createContext<AppStore | null>(null);

export type AppProviderProps = React.PropsWithChildren<{instance: AppInstance | null}>;

export const AppProvider = ({ children, instance }: AppProviderProps) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current && instance) {
    storeRef.current = createAppStore(instance);
  }

  return (
    <AppContext.Provider value={storeRef.current}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = <T,>(selector: (state: AppState) => T): T => {
    const store = useContext(AppContext);
    if (!store) throw new Error('Missing AppContext.Provider in the tree');
    return useStore(store, selector);
}