"use client"

import { useState, useEffect } from "react"
import { Tables, type Plan } from "../../../utils/supabase"
import { useAdminDB } from "../hooks/useAdminDB"

interface FormState {
  nombre: string
  precio: string
  publicado: boolean
  destacado: boolean
}

const EMPTY_FORM: FormState = { nombre: "", precio: "", publicado: true, destacado: false }

export default function PlanesSection() {
  const adminDB = useAdminDB()
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  async function loadPlanes() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminDB.select("planes")
      setPlanes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar planes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPlanes() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.precio) return
    setSubmitting(true)
    try {
      await adminDB.insert("planes", {
        nombre: form.nombre.trim(),
        precio: parseFloat(form.precio),
        publicado: form.publicado,
        destacado: form.destacado,
      })
      setForm(EMPTY_FORM)
      await loadPlanes()
      alert("Plan creado exitosamente 🚀")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear plan")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que querés eliminar este plan?")) return;
    setUpdating(id);
    try {
      await adminDB.remove("planes", id)
      setPlanes(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert("Error al eliminar")
    } finally {
      setUpdating(null);
    }
  }

  async function handleToggle(plan: Plan, field: "publicado" | "destacado") {
    setUpdating(plan.id);
    try {
      const newValue = !plan[field];
      await adminDB.update("planes", plan.id, { [field]: newValue })
      setPlanes(prev => prev.map(p => p.id === plan.id ? { ...p, [field]: newValue } : p))
    } catch (err) {
      alert("Error al actualizar plan")
    } finally {
      setUpdating(null);
    }
  }

  if (loading && planes.length === 0) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-black text-[#18181B] dark:text-white">Catálogo de Planes</h2>
          <p className="text-xs text-[#A1A1AA] uppercase tracking-widest font-bold mt-1">Oferta comercial pública</p>
        </div>
        <button 
          onClick={loadPlanes}
          className="p-2 hover:bg-[#F4F4F5] dark:hover:bg-[#2A2A35] rounded-xl transition-colors"
        >
          <svg className={`w-4 h-4 text-[#7C5CBF] ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Formulario rápido */}
      <form onSubmit={handleSubmit} className="bg-[#F3EEFF]/50 dark:bg-[#1C1630]/50 border border-[#7C5CBF]/20 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#7C5CBF] font-black uppercase tracking-widest">Nombre del Plan</label>
            <input
              type="text" required value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-2.5 text-sm text-[#18181B] dark:text-white outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
              placeholder="Ej: Plan Lucy"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#7C5CBF] font-black uppercase tracking-widest">Precio CLP</label>
            <input
              type="number" required value={form.precio}
              onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
              className="bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-2.5 text-sm text-[#18181B] dark:text-white outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
              placeholder="0"
            />
          </div>
          <div className="flex gap-4 pb-2.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox" checked={form.publicado}
                onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))}
                className="w-4 h-4 text-[#7C5CBF] rounded border-[#E4E4E7] focus:ring-[#7C5CBF] accent-[#7C5CBF]"
              />
              <span className="text-[10px] text-[#52525B] dark:text-[#A1A1AA] font-bold uppercase group-hover:text-[#7C5CBF] transition-colors">Público</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox" checked={form.destacado}
                onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
                className="w-4 h-4 text-[#7C5CBF] rounded border-[#E4E4E7] focus:ring-[#7C5CBF] accent-[#7C5CBF]"
              />
              <span className="text-[10px] text-[#52525B] dark:text-[#A1A1AA] font-bold uppercase group-hover:text-[#7C5CBF] transition-colors">Destacar</span>
            </label>
          </div>
          <button
            type="submit" disabled={submitting}
            className="bg-[#7C5CBF] hover:bg-[#6B4DAE] text-white py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-[#7C5CBF]/20 active:scale-95"
          >
            {submitting ? "..." : "Crear Plan"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto -mx-8 px-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-[0.2em] border-b border-[#F4F4F5] dark:border-[#2A2A35]">
              <th className="text-left pb-4 pr-4">Servicio</th>
              <th className="text-right pb-4 pr-4">Valor Base</th>
              <th className="text-center pb-4 pr-4">Status</th>
              <th className="text-center pb-4 pr-4">Featured</th>
              <th className="text-right pb-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
            {planes.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-[#A1A1AA] text-center italic">No hay planes registrados.</td>
              </tr>
            )}
            {planes.map(plan => (
              <tr key={plan.id} className={`group hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors ${updating === plan.id ? 'opacity-40' : ''}`}>
                <td className="py-5 pr-4">
                  <p className="text-[#18181B] dark:text-white font-black uppercase tracking-tight">{plan.nombre}</p>
                </td>
                <td className="py-5 pr-4 text-right">
                  <p className="text-[#18181B] dark:text-white font-black text-sm">
                    ${plan.precio.toLocaleString("es-CL")}
                  </p>
                </td>
                <td className="py-5 pr-4 text-center">
                  <button
                    onClick={() => handleToggle(plan, "publicado")}
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm transition-all active:scale-90 ${
                      plan.publicado ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                    }`}
                  >
                    {plan.publicado ? "Visible" : "Oculto"}
                  </button>
                </td>
                <td className="py-5 pr-4 text-center">
                  <button
                    onClick={() => handleToggle(plan, "destacado")}
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm transition-all active:scale-90 ${
                      plan.destacado ? "bg-[#F3EEFF] text-[#7C5CBF] dark:bg-[#1C1630]" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                    }`}
                  >
                    {plan.destacado ? "Destacado" : "Regular"}
                  </button>
                </td>
                <td className="py-5 text-right">
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-[#A1A1AA] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                    title="Eliminar Plan"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
