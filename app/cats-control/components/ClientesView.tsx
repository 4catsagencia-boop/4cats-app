"use client";

import { useEffect, useState } from "react";
import {
  fetchClientes, insertCliente, updateCliente, deleteCliente,
  type Cliente
} from "../../../utils/supabase";

const EMPTY: Partial<Cliente> = { 
  nombre: "", 
  email: "", 
  telefono: "", 
  sitio_web: "",
  persona_encargada: "",
  razon_social: "",
  rut: "",
  giro: "",
  direccion_facturacion: "",
  comuna: "",
  ciudad: "",
  clasificacion: "",
  condicion_pago: "",
  tipo_documento: "",
  instagram: "",
  linkedin: "",
  facebook: "",
  tiktok: "",
  twitter: ""
};

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#18181B] dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded-full transition-colors text-[#A1A1AA]">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">{label}{required && " *"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-[#F4F4F5] dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
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
  const [tab, setTab] = useState<"general" | "facturacion" | "social">("general");

  useEffect(() => {
    fetchClientes().then(setClientes).finally(() => setLoading(false));
  }, []);

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.persona_encargada?.toLowerCase().includes(query.toLowerCase())
  );

  function openCreate() { setForm(EMPTY); setTab("general"); setModal("create"); }
  function openEdit(c: Cliente) { setSelected(c); setForm({ ...c }); setTab("general"); setModal("edit"); }
  function openDelete(c: Cliente) { setSelected(c); setModal("delete"); }
  function closeModal() { setModal(null); setSelected(null); }

  async function handleSave() {
    if (!form.nombre || !form.email) {
      alert("Nombre y Email son obligatorios");
      return;
    }
    setSaving(true);
    try {
      if (modal === "create") {
        const res = await insertCliente(form);
        if (res && res.length > 0) {
          const nuevo = res[0];
          setClientes((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        }
      } else if (modal === "edit" && selected) {
        await updateCliente(selected.id, form);
        setClientes((prev) => prev.map((c) => (c.id === selected.id ? { ...c, ...form } as Cliente : c)));
      }
      closeModal();
    } catch (error: unknown) {
      console.error("ERROR AL GUARDAR CLIENTE:", error);
      const msg = error instanceof Error ? error.message : "Error desconocido";
      alert(`No se pudo guardar: ${msg}`);
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
              placeholder="Buscar por nombre, email o encargado..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] text-sm text-[#18181B] dark:text-white placeholder-[#A1A1AA] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#7C5CBF] w-64"
            />
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-[#7C5CBF] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#6B4DAE] transition-all active:scale-95 shadow-lg shadow-[#7C5CBF]/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Nuevo cliente
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((c) => (
            <div key={c.id} className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#F3EEFF] dark:bg-[#1C1630] flex items-center justify-center text-lg font-bold text-[#7C5CBF]">
                    {c.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#18181B] dark:text-white text-base truncate">{c.nombre}</p>
                    {c.persona_encargada && (
                      <p className="text-xs font-semibold text-[#7C5CBF] truncate italic">👤 {c.persona_encargada}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-2 rounded-xl hover:bg-[#F3EEFF] dark:hover:bg-[#1C1630] text-[#7C5CBF] transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => openDelete(c)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-[#F4F4F5] dark:border-[#2A2A35] pt-4">
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] flex items-center gap-2">📧 <span className="truncate">{c.email}</span></p>
                {c.telefono && <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] flex items-center gap-2">📞 {c.telefono}</p>}
                {c.sitio_web && (
                  <a href={c.sitio_web.startsWith('http') ? c.sitio_web : `https://${c.sitio_web}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#7C5CBF] hover:underline flex items-center gap-2 truncate">
                    🌐 {c.sitio_web}
                  </a>
                )}
              </div>

              {/* RRSS quick links */}
              {(c.instagram || c.linkedin || c.facebook || c.tiktok || c.twitter) && (
                <div className="flex gap-3 mt-1">
                  {c.instagram && <a href={`https://instagram.com/${c.instagram.replace('@','')}`} target="_blank" className="text-[#A1A1AA] hover:text-[#7C5CBF]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-4.78 2.618-4.903 4.903-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.123 2.285 2.545 4.704 4.903 4.903 1.28.059 1.688.073 4.948.073s3.667-.014 4.947-.072c2.285-.123 4.704-2.545 4.903-4.903.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.123-2.285-2.545-4.704-4.903-4.903-1.28-.059-1.688-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>}
                  {c.tiktok && <a href={`https://tiktok.com/@${c.tiktok.replace('@','')}`} target="_blank" className="text-[#A1A1AA] hover:text-[#7C5CBF]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.1-.03-.1 0-1.27.14-2.54.54-3.73.65-1.82 2.12-3.39 3.97-4.1 1.25-.52 2.62-.73 3.97-.68 0 1.4.01 2.8.01 4.2-.82-.16-1.68-.08-2.43.27-1.1.53-1.85 1.62-1.93 2.83-.02.43.01.87.11 1.29.32 1.2 1.55 2.1 2.81 2.01.99-.01 1.9-.6 2.33-1.48.33-.67.4-1.44.37-2.18-.02-4.1-.02-8.21-.02-12.31z"/></svg></a>}
                  {c.twitter && <a href={`https://twitter.com/${c.twitter.replace('@','')}`} target="_blank" className="text-[#A1A1AA] hover:text-[#7C5CBF]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z"/></svg></a>}
                  {c.linkedin && <a href={c.linkedin.startsWith('http') ? c.linkedin : `https://linkedin.com/in/${c.linkedin}`} target="_blank" className="text-[#A1A1AA] hover:text-[#7C5CBF]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>}
                  {c.facebook && <a href={c.facebook.startsWith('http') ? c.facebook : `https://facebook.com/${c.facebook}`} target="_blank" className="text-[#A1A1AA] hover:text-[#7C5CBF]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 10.995 9 11.93v-8.435H7.114v-3.495H9V9.45c0-1.859 1.107-2.883 2.798-2.883.81 0 1.657.145 1.657.145v1.82h-.933c-.921 0-1.207.571-1.207 1.157v1.39h2.051l-.328 3.495h-1.723V24c5.344-.935 9-5.94 9-11.927z"/></svg></a>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {(modal === "create" || modal === "edit") && (
        <Modal title={modal === "create" ? "Nuevo cliente" : "Editar cliente"} onClose={closeModal}>
          <div className="flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-[#F4F4F5] dark:bg-[#27272A] rounded-2xl">
              {(["general", "facturacion", "social"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    tab === t ? "bg-white dark:bg-[#18181B] text-[#7C5CBF] shadow-sm" : "text-[#A1A1AA] hover:text-[#52525B]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {tab === "general" && (
                <>
                  <Field label="Nombre Empresa / Cliente" value={form.nombre ?? ""} onChange={(v) => setForm((f) => ({ ...f, nombre: v }))} required placeholder="Ej: Plus Gráfica" />
                  <Field label="Persona Encargada" value={form.persona_encargada ?? ""} onChange={(v) => setForm((f) => ({ ...f, persona_encargada: v }))} placeholder="Ej: Luis Sáez" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Email" type="email" value={form.email ?? ""} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required placeholder="email@ejemplo.com" />
                    <Field label="Teléfono" value={form.telefono ?? ""} onChange={(v) => setForm((f) => ({ ...f, telefono: v }))} placeholder="+56 9..." />
                  </div>
                  <Field label="Sitio web" value={form.sitio_web ?? ""} onChange={(v) => setForm((f) => ({ ...f, sitio_web: v }))} placeholder="www.ejemplo.cl" />
                </>
              )}

              {tab === "facturacion" && (
                <>
                  <Field label="Razón Social" value={form.razon_social ?? ""} onChange={(v) => setForm((f) => ({ ...f, razon_social: v }))} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="RUT" value={form.rut ?? ""} onChange={(v) => setForm((f) => ({ ...f, rut: v }))} placeholder="12.345.678-9" />
                    <Field label="Giro" value={form.giro ?? ""} onChange={(v) => setForm((f) => ({ ...f, giro: v }))} />
                  </div>
                  <Field label="Dirección de Facturación" value={form.direccion_facturacion ?? ""} onChange={(v) => setForm((f) => ({ ...f, direccion_facturacion: v }))} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Comuna" value={form.comuna ?? ""} onChange={(v) => setForm((f) => ({ ...f, comuna: v }))} />
                    <Field label="Ciudad" value={form.ciudad ?? ""} onChange={(v) => setForm((f) => ({ ...f, ciudad: v }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Clasificación" value={form.clasificacion ?? ""} onChange={(v) => setForm((f) => ({ ...f, clasificacion: v }))} placeholder="Ej: Pyme / Profesional" />
                    <Field label="Condición de Pago" value={form.condicion_pago ?? ""} onChange={(v) => setForm((f) => ({ ...f, condicion_pago: v }))} placeholder="Ej: Contado" />
                  </div>
                  <Field label="Tipo de Documento Preferido" value={form.tipo_documento ?? ""} onChange={(v) => setForm((f) => ({ ...f, tipo_documento: v }))} placeholder="Factura / Boleta" />
                </>
              )}

              {tab === "social" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Instagram" value={form.instagram ?? ""} onChange={(v) => setForm((f) => ({ ...f, instagram: v }))} placeholder="@usuario" />
                    <Field label="TikTok" value={form.tiktok ?? ""} onChange={(v) => setForm((f) => ({ ...f, tiktok: v }))} placeholder="@usuario" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="LinkedIn" value={form.linkedin ?? ""} onChange={(v) => setForm((f) => ({ ...f, linkedin: v }))} placeholder="usuario o URL" />
                    <Field label="Twitter / X" value={form.twitter ?? ""} onChange={(v) => setForm((f) => ({ ...f, twitter: v }))} placeholder="@usuario" />
                  </div>
                  <Field label="Facebook" value={form.facebook ?? ""} onChange={(v) => setForm((f) => ({ ...f, facebook: v }))} />
                </>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#F4F4F5] dark:border-[#2A2A35]">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-sm font-bold text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] transition-all">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving || !form.nombre || !form.email} className="flex-1 py-3 rounded-xl bg-[#7C5CBF] text-white text-sm font-bold hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20 disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar Cliente"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === "delete" && selected && (
        <Modal title="Eliminar cliente" onClose={closeModal}>
          <p className="text-sm text-[#52525B] dark:text-[#A1A1AA] mb-8 leading-relaxed">
            ¿Estás seguro de que quieres eliminar a <strong className="text-[#18181B] dark:text-white">{selected.nombre}</strong>? Esta acción no se puede deshacer y perderás toda su información de facturación y contacto.
          </p>
          <div className="flex gap-3">
            <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-sm font-bold text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] transition-all">
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50">
              {saving ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
