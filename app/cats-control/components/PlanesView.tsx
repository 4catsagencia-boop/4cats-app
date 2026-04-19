"use client";

import { useEffect, useState } from "react";
import { 
  fetchPlanes, insertPlan, updatePlan, deletePlan, type Plan,
  fetchPlanesMantenimiento, insertPlanMantenimiento, updatePlanMantenimiento, deletePlanMantenimiento, type PlanMantenimiento
} from "../../../utils/supabase";

const clpFormatter = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function PlanesView() {
  const [activeTab, setActiveTab] = useState<"diseno" | "mantenimiento">("diseno");
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [planesMant, setPlanesMant] = useState<PlanMantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Plan | PlanMantenimiento | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombre: "",
    precio: 0,
    publicado: true,
    destacado: false,
    descripcion: "",
    caracteristicas: [""]
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, pm] = await Promise.all([fetchPlanes(), fetchPlanesMantenimiento()]);
      setPlanes(p);
      setPlanesMant(pm);
    } catch (error) {
      console.error("Error al cargar planes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: Plan | PlanMantenimiento) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nombre: item.nombre,
        precio: item.precio,
        publicado: item.publicado,
        destacado: item.destacado,
        descripcion: (item as Plan).descripcion || "",
        caracteristicas: item.caracteristicas || [""]
      });
    } else {
      setEditingItem(null);
      setFormData({
        nombre: "",
        precio: 0,
        publicado: true,
        destacado: false,
        descripcion: "",
        caracteristicas: [""]
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === "diseno") {
        if (editingItem) await updatePlan(editingItem.id, formData);
        else await insertPlan(formData);
      } else {
        const { descripcion, ...mantData } = formData; // Mantenimiento no usa descripción en este diseño
        if (editingItem) await updatePlanMantenimiento(editingItem.id, mantData);
        else await insertPlanMantenimiento(mantData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro de eliminar?")) return;
    try {
      if (activeTab === "diseno") await deletePlan(id);
      else await deletePlanMantenimiento(id);
      loadData();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentList = activeTab === "diseno" ? planes : planesMant;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Gestión de Planes</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Configuración de oferta comercial</p>
        </div>
        <div className="flex gap-2 p-1 bg-[#F4F4F5] dark:bg-[#27272A] rounded-xl">
          <button 
            onClick={() => setActiveTab("diseno")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "diseno" ? "bg-white dark:bg-[#18181B] text-[#7C5CBF] shadow-sm" : "text-[#A1A1AA] hover:text-[#52525B]"}`}
          >
            Diseño & Dev
          </button>
          <button 
            onClick={() => setActiveTab("mantenimiento")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "mantenimiento" ? "bg-white dark:bg-[#18181B] text-[#7C5CBF] shadow-sm" : "text-[#A1A1AA] hover:text-[#52525B]"}`}
          >
            Mantenimiento
          </button>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#7C5CBF] hover:bg-[#6D4EB0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-[#7C5CBF]/20 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {activeTab === "diseno" ? "Nuevo Plan Diseño" : "Nuevo Plan Mant."}
        </button>
      </div>

      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4E4E7] dark:border-[#2A2A35]">
                <th className="text-left text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-6 py-4">Nombre</th>
                <th className="text-right text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-6 py-4">Precio</th>
                <th className="text-center text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-6 py-4">Visibilidad</th>
                <th className="text-center text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
              {currentList.length === 0 && (
                <tr><td colSpan={4} className="text-center text-[#A1A1AA] py-12">No hay planes registrados en esta categoría</td></tr>
              )}
              {currentList.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#18181B] dark:text-white">{p.nombre}</p>
                      {p.destacado && <span className="text-[10px] bg-[#F3EEFF] text-[#7C5CBF] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Destacado</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#18181B] dark:text-white">{clpFormatter.format(p.precio)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${p.publicado ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-[#F4F4F5] text-[#A1A1AA]"}`}>
                      {p.publicado ? "Público" : "Oculto"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenModal(p)} className="p-2 text-[#A1A1AA] hover:text-[#7C5CBF]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-[#A1A1AA] hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#18181B] w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E4E4E7] dark:border-[#2A2A35] shadow-2xl p-6">
            <h2 className="text-xl font-bold text-[#18181B] dark:text-white mb-6">{editingItem ? "Editar" : "Nuevo"} Plan {activeTab === "diseno" ? "" : "Mant."}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#A1A1AA] uppercase">Nombre</label>
                  <input type="text" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full bg-[#F4F4F5] dark:bg-[#27272A] rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#A1A1AA] uppercase">Precio CLP</label>
                  <input type="number" required value={formData.precio} onChange={e => setFormData({...formData, precio: Number(e.target.value)})} className="w-full bg-[#F4F4F5] dark:bg-[#27272A] rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>
              
              {activeTab === "diseno" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#A1A1AA] uppercase">Descripción</label>
                  <input type="text" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full bg-[#F4F4F5] dark:bg-[#27272A] rounded-xl px-4 py-3 text-sm" />
                </div>
              )}

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.publicado} onChange={e => setFormData({...formData, publicado: e.target.checked})} className="accent-[#7C5CBF]" />
                  <span className="text-sm font-medium">Publicado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.destacado} onChange={e => setFormData({...formData, destacado: e.target.checked})} className="accent-[#7C5CBF]" />
                  <span className="text-sm font-medium">Destacado</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1AA] uppercase">Características (Icono check)</label>
                {formData.caracteristicas.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={c} onChange={e => {
                      const newChars = [...formData.caracteristicas];
                      newChars[i] = e.target.value;
                      setFormData({ ...formData, caracteristicas: newChars });
                    }} className="flex-1 bg-[#F4F4F5] dark:bg-[#27272A] rounded-xl px-4 py-2 text-sm" />
                    <button type="button" onClick={() => {
                      setFormData({ ...formData, caracteristicas: formData.caracteristicas.filter((_, idx) => idx !== i) });
                    }} className="text-red-500">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setFormData({ ...formData, caracteristicas: [...formData.caracteristicas, ""] })} className="text-[#7C5CBF] text-xs font-bold">+ Agregar Línea</button>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-[#F4F4F5] dark:bg-[#27272A] font-bold py-3 rounded-xl">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#7C5CBF] text-white font-bold py-3 rounded-xl hover:bg-[#6B4DAE] transition-all disabled:opacity-50">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
