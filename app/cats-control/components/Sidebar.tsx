"use client";

import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";

type View = "dashboard" | "cotizaciones" | "clientes" | "planes" | "finanzas";

interface SidebarProps {
  activeView: View;
  userName: string;
  onNavigate: (view: View) => void;
}

const items: { view: View; label: string; icon: React.ReactNode }[] = [
  {
    view: "dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    view: "cotizaciones",
    label: "Cotizaciones",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    view: "clientes",
    label: "Clientes",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    view: "planes",
    label: "Planes",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    view: "finanzas",
    label: "Finanzas",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

function userEmoji(name: string) {
  if (name.toLowerCase().includes("luis")) return "👑";
  if (name.toLowerCase().includes("maría") || name.toLowerCase().includes("majo")) return "🌷";
  return "🐱";
}

export default function Sidebar({ activeView, userName, onNavigate }: SidebarProps) {
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-[#0F0F12] border-r border-[#E4E4E7] dark:border-[#2A2A35] flex flex-col">
      <div className="px-5 py-5 border-b border-[#E4E4E7] dark:border-[#2A2A35]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[#7C5CBF] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <ellipse cx="12" cy="16" rx="5" ry="4" />
              <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
              <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
              <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
              <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#18181B] dark:text-white leading-none">Cats Control</p>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5 group-hover:text-[#7C5CBF] transition-colors">Ir a la web →</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeView === item.view
                ? "bg-[#7C5CBF] text-white shadow-sm shadow-[#7C5CBF]/30"
                : "text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F3EEFF] dark:hover:bg-[#1C1630] hover:text-[#7C5CBF]"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-[#E4E4E7] dark:border-[#2A2A35] flex flex-col gap-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F3EEFF] dark:hover:bg-[#1C1630] hover:text-[#7C5CBF] transition-all"
          >
            {theme === "light" ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
                Modo oscuro
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Modo claro
              </>
            )}
          </button>
        </div>
      </nav>

      <div className="px-5 py-4 border-t border-[#E4E4E7] dark:border-[#2A2A35]">
        {userName && (
          <p className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA] mb-1">
            {userEmoji(userName)} {userName}
          </p>
        )}
        <p className="text-[10px] text-[#A1A1AA]">4cats Studio · 2026</p>
      </div>
    </aside>
  );
}
