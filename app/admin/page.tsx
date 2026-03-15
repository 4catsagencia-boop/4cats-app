"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import PlanesSection from "./components/PlanesSection";
import ClientesSection from "./components/ClientesSection";
import CotizacionesSection from "./components/CotizacionesSection";
import CatalogoSection from "./components/CatalogoSection";

type Section = "planes" | "cotizaciones" | "clientes" | "catalogo";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("planes");

  const menuItems = [
    { id: "planes" as Section, label: "Planes" },
    { id: "cotizaciones" as Section, label: "Cotizaciones" },
    { id: "clientes" as Section, label: "Clientes" },
    { id: "catalogo" as Section, label: "Catálogo" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 pt-14 pb-24 grid md:grid-cols-[240px_1fr] gap-12">
        {/* ---- Sidebar ---- */}
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
                    ? "bg-[#f3f3f3] text-[#111] font-medium"
                    : "text-[#888] hover:text-[#111] hover:bg-[#f7f7f7]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ---- Main area ---- */}
        <main className="min-w-0">
          <header className="mb-10 pb-6 border-b border-[#e5e5e5]">
            <h1 className="text-2xl font-semibold text-[#111] tracking-tight capitalize">
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
            {activeSection === "catalogo" && <CatalogoSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
