"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LocaleSwitchContextValue = {
  /** undefined = not on blog detail; null = no alternate article; string = alternate slug */
  blogAlternateSlug: string | null | undefined;
  setBlogAlternateSlug: (slug: string | null | undefined) => void;
};

const LocaleSwitchContext = createContext<LocaleSwitchContextValue | null>(null);

export function LocaleSwitchProvider({ children }: { children: ReactNode }) {
  const [blogAlternateSlug, setBlogAlternateSlug] = useState<
    string | null | undefined
  >(undefined);

  const value = useMemo(
    () => ({ blogAlternateSlug, setBlogAlternateSlug }),
    [blogAlternateSlug],
  );

  return (
    <LocaleSwitchContext.Provider value={value}>
      {children}
    </LocaleSwitchContext.Provider>
  );
}

export function useLocaleSwitch() {
  const context = useContext(LocaleSwitchContext);
  if (!context) {
    throw new Error("useLocaleSwitch must be used within LocaleSwitchProvider");
  }
  return context;
}
