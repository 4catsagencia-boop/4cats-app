"use client"

import { useState, useEffect } from "react"
import { fetchPlanes, insertPlan, deletePlan, updatePlan, type Plan } from "../../../utils/supabase"

interface FormState {
  nombre: string
  precio: string
  publicado: boolean
  destacado: boolean
}

const EMPTY_FORM: FormState = { nombre: "", precio: "", publicado: false, destacado: false }

export default function PlanesSection() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  async function loadPlanes() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPlanes()
      setPlanes(data)
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
      await insertPlan({
        nombre: form.nombre.trim(),
        precio: parseFloat(form.precio),
        publicado: form.publicado,
        destacado: form.destacado,
      })
      setForm(EMPTY_FORM)
      await loadPlanes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear plan")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePlan(id)
      setPlanes(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar plan")
    }
  }

  async function handleToggle(plan: Plan, field: "publicado" | "destacado") {
    try {
      await updatePlan(plan.id, { [field]: !plan[field] })
      setPlanes(prev => prev.map(p => p.id === plan.id ? { ...p, [field]: !p[field] } : p))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar plan")
    }
  }

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#18181B] mb-6">Planes</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Formulario agregar */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#888] font-medium">Nombre</label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            className="border border-[#E4E4E7] rounded-lg px-3 py-1.5 text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
            placeholder="Ej: Plan Básico"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#888] font-medium">Precio</label>
          <input
            type="number"
            required
            value={form.precio}
            onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
            className="border border-[#E4E4E7] rounded-lg px-3 py-1.5 text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30 w-32"
            placeholder="0"
          />
        </div>
        <div className="flex items-center gap-2 pb-2 px-2">
          <input
            type="checkbox"
            id="publicado"
            checked={form.publicado}
            onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))}
            className="w-4 h-4 text-[#7C5CBF] rounded border-[#E4E4E7] focus:ring-[#7C5CBF]"
          />
          <label htmlFor="publicado" className="text-xs text-[#52525B] cursor-pointer">Publicado</label>
        </div>
        <div className="flex items-center gap-2 pb-2 px-2">
          <input
            type="checkbox"
            id="destacado"
            checked={form.destacado}
            onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
            className="w-4 h-4 text-[#7C5CBF] rounded border-[#E4E4E7] focus:ring-[#7C5CBF]"
          />
          <label htmlFor="destacado" className="text-xs text-[#52525B] cursor-pointer">Destacado</label>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#7C5CBF] hover:bg-[#6A4EB0] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {submitting ? "..." : "Agregar"}
        </button>
      </form>

      {loading ? (
        <p className="text-[#888] text-sm">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4E4E7]">
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Nombre</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Precio</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Publicado</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Destacado</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-[#888] text-center">Sin planes registrados</td>
                </tr>
              )}
              {planes.map(plan => (
                <tr key={plan.id} className="border-b border-[#F4F4F5] hover:bg-[#FAFAFA]">
                  <td className="py-2.5 pr-4 text-[#18181B] font-medium">{plan.nombre}</td>
                  <td className="py-2.5 pr-4 text-[#52525B]">
                    ${plan.precio.toLocaleString("es-CL")}
                  </td>
                  <td className="py-2.5 pr-4">
                    <button
                      onClick={() => handleToggle(plan, "publicado")}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        plan.publicado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {plan.publicado ? "SÍ" : "NO"}
                    </button>
                  </td>
                  <td className="py-2.5 pr-4">
                    <button
                      onClick={() => handleToggle(plan, "destacado")}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        plan.destacado ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {plan.destacado ? "SÍ" : "NO"}
                    </button>
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => { if(confirm("¿Eliminar?")) handleDelete(plan.id) }}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
