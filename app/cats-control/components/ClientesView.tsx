"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { type Cliente } from "../../../utils/supabase";

export default function ClientesView() {
  const adminDB = useAdminDB();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", razon_social: "", rut: "" });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminDB.select("clientes");
      setClientes(data || []);
    } catch (e) {
      console.error("Error cargando clientes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = clientes.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.rut?.includes(search)
  );

  const handleSave = async () => {
    if (!form.nombre || !form.email) return;
    setIsSaving(true);
    try {
      if (modal === "create") {
        await adminDB.insert("clientes", form);
      } else if (modal === "edit" && selected) {
        await adminDB.update("clientes", selected.id, form);
      }
      setModal(null);
      await loadData();
      alert(`Cliente ${modal === "create" ? "creado" : "actualizado"} ✅`);
    } catch (e) {
      console.error("Error al guardar cliente:", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && clientes.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Directorio de Clientes</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Gestión de cartera y datos de facturación</p>
        </div>
        <button 
          onClick={() => { setModal("create"); setForm({ nombre: "", email: "", telefono: "", razon_social: "", rut: "" }); }}
          className="bg-[#7C5CBF] text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20 active:scale-95"
        >
          Nuevo Cliente
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre, email o RUT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-[#18181B] dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F3EEFF] dark:bg-[#1C1630] flex items-center justify-center text-[#7C5CBF] font-black text-xs uppercase">
                {c.nombre.substring(0, 2)}
              </div>
              <button 
                onClick={() => { setSelected(c); setForm({ nombre: c.nombre, email: c.email, telefono: c.telefono || "", razon_social: c.razon_social || "", rut: c.rut || "" }); setModal("edit"); }}
                className="text-[#A1A1AA] hover:text-[#7C5CBF] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <h3 className="font-bold text-[#18181B] dark:text-white mb-1 truncate">{c.nombre}</h3>
            <p className="text-xs text-[#A1A1AA] mb-4 truncate">{c.email}</p>
            
            <div className="space-y-2 border-t border-[#F4F4F5] dark:border-[#2A2A35] pt-4">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#A1A1AA] font-bold uppercase tracking-widest">Teléfono</span>
                <span className="text-[#18181B] dark:text-[#E4E4E7]">{c.telefono || "—"}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#A1A1AA] font-bold uppercase tracking-widest">RUT</span>
                <span className="text-[#18181B] dark:text-[#E4E4E7] font-mono">{c.rut || "—"}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <a 
                href={`mailto:${c.email}`}
                className="flex-1 bg-[#F4F4F5] dark:bg-[#2A2A35] text-[#18181B] dark:text-white py-2 rounded-xl text-center text-[10px] font-bold hover:bg-[#E4E4E7] transition-all"
              >
                Escribir
              </a>
              {c.telefono && (
                <a 
                  href={`https://wa.me/${c.telefono.replace(/\+/g, '')}`}
                  target="_blank"
                  className="flex-1 bg-green-500/10 text-green-600 py-2 rounded-xl text-center text-[10px] font-bold hover:bg-green-500 hover:text-white transition-all"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-[#18181B] dark:text-white mb-6">
              {modal === "create" ? "Nuevo Cliente" : "Editar Cliente"}
            </h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Nombre de fantasía"
                value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})}
                className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
              />
              <input 
                type="email" placeholder="Email de contacto"
                value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
              />
              <input 
                type="text" placeholder="Teléfono (+56...)"
                value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})}
                className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Razon Social"
                  value={form.razon_social} onChange={(e) => setForm({...form, razon_social: e.target.value})}
                  className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                />
                <input 
                  type="text" placeholder="RUT Empresa"
                  value={form.rut} onChange={(e) => setForm({...form, rut: e.target.value})}
                  className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-xs font-bold text-[#A1A1AA]">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 rounded-xl bg-[#7C5CBF] text-white text-xs font-bold shadow-lg shadow-[#7C5CBF]/20 active:scale-95 disabled:opacity-50">
                {isSaving ? "Guardando..." : "Guardar Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
