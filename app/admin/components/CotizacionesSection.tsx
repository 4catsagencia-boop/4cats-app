"use client"

import { useState, useEffect } from "react"
import { fetchCotizaciones, updateCotizacionStatus, type Cotizacion } from "../../../utils/supabase"

const ESTADO_BADGE: Record<Cotizacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  aprobada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-500",
}

function formatFecha(iso?: string): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
}

export default function CotizacionesSection() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadCotizaciones() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCotizaciones()
      setCotizaciones(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar cotizaciones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCotizaciones() }, [])

  async function handleEstadoChange(id: string, estado: Cotizacion["estado"]) {
    try {
      await updateCotizacionStatus(id, estado)
      setCotizaciones(prev => prev.map(c => c.id === id ? { ...c, estado } : c))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar estado")
    }
  }

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#18181B] mb-6">Cotizaciones</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {loading ? (
        <p className="text-[#888] text-sm">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4E4E7]">
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Nombre</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Email</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Plan</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Notas</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Estado</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Fecha</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-[#888] text-center">Sin cotizaciones</td>
                </tr>
              )}
              {cotizaciones.map(cot => (
                <tr key={cot.id} className="border-b border-[#F4F4F5] hover:bg-[#FAFAFA]">
                  <td className="py-2.5 pr-4 text-[#18181B] font-medium whitespace-nowrap">{cot.cliente_nombre}</td>
                  <td className="py-2.5 pr-4 text-[#888]">{cot.cliente_email}</td>
                  <td className="py-2.5 pr-4 text-[#888]">{cot.plan_nombre ?? "—"}</td>
                  <td className="py-2.5 pr-4 text-[#888] max-w-[180px]">
                    {cot.notas ? (
                      <span title={cot.notas}>
                        {cot.notas.length > 60 ? `${cot.notas.slice(0, 60)}…` : cot.notas}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_BADGE[cot.estado]}`}>
                      {cot.estado}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-[#888] whitespace-nowrap">{formatFecha(cot.created_at)}</td>
                  <td className="py-2.5">
                    <select
                      value={cot.estado}
                      onChange={e => handleEstadoChange(cot.id, e.target.value as Cotizacion["estado"])}
                      className="border border-[#E4E4E7] rounded-lg px-2 py-1 text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30 cursor-pointer"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobada">Aprobada</option>
                      <option value="rechazada">Rechazada</option>
                    </select>
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
