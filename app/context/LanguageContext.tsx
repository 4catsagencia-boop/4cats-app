"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "es" | "en";

interface LangCtx {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LangCtx>({ lang: "es", toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("4cats_lang") as Lang | null;
    if (saved === "es" || saved === "en") setLang(saved);
  }, []);

  function toggle() {
    const next: Lang = lang === "es" ? "en" : "es";
    setLang(next);
    localStorage.setItem("4cats_lang", next);
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
