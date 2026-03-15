"use client";

import { useState, useEffect } from "react";
import { fetchPlanes, insertPlan, updatePlan, deletePlan } from "@/utils/supabase";

interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  caracteristicas: string[];
  destacado: boolean;
  publicado: boolean;
  created_at: string;
}

const formatCLP = (precio: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(precio);
};

export default function PlanesSection() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    caracteristicas: "",
  });

  useEffect(() => {
    loadPlanes();
  }, []);

  async function loadPlanes() {
    try {
      const data = await fetchPlanes();
      setPlanes(data || []);
    } catch (error) {
      console.error("Error loading planes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublicado(id: string, published: boolean) {
    try {
      await updatePlan(id, { publicado: !published });
      loadPlanes();
    } catch (error) {
      console.error("Error toggling published:", error);
    }
  }

  async function handleToggleDestacado(id: string, featured: boolean) {
    try {
      await updatePlan(id, { destacado: !featured });
      loadPlanes();
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este plan?")) return;
    try {
      await deletePlan(id);
      loadPlanes();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const caracteristicasArr = form.caracteristicas
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    try {
      await insertPlan({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        caracteristicas: caracteristicasArr,
      });
      setForm({ nombre: "", descripcion: "", precio: "", caracteristicas: "" });
      setShowForm(false);
      loadPlanes();
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#111]">Planes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#111] text-white text-sm px-4 py-2 rounded-md hover:bg-[#333] transition-colors"
        >
          {showForm ? "Cerrar" : "Nuevo plan"}
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
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#444]">Precio (CLP)</label>
              <input
                type="number"
                required
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111]"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-[#444]">Descripción</label>
              <textarea
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111] resize-none"
                rows={2}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-[#444]">Características (una por línea)</label>
              <textarea
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none focus:ring-1 focus:ring-[#111] resize-none font-mono text-xs"
                rows={4}
                value={form.caracteristicas}
                onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-[#111] text-white text-sm px-5 py-2.5 rounded-md hover:bg-[#333] transition-colors"
          >
            Guardar Plan
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#888] uppercase border-b border-[#e5e5e5]">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-[#888]">Cargando...</td></tr>
            ) : planes.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-[#888]">No hay planes creados.</td></tr>
            ) : (
              planes.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#f9f9f9]">
                  <td className="px-4 py-4">
                    <div className="font-medium text-[#111]">{plan.nombre}</div>
                    <div className="text-xs text-[#888] line-clamp-1">{plan.descripcion}</div>
                  </td>
                  <td className="px-4 py-4 text-[#555]">{formatCLP(plan.precio)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublicado(plan.id, plan.publicado)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${plan.publicado ? "bg-[#111]" : "bg-[#e5e5e5]"}`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${plan.publicado ? "left-[1.125rem]" : "left-0.5"}`} />
                        </button>
                        <span className="text-[10px] uppercase tracking-wider text-[#555]">Publicado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleDestacado(plan.id, plan.destacado)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${plan.destacado ? "bg-[#111]" : "bg-[#e5e5e5]"}`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${plan.destacado ? "left-[1.125rem]" : "left-0.5"}`} />
                        </button>
                        <span className="text-[10px] uppercase tracking-wider text-[#555]">Destacado</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleDelete(plan.id)}
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
