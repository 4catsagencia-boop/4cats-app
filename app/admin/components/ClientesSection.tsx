"use client"

import { useState, useEffect } from "react"
import { Tables, type Cliente } from "../../../utils/supabase"
import { useAdminDB } from "../hooks/useAdminDB"

interface FormState {
  nombre: string
  email: string
  sitio_web: string
}

const EMPTY_FORM: FormState = { nombre: "", email: "", sitio_web: "" }

export default function ClientesSection() {
  const adminDB = useAdminDB()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  async function loadClientes() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminDB.select("clientes")
      setClientes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar clientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClientes() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim()) return
    setSubmitting(true)
    try {
      await adminDB.insert("clientes", {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        sitio_web: form.sitio_web.trim()
      })
      setForm(EMPTY_FORM)
      await loadClientes()
      alert("Cliente agregado ✅")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cliente")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que querés eliminar este cliente? No se puede deshacer.")) return;
    try {
      await adminDB.remove("clientes", id)
      setClientes(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert("Error al eliminar")
    }
  }

  if (loading && clientes.length === 0) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-black text-[#18181B] dark:text-white">Directorio de Clientes</h2>
          <p className="text-xs text-[#A1A1AA] uppercase tracking-widest font-bold mt-1">Gestión de gatas aliadas</p>
        </div>
        <button 
          onClick={loadClientes}
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

      {/* Formulario agregar */}
      <form onSubmit={handleSubmit} className="bg-[#F4F4F5]/50 dark:bg-[#1C1C1E]/50 border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">Nombre del Cliente</label>
            <input
              type="text" required value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-2.5 text-sm text-[#18181B] dark:text-white outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
              placeholder="Ej: Agencia Acme"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">Email de Contacto</label>
            <input
              type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-2.5 text-sm text-[#18181B] dark:text-white outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
              placeholder="cliente@ejemplo.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">Sitio Web</label>
            <div className="flex gap-2">
              <input
                type="text" value={form.sitio_web}
                onChange={e => setForm(f => ({ ...f, sitio_web: e.target.value }))}
                className="flex-1 bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-2.5 text-sm text-[#18181B] dark:text-white outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
                placeholder="https://..."
              />
              <button
                type="submit" disabled={submitting}
                className="bg-[#7C5CBF] hover:bg-[#6B4DAE] text-white px-6 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-[#7C5CBF]/20"
              >
                {submitting ? "..." : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto -mx-8 px-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-[0.2em] border-b border-[#F4F4F5] dark:border-[#2A2A35]">
              <th className="text-left pb-4 pr-4">Identidad</th>
              <th className="text-left pb-4 pr-4">Canal Digital</th>
              <th className="text-right pb-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
            {clientes.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-[#A1A1AA] text-center italic">No hay clientes registrados aún.</td>
              </tr>
            )}
            {clientes.map(cliente => (
              <tr key={cliente.id} className="group hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors">
                <td className="py-5 pr-4">
                  <p className="text-[#18181B] dark:text-white font-bold">{cliente.nombre}</p>
                  <p className="text-[11px] text-[#A1A1AA] font-medium">{cliente.email || "Sin email registrado"}</p>
                </td>
                <td className="py-5 pr-4">
                  {cliente.sitio_web ? (
                    <a 
                      href={cliente.sitio_web.startsWith('http') ? cliente.sitio_web : `https://${cliente.sitio_web}`} 
                      target="_blank" rel="noopener noreferrer" 
                      className="text-[#7C5CBF] font-bold text-xs hover:underline flex items-center gap-1.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      {cliente.sitio_web.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#A1A1AA] italic">Sin web</span>
                  )}
                </td>
                <td className="py-5 text-right">
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="p-2 text-[#A1A1AA] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                    title="Eliminar Cliente"
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
    </div>
  )
}
