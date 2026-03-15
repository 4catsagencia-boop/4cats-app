"use client";

import { useState, useEffect } from "react";
import { fetchCatalogo, supabase } from "@/utils/supabase";

interface CatalogoItem {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  caracteristicas: string[];
  activo: boolean;
  created_at: string;
}

export default function CatalogoSection() {
  const [items, setItems] = useState<CatalogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    caracteristicas: "",
  });

  useEffect(() => {
    loadCatalogo();
  }, []);

  async function loadCatalogo() {
    try {
      const data = await fetchCatalogo();
      setItems(data || []);
    } catch (error) {
      console.error("Error loading catalogo:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const caracteristicasArr = form.caracteristicas
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    try {
      const { error } = await supabase.from("catalogo").insert([
        {
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: Number(form.precio),
          caracteristicas: caracteristicasArr,
        },
      ]);
      if (error) throw error;
      setForm({ nombre: "", descripcion: "", precio: "", caracteristicas: "" });
      setShowForm(false);
      loadCatalogo();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#7C5CBF]">Catálogo (Legacy)</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7C5CBF] text-white text-sm px-4 py-2 rounded-md hover:bg-[#6B4DAE] transition-colors"
        >
          {showForm ? "Cerrar" : "Nuevo producto"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 border border-[#e5e5e5] rounded-lg bg-[#fafafa]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Nombre</label>
              <input
                type="text"
                required
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#7C5CBF] focus:border-[#7C5CBF]"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Precio</label>
              <input
                type="number"
                required
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#7C5CBF] focus:border-[#7C5CBF]"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-[#444]">Descripción</label>
              <textarea
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] resize-none"
                rows={2}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-[#444]">Características</label>
              <textarea
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] resize-none font-mono text-xs"
                rows={4}
                value={form.caracteristicas}
                onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-[#7C5CBF] text-white text-sm px-5 py-2.5 rounded-md hover:bg-[#6B4DAE] transition-colors"
          >
            Guardar Producto
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#888] uppercase border-b border-[#e5e5e5]">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {loading ? (
              <tr><td colSpan={3} className="py-8 text-center text-[#888]">Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center text-[#888]">No hay productos.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-[#f9f9f9]">
                  <td className="px-4 py-4 font-medium text-[#7C5CBF]">{item.nombre}</td>
                  <td className="px-4 py-4 text-[#555]">{item.precio}</td>
                  <td className="px-4 py-4 text-right text-[#888]">No editable</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
