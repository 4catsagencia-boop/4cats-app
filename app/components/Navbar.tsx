"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { t } from "../translations";
import { useLang } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggle } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const tr = t[lang].nav;

  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Patrón React 19: Reset de estado durante renderizado al cambiar props/navigation
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const [isScrolled, setIsScrolled] = useState(false);

  // Close on outside scroll (UX)
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  // Track page scroll for transparent to solid bg effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll(); // Init
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/planes", label: tr.planes },
    { href: "/planes-mantenimiento", label: tr.mantenimiento },
    { href: "/portafolio", label: tr.portafolio },
    { href: "/cotizar", label: tr.cotizar },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? "bg-white/85 dark:bg-[#0F0F12]/85 backdrop-blur-md border-b border-[#E4E4E7] dark:border-[#2A2A35] py-0" 
        : "bg-transparent border-b border-transparent py-2"
    }`}>
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-6 h-6 text-[#7C5CBF] transition-transform group-hover:scale-110" />
          <span className="text-lg font-bold tracking-tight text-[#7C5CBF]">4cats</span>
        </Link>


        <div className="flex items-center gap-3">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all relative py-1 group ${
                  pathname === link.href ? "text-[#7C5CBF]" : "text-[#52525B] hover:text-[#18181B]"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#7C5CBF] transition-all duration-300 group-hover:w-full ${pathname === link.href ? "w-full" : "w-0"}`} />
              </Link>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center w-8 h-8 text-[#7C5CBF] bg-[#F3EEFF] dark:bg-[#1C1630] border border-[#E5D8FF] dark:border-[#2E2255] rounded-lg hover:bg-[#E5D8FF] dark:hover:bg-[#2E2255] transition-all"
            aria-label="Toggle dark mode"
            title={theme === "light" ? "Modo oscuro" : "Modo claro"}
          >
            {theme === "light" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="hidden md:flex items-center justify-center w-8 h-8 text-[#7C5CBF] bg-[#F3EEFF] dark:bg-[#1C1630] border border-[#E5D8FF] dark:border-[#2E2255] rounded-lg hover:bg-[#E5D8FF] dark:hover:bg-[#2E2255] transition-all"
            aria-label="Switch language"
            title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
            </svg>
          </button>

          {/* CTA — desktop */}
          <Link
            href="/cotizar"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium bg-[#7C5CBF] text-white px-4 py-2 rounded-md hover:bg-[#6B4DAE] transition-all active:scale-95 shadow-sm shadow-[#7C5CBF]/20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <ellipse cx="12" cy="16" rx="5" ry="4" />
              <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
              <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
              <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
              <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
            </svg>
            {tr.cotizarBtn}
          </Link>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-[#F3EEFF] transition-colors gap-[5px]"
          >
            <span className={`block h-0.5 w-5 bg-[#7C5CBF] rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#7C5CBF] rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#7C5CBF] rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 border-t border-[#E4E4E7] dark:border-[#2A2A35]" : "max-h-0"}`}>
        <div className="bg-white/95 dark:bg-[#0F0F12]/95 backdrop-blur-md px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium px-3 py-3 rounded-xl transition-colors ${
                pathname === link.href
                  ? "text-[#7C5CBF] bg-[#F3EEFF] font-bold"
                  : "text-[#52525B] hover:text-[#18181B] hover:bg-[#FAFAFA]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold bg-[#7C5CBF] text-white px-4 py-3 rounded-xl hover:bg-[#6B4DAE] transition-all active:scale-95 shadow-lg shadow-[#7C5CBF]/20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <ellipse cx="12" cy="16" rx="5" ry="4" />
              <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
              <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
              <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
              <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
            </svg>
            {tr.cotizarBtn}
          </Link>

          {/* Language toggle — mobile */}
          <button
            onClick={toggle}
            className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-[#7C5CBF] border border-[#E5D8FF] dark:border-[#2E2255] bg-[#F3EEFF] dark:bg-[#1C1630] py-2.5 rounded-xl hover:bg-[#E5D8FF] dark:hover:bg-[#2E2255] transition-all"
          >
            <span className={lang === "es" ? "opacity-100" : "opacity-40"}>Español</span>
            <span className="text-[#C4B5FD]">/</span>
            <span className={lang === "en" ? "opacity-100" : "opacity-40"}>English</span>
          </button>

          {/* Dark mode toggle — mobile */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 text-xs font-bold text-[#7C5CBF] border border-[#E5D8FF] dark:border-[#2E2255] bg-[#F3EEFF] dark:bg-[#1C1630] py-2.5 rounded-xl hover:bg-[#E5D8FF] dark:hover:bg-[#2E2255] transition-all"
          >
            {theme === "light" ? (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>Modo oscuro</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>Modo claro</>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
