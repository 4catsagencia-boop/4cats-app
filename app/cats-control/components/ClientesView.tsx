"use client";

import { useEffect, useState } from "react";
import {
  fetchClientes, insertCliente, updateCliente, deleteCliente,
  type Cliente
} from "../../../utils/supabase";

const EMPTY: Partial<Cliente> = { nombre: "", email: "", telefono: "", sitio_web: "" };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#18181B] dark:text-white">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] text-[#A1A1AA]">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">{label}{required && " *"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
      />
    </div>
  );
}

export default function ClientesView() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [form, setForm] = useState<Partial<Cliente>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClientes().then(setClientes).finally(() => setLoading(false));
  }, []);

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  function openCreate() { setForm(EMPTY); setModal("create"); }
  function openEdit(c: Cliente) { setSelected(c); setForm({ ...c }); setModal("edit"); }
  function openDelete(c: Cliente) { setSelected(c); setModal("delete"); }
  function closeModal() { setModal(null); setSelected(null); }

  async function handleSave() {
    if (!form.nombre || !form.email) return;
    setSaving(true);
    try {
      if (modal === "create") {
        const [nuevo] = await insertCliente(form);
        setClientes((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      } else if (modal === "edit" && selected) {
        await updateCliente(selected.id, form);
        setClientes((prev) => prev.map((c) => (c.id === selected.id ? { ...c, ...form } as Cliente : c)));
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true);
    try {
      await deleteCliente(selected.id);
      setClientes((prev) => prev.filter((c) => c.id !== selected.id));
      closeModal();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Clientes</h1>
            <p className="text-sm text-[#A1A1AA] mt-0.5">{clientes.length} registrados</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="search"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] text-sm text-[#18181B] dark:text-white placeholder-[#A1A1AA] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#7C5CBF] w-52"
            />
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-[#7C5CBF] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#6B4DAE] transition-all active:scale-95"
            >
              + Nuevo cliente
            </button>
          </div>
        </div>

        {filtrados.length === 0 && (
          <p className="text-sm text-[#A1A1AA]">Sin resultados.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((c) => (
            <div key={c.id} className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-[#F3EEFF] dark:bg-[#1C1630] flex items-center justify-center text-sm font-bold text-[#7C5CBF]">
                    {c.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#18181B] dark:text-white text-sm truncate">{c.nombre}</p>
                    <p className="text-xs text-[#A1A1AA] truncate">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#1C1630] text-[#7C5CBF] transition-colors text-xs">✎</button>
                  <button onClick={() => openDelete(c)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors text-xs">✕</button>
                </div>
              </div>
              {c.telefono && <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">📞 {c.telefono}</p>}
              {c.sitio_web && (
                <a href={c.sitio_web} target="_blank" rel="noopener noreferrer" className="text-xs text-[#7C5CBF] hover:underline truncate">
                  🌐 {c.sitio_web}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {(modal === "create" || modal === "edit") && (
        <Modal title={modal === "create" ? "Nuevo cliente" : "Editar cliente"} onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <Field label="Nombre" value={form.nombre ?? ""} onChange={(v) => setForm((f) => ({ ...f, nombre: v }))} required />
            <Field label="Email" type="email" value={form.email ?? ""} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
            <Field label="Teléfono" value={form.telefono ?? ""} onChange={(v) => setForm((f) => ({ ...f, telefono: v }))} />
            <Field label="Sitio web" value={form.sitio_web ?? ""} onChange={(v) => setForm((f) => ({ ...f, sitio_web: v }))} />
            <div className="flex gap-3 mt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving || !form.nombre || !form.email} className="flex-1 py-2.5 rounded-xl bg-[#7C5CBF] text-white text-sm font-semibold hover:bg-[#6B4DAE] transition-all disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === "delete" && selected && (
        <Modal title="Eliminar cliente" onClose={closeModal}>
          <p className="text-sm text-[#52525B] dark:text-[#A1A1AA] mb-6">
            ¿Eliminar a <strong className="text-[#18181B] dark:text-white">{selected.nombre}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all">
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-50">
              {saving ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
