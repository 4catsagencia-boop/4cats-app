"use client";

import { useState, useEffect } from "react";
import { fetchClientes, insertCliente, deleteCliente } from "@/utils/supabase";

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  giro: string;
  rut: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  notas: string;
  created_at: string;
}

function formatRUT(value: string): string {
  // Eliminar todo excepto dígitos y k/K
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  // Agregar puntos cada 3 dígitos desde la derecha
  const bodyFormatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${bodyFormatted}-${dv}`;
}

const inputClass = "w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#7C5CBF] focus:border-[#7C5CBF]";

export default function ClientesSection() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    giro: "",
    rut: "",
    direccion: "",
    comuna: "",
    ciudad: "",
    notas: "",
  });

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      const data = await fetchClientes();
      setClientes(data || []);
    } catch (error) {
      console.error("Error loading clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await deleteCliente(id);
      loadClientes();
    } catch (error) {
      console.error("Error deleting cliente:", error);
    }
  }

  function handleRUTChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatRUT(e.target.value);
    setForm({ ...form, rut: formatted });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await insertCliente(form);
      setForm({
        nombre: "", email: "", telefono: "", empresa: "",
        giro: "", rut: "", direccion: "", comuna: "", ciudad: "", notas: "",
      });
      setShowForm(false);
      loadClientes();
    } catch (error) {
      console.error("Error creating cliente:", error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#7C5CBF]">Clientes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7C5CBF] text-white text-sm px-4 py-2 rounded-md hover:bg-[#6B4DAE] transition-colors"
        >
          {showForm ? "Cerrar" : "Nuevo cliente"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 border border-[#e5e5e5] rounded-lg bg-[#fafafa]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Nombre completo *</label>
              <input type="text" required className={inputClass}
                value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">RUT</label>
              <input type="text" placeholder="12.345.678-9" className={inputClass}
                value={form.rut} onChange={handleRUTChange} maxLength={12} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Empresa</label>
              <input type="text" className={inputClass}
                value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Giro</label>
              <input type="text" placeholder="ej. Comercio al por menor" className={inputClass}
                value={form.giro} onChange={(e) => setForm({ ...form, giro: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Email</label>
              <input type="email" className={inputClass}
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Teléfono</label>
              <input type="text" className={inputClass}
                value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-[#444]">Dirección</label>
              <input type="text" placeholder="Calle y número" className={inputClass}
                value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Comuna</label>
              <input type="text" className={inputClass}
                value={form.comuna} onChange={(e) => setForm({ ...form, comuna: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Ciudad</label>
              <input type="text" className={inputClass}
                value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-[#444]">Notas</label>
              <textarea className={`${inputClass} resize-none`} rows={2}
                value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            </div>

          </div>
          <button type="submit"
            className="mt-6 bg-[#7C5CBF] text-white text-sm px-5 py-2.5 rounded-md hover:bg-[#6B4DAE] transition-colors">
            Guardar Cliente
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#888] uppercase border-b border-[#e5e5e5]">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">RUT</th>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Ciudad</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-[#888]">Cargando...</td></tr>
            ) : clientes.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-[#888]">No hay clientes registrados.</td></tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-[#f9f9f9]">
                  <td className="px-4 py-4 font-medium text-[#7C5CBF]">{cliente.nombre}</td>
                  <td className="px-4 py-4 text-[#555]">{cliente.rut || "-"}</td>
                  <td className="px-4 py-4 text-[#555]">{cliente.empresa || "-"}</td>
                  <td className="px-4 py-4 text-[#555]">{cliente.email || "-"}</td>
                  <td className="px-4 py-4 text-[#555]">{cliente.ciudad || "-"}</td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => handleDelete(cliente.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
