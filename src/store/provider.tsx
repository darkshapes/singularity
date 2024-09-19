import { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { createAppStore } from "@/store";
import { AppInstance, AppState, AppStore } from "@/types/store";

export const AppContext = createContext<AppStore | null>(null);

export type AppProviderProps = React.PropsWithChildren<{instance?: AppInstance}>;

export const AppProvider = ({ children, instance }: AppProviderProps) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current && instance) {
    storeRef.current = createAppStore(instance);
    console.log("[store] Created app store.")
  }

  useEffect(() => {
    if (!storeRef.current) return;
    const initializeStore = async () => {
      if (storeRef.current) {
        await storeRef.current.getState().initialize();
      }
    };
    initializeStore();
    console.log("[store] Initialized app store.")
  }, [storeRef.current]);

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