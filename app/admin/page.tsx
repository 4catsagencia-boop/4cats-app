"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import PlanesSection from "./components/PlanesSection";
import ClientesSection from "./components/ClientesSection";
import CotizacionesSection from "./components/CotizacionesSection";
type Section = "planes" | "cotizaciones" | "clientes";

export default function AdminPage() {
  const [auth, setAuth] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_auth") === "true";
    }
    return false;
  });
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("planes");

  async function handleLogin() {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ password: pw }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setAuth(true);
        setErr(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_auth", "true");
          localStorage.setItem("admin_pw", pw); // Guardamos la pw para las peticiones a la DB
        }
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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
        <div className="bg-white border border-[#E4E4E7] rounded-3xl p-10 shadow-xl shadow-[#18181B]/5 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#7C5CBF] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#18181B]">4cats Admin</span>
          </div>

          <p className="text-xs font-bold tracking-widest uppercase text-[#A1A1AA] mb-6">
            Acceso restringido
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
              placeholder="Contraseña"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all ${
                err ? "border-red-400" : "border-[#E4E4E7]"
              }`}
            />
            {err && (
              <p className="text-xs text-red-500 font-medium -mt-2">Contraseña incorrecta.</p>
            )}
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

  const menuItems = [
    { id: "planes" as Section, label: "Planes" },
    { id: "cotizaciones" as Section, label: "Cotizaciones" },
    { id: "clientes" as Section, label: "Clientes" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 pt-14 pb-24 grid md:grid-cols-[240px_1fr] gap-12">
        <aside className="pt-1">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#bbb] mb-5">
            Administración
          </p>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`text-left text-sm px-4 py-2.5 rounded-md transition-colors w-full ${
                  activeSection === item.id
                    ? "bg-[#F3EEFF] text-[#7C5CBF] font-medium border-l-2 border-[#7C5CBF] rounded-l-none"
                    : "text-[#888] hover:text-[#7C5CBF] hover:bg-[#F3EEFF]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => {
              setAuth(false);
              if (typeof window !== "undefined") {
                localStorage.removeItem("admin_auth");
                localStorage.removeItem("admin_pw");
              }
            }}
            className="mt-8 text-xs text-[#A1A1AA] hover:text-red-400 transition-colors"
          >
            Cerrar sesión
          </button>
        </aside>

        <main className="min-w-0">
          <header className="mb-10 pb-6 border-b border-[#e5e5e5]">
            <h1 className="text-2xl font-bold text-[#7C5CBF] tracking-tight capitalize">
              {activeSection}
            </h1>
            <p className="text-sm text-[#888] mt-1">
              Gestiona {activeSection} de 4cats.cl
            </p>
          </header>
          <div className="animate-in fade-in duration-500">
            {activeSection === "planes" && <PlanesSection />}
            {activeSection === "cotizaciones" && <CotizacionesSection />}
            {activeSection === "clientes" && <ClientesSection />}

          </div>
        </main>
      </div>
    </div>
  );
}
