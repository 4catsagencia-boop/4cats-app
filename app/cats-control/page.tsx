"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import CotizacionesView from "./components/CotizacionesView";
import ClientesView from "./components/ClientesView";
import PlanesView from "./components/PlanesView";
import FinanzasView from "./components/FinanzasView";
import PropuestaView from "./components/PropuestaView";

type View = "dashboard" | "cotizaciones" | "clientes" | "planes" | "finanzas" | "propuesta";

export default function CatsControlPage() {
  const [auth, setAuth] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("cats_control_user");
    }
    return false;
  });
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cats_control_user") || "";
    }
    return "";
  });
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogin() {
    try {
      const res = await fetch("/api/cats-control/auth", {
        method: "POST",
        body: JSON.stringify({ username, password: pw }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const { name } = await res.json();
        setAuth(true);
        setUserName(name);
        setErr(false);
        if (typeof window !== "undefined") localStorage.setItem("cats_control_user", name);
      } else {
        setErr(true);
        setPw("");
      }
    } catch {
      setErr(true);
      setPw("");
    }
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center px-6">
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-10 shadow-xl shadow-[#18181B]/5 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#7C5CBF] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <ellipse cx="12" cy="16" rx="5" ry="4" />
                <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
                <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
                <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
                <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#18181B] dark:text-white">Cats Control</span>
          </div>

          <p className="text-xs font-bold tracking-widest uppercase text-[#A1A1AA] mb-6">
            Acceso restringido
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setErr(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              placeholder="Usuario (luis / majo)"
              className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
            />
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              placeholder="Contraseña"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white ${
                err ? "border-red-400" : "border-[#E4E4E7] dark:border-[#3F3F46]"
              }`}
            />
            {err && <p className="text-xs text-red-500 font-medium -mt-2">Usuario o contraseña incorrectos.</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-[#7C5CBF] text-white font-bold py-3 rounded-xl hover:bg-[#6B4DAE] transition-all active:scale-[0.98] shadow-lg shadow-[#7C5CBF]/20"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const views: Record<View, React.ReactNode> = {
    dashboard: <DashboardView />,
    cotizaciones: <CotizacionesView />,
    clientes: <ClientesView />,
    planes: <PlanesView />,
    finanzas: <FinanzasView />,
    propuesta: <PropuestaView />,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar
          activeView={activeView}
          userName={userName}
          onNavigate={(view) => { setActiveView(view); setSidebarOpen(false); }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#0F0F12]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#1C1630] transition-colors"
          >
            <svg className="w-5 h-5 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-bold text-[#18181B] dark:text-white">Cats Control</span>
        </div>

        <main className="flex-1 overflow-auto">
          {views[activeView]}
        </main>
      </div>
    </div>
  );
}
