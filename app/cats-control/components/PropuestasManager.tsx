"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { motion } from "framer-motion";
import {
  Propuesta,
  Cliente,
} from "@/utils/supabase";
import PropuestaView from "@/app/components/PropuestaView";
import PropuestaForm from "./PropuestaForm";
import PropuestaWizard from "./PropuestaWizard";
import { Plus, Pencil, Copy, Trash2, Mail, MessageCircle, CopyPlus, Check } from "lucide-react";

const PUBLIC_BASE = "https://4cats.cl/propuesta";

type Screen = "list" | "view" | "create" | "edit";

export default function PropuestasManager() {
  const adminDB = useAdminDB();
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selected, setSelected] = useState<Propuesta | null>(null);
  const [screen, setScreen] = useState<Screen>("list");
  const [clienteId, setClienteId] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminDB.select("propuestas"),
      adminDB.select("clientes")
    ])
      .then(([p, c]) => { setPropuestas(p); setClientes(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSuccess = () => { load(); setScreen("list"); setSelected(null); };

  const handleCopyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${PUBLIC_BASE}/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = (p: Propuesta) => {
    const url = `${PUBLIC_BASE}/${p.slug}`;
    const msg = encodeURIComponent(`Hola! Te comparto la propuesta estratégica para tu proyecto:\n\n*${p.titulo}*\n${url}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleEmail = (p: Propuesta) => {
    const url = `${PUBLIC_BASE}/${p.slug}`;
    const subject = encodeURIComponent(`Propuesta: ${p.titulo}`);
    const body = encodeURIComponent(`Hola,\n\nTe comparto la propuesta estratégica que preparamos para tu proyecto.\n\nPodés verla acá: ${url}\n\nQuedamos a tu disposición para cualquier consulta.\n\nSaludos,\nEquipo 4cats`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleDuplicate = async (p: Propuesta) => {
    setActionLoading("duplicate");
    try {
      const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = p as Propuesta & { updated_at?: string };
      const newSlug = `${rest.slug}-copia-${Date.now().toString(36)}`;
      await adminDB.insert("propuestas", { ...rest, slug: newSlug, titulo: `${rest.titulo} (copia)`, estado: "borrador" });
      load();
      setScreen("list");
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Error al duplicar la propuesta.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (p: Propuesta) => {
    if (!confirm(`¿Eliminar "${p.titulo}"? Esta acción no se puede deshacer.`)) return;
    setActionLoading("delete");
    try {
      await adminDB.remove("propuestas", p.id);
      load();
      setScreen("list");
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Error al eliminar la propuesta.");
    } finally {
      setActionLoading(null);
    }
  };

  if (screen === "view" && selected) {
    return (
      <div>
        {/* Action bar */}
        <div className="mx-4 sm:mx-8 mt-6 mb-0 pb-4 border-b border-[#E4E4E7] dark:border-[#2A2A35] space-y-3">
          <button
            onClick={() => { setScreen("list"); setSelected(null); }}
            className="text-sm text-[#7C5CBF] font-semibold hover:underline"
          >
            ← Volver
          </button>

          {/* Botones de acción — scroll horizontal en móvil */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setScreen("edit")}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-[#7C5CBF] transition-all"
            >
              <Pencil className="w-3.5 h-3.5" /> Editar
            </button>

            <button
              onClick={() => handleCopyLink(selected.slug)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                copied
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-600 dark:text-emerald-400"
                  : "bg-white dark:bg-[#0F0F12] border-[#E4E4E7] dark:border-[#2A2A35] hover:border-[#7C5CBF]"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "¡Copiado!" : "Copiar link"}
            </button>

            <button
              onClick={() => handleWhatsApp(selected)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-emerald-500 hover:text-emerald-600 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </button>

            <button
              onClick={() => handleEmail(selected)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </button>

            <button
              onClick={() => handleDuplicate(selected)}
              disabled={actionLoading === "duplicate"}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-[#7C5CBF] transition-all disabled:opacity-50"
            >
              <CopyPlus className="w-3.5 h-3.5" />
              {actionLoading === "duplicate" ? "Duplicando..." : "Duplicar"}
            </button>

            <button
              onClick={() => handleDelete(selected)}
              disabled={actionLoading === "delete"}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {actionLoading === "delete" ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>

        <PropuestaView propuesta={selected} />
      </div>
    );
  }

  if (screen === "edit" && selected) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button onClick={() => setScreen("view")} className="text-sm text-[#7C5CBF] font-semibold hover:underline mb-6 block">
          ← Cancelar
        </button>
        <PropuestaForm
          propuesta={selected}
          clienteId={selected.cliente_id}
          onSuccess={handleSuccess}
          onCancel={() => setScreen("view")}
        />
      </div>
    );
  }

  if (screen === "create") {
    if (!clienteId) {
      return (
        <div className="p-8 max-w-xl mx-auto mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-[#18181B] dark:text-white">¿Para qué cliente?</h2>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#0F0F12] focus:ring-2 focus:ring-[#7C5CBF] outline-none text-lg"
          >
            <option value="">Seleccioná un cliente...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <button onClick={() => setScreen("list")} className="text-sm text-[#71717A] hover:underline">
            ← Cancelar
          </button>
        </div>
      );
    }
    return (
      <PropuestaWizard
        clienteId={clienteId}
        onSuccess={handleSuccess}
        onCancel={() => { setScreen("list"); setClienteId(""); }}
      />
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#18181B] dark:text-white mb-1">Propuestas</h1>
          <p className="text-[#71717A] dark:text-[#A1A1AA]">Propuestas estratégicas por cliente</p>
        </div>
        <button
          onClick={() => setScreen("create")}
          className="flex items-center gap-2 bg-[#7C5CBF] text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#7C5CBF]/20 hover:bg-[#6B4DAE] transition-all"
        >
          <Plus className="w-4 h-4" /> Nueva
        </button>
      </header>

      {loading && <p className="text-[#A1A1AA] text-sm">Cargando propuestas...</p>}

      {!loading && propuestas.length === 0 && (
        <div className="text-center py-20 text-[#A1A1AA]">
          <p className="text-lg font-medium">No hay propuestas todavía</p>
          <p className="text-sm mt-1">Creá la primera con el botón "Nueva"</p>
        </div>
      )}

      <div className="space-y-4">
        {propuestas.map((p, idx) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => { setSelected(p); setScreen("view"); }}
            className="w-full text-left p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-[#7C5CBF] transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#18181B] dark:text-white">{p.titulo}</h2>
                {p.subtitulo && <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-0.5">{p.subtitulo}</p>}
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                p.estado === 'aprobada' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                p.estado === 'enviada'  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                p.estado === 'vista'    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-[#F4F4F5] text-[#71717A] dark:bg-[#1A1A20] dark:text-[#A1A1AA]'
              }`}>
                {p.estado}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
