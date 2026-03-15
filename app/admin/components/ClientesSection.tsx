"use client";

import { useState, useEffect } from "react";
import { fetchClientes, insertCliente, deleteCliente } from "@/utils/supabase";

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  rut: string;
  direccion: string;
  notas: string;
  created_at: string;
}

export default function ClientesSection() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    rut: "",
    direccion: "",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await insertCliente(form);
      setForm({
        nombre: "",
        email: "",
        telefono: "",
        empresa: "",
        rut: "",
        direccion: "",
        notas: "",
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
        <h2 className="text-xl font-semibold text-[#111]">Clientes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#111] text-white text-sm px-4 py-2 rounded-md hover:bg-[#333] transition-colors"
        >
          {showForm ? "Cerrar" : "Nuevo cliente"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 border border-[#e5e5e5] rounded-lg bg-[#fafafa]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Nombre completo</label>
              <input
                type="text"
                required
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Email</label>
              <input
                type="email"
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Teléfono</label>
              <input
                type="text"
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Empresa</label>
              <input
                type="text"
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">RUT</label>
              <input
                type="text"
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.rut}
                onChange={(e) => setForm({ ...form, rut: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Dirección</label>
              <input
                type="text"
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-[#444]">Notas</label>
              <textarea
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111] resize-none"
                rows={2}
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-[#111] text-white text-sm px-5 py-2.5 rounded-md hover:bg-[#333] transition-colors"
          >
            Guardar Cliente
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#888] uppercase border-b border-[#e5e5e5]">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-[#888]">Cargando...</td></tr>
            ) : clientes.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-[#888]">No hay clientes registrados.</td></tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-[#f9f9f9]">
                  <td className="px-4 py-4 font-medium text-[#111]">{cliente.nombre}</td>
                  <td className="px-4 py-4 text-[#555]">{cliente.empresa || "-"}</td>
                  <td className="px-4 py-4 text-[#555]">{cliente.email || "-"}</td>
                  <td className="px-4 py-4 text-[#555]">{cliente.telefono || "-"}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
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
