"use client"

import { useState, useEffect } from "react"
import { fetchClientes, insertCliente, deleteCliente, type Cliente } from "../../../utils/supabase"

interface FormState {
  nombre: string
  email: string
  sitio_web: string
}

const EMPTY_FORM: FormState = { nombre: "", email: "", sitio_web: "" }

export default function ClientesSection() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  async function loadClientes() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchClientes()
      setClientes(data)
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
      await insertCliente({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        sitio_web: form.sitio_web.trim()
      })
      setForm(EMPTY_FORM)
      await loadClientes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cliente")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCliente(id)
      setClientes(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar cliente")
    }
  }

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#18181B] mb-6">Clientes</h2>

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
            placeholder="Ej: Cliente Acme"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#888] font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="border border-[#E4E4E7] rounded-lg px-3 py-1.5 text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
            placeholder="email@ejemplo.com"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#888] font-medium">Sitio Web</label>
          <input
            type="text"
            value={form.sitio_web}
            onChange={e => setForm(f => ({ ...f, sitio_web: e.target.value }))}
            className="border border-[#E4E4E7] rounded-lg px-3 py-1.5 text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30"
            placeholder="https://..."
          />
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
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Email</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2 pr-4">Web</th>
                <th className="text-left text-[#888] text-xs font-semibold uppercase tracking-wider pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-[#888] text-center">Sin clientes</td>
                </tr>
              )}
              {clientes.map(cliente => (
                <tr key={cliente.id} className="border-b border-[#F4F4F5] hover:bg-[#FAFAFA]">
                  <td className="py-2.5 pr-4 text-[#18181B] font-medium">{cliente.nombre}</td>
                  <td className="py-2.5 pr-4 text-[#52525B]">{cliente.email || "—"}</td>
                  <td className="py-2.5 pr-4 text-[#888]">
                    {cliente.sitio_web ? (
                      <a href={cliente.sitio_web} target="_blank" rel="noopener noreferrer" className="hover:text-[#7C5CBF] transition-colors">
                        {cliente.sitio_web.replace(/^https?:\/\//, "")}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => { if(confirm("¿Eliminar?")) handleDelete(cliente.id) }}
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
