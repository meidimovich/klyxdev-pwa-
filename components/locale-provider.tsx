"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  translate,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("klyxdev-locale-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("klyxdev-locale-change", callback);
  };
}

function getLocaleSnapshot(): Locale {
  return window.localStorage.getItem("klyxdev-locale") === "en" ? "en" : "ru";
}

function getServerLocaleSnapshot(): Locale {
  return "ru";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem("klyxdev-locale", nextLocale);
    window.dispatchEvent(new Event("klyxdev-locale-change"));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey) => translate(locale, key),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
