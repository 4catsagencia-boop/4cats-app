"use client"

import { useState, useEffect } from "react"
import { Tables, type Cotizacion } from "../../../utils/supabase"
import { useAdminDB } from "../hooks/useAdminDB"

const ESTADO_BADGE: Record<Cotizacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  aprobada: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rechazada: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
}

function formatFecha(iso?: string): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
}

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function CotizacionesSection() {
  const adminDB = useAdminDB()
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  async function loadCotizaciones() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminDB.select("cotizaciones")
      setCotizaciones(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar cotizaciones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCotizaciones() }, [])

  async function handleEstadoChange(id: string, estado: Cotizacion["estado"]) {
    setUpdating(id)
    try {
      await adminDB.update("cotizaciones", id, { estado })
      setCotizaciones(prev => prev.map(c => c.id === id ? { ...c, estado } : c))
    } catch (err) {
      alert("Error al actualizar estado")
    } finally {
      setUpdating(null)
    }
  }

  if (loading && cotizaciones.length === 0) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-black text-[#18181B] dark:text-white">Cotizaciones Recibidas</h2>
          <p className="text-xs text-[#A1A1AA] uppercase tracking-widest font-bold mt-1">Inbox de Ventas</p>
        </div>
        <button 
          onClick={loadCotizaciones}
          className="p-2 hover:bg-[#F4F4F5] dark:hover:bg-[#2A2A35] rounded-xl transition-colors"
        >
          <svg className={`w-4 h-4 text-[#7C5CBF] ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="overflow-x-auto -mx-8 px-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-[0.2em] border-b border-[#F4F4F5] dark:border-[#2A2A35]">
              <th className="text-left pb-4 pr-4">Cliente</th>
              <th className="text-left pb-4 pr-4">Plan / Interés</th>
              <th className="text-right pb-4 pr-4">Total Est.</th>
              <th className="text-center pb-4 pr-4">Estado</th>
              <th className="text-right pb-4">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
            {cotizaciones.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-[#A1A1AA] text-center italic">No hay cotizaciones registradas aún.</td>
              </tr>
            )}
            {cotizaciones.map(cot => (
              <tr key={cot.id} className={`group hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors ${updating === cot.id ? 'opacity-40' : ''}`}>
                <td className="py-5 pr-4">
                  <p className="text-[#18181B] dark:text-white font-bold">{cot.cliente_nombre}</p>
                </td>
                <td className="py-5 pr-4">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-[#7C5CBF] bg-[#7C5CBF]/10 px-2 py-0.5 rounded">
                    {cot.plan_nombre ?? "Personalizado"}
                  </span>
                  <p className="text-[10px] text-[#A1A1AA] mt-1 line-clamp-1">{cot.notas || "Sin mensajes adicionales"}</p>
                </td>
                <td className="py-5 pr-4 text-right">
                  <p className="text-[#18181B] dark:text-white font-black">{clp.format(cot.total)}</p>
                  <p className="text-[9px] text-[#A1A1AA] font-mono">{formatFecha(cot.created_at)}</p>
                </td>
                <td className="py-5 pr-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${ESTADO_BADGE[cot.estado]}`}>
                    {cot.estado}
                  </span>
                </td>
                <td className="py-5 text-right">
                  <select
                    value={cot.estado}
                    disabled={updating === cot.id}
                    onChange={e => handleEstadoChange(cot.id, e.target.value as Cotizacion["estado"])}
                    className="bg-[#F4F4F5] dark:bg-[#2A2A35] border-none rounded-xl px-3 py-1.5 text-[10px] font-bold text-[#18181B] dark:text-white focus:ring-2 focus:ring-[#7C5CBF] outline-none cursor-pointer appearance-none text-center"
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
    </div>
  )
}
