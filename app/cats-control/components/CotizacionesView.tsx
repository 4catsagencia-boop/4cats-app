"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { type Cotizacion } from "../../../utils/supabase";
import { generateQuotePDF } from "../../../utils/pdf-generator";
import NuevaCotizacionModal from "./NuevaCotizacionModal";

const clpFormatter = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const estadoBadge: Record<Cotizacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  aprobada: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rechazada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type Filtro = "todas" | Cotizacion["estado"];

export default function CotizacionesView() {
  const adminDB = useAdminDB();
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // El proxy ya las ordena por created_at desc
      const data = await adminDB.select("cotizaciones");
      setCotizaciones(data || []);
    } catch (err) {
      console.error("Error cargando cotizaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleEstado(id: string, estado: Cotizacion["estado"]) {
    setUpdating(id);
    try {
      await adminDB.update("cotizaciones", id, { estado });
      setCotizaciones((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    } finally {
      setUpdating(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que querés eliminar esta cotización? No hay vuelta atrás, loco.")) return;
    setUpdating(id);
    try {
      await adminDB.remove("cotizaciones", id);
      setCotizaciones((prev) => prev.filter(c => c.id !== id));
      alert("Cotización eliminada 🗑️");
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setUpdating(null);
    }
  }

  const handleDownloadPDF = (c: Cotizacion, index: number) => {
    const items = c.items && c.items.length > 0 
      ? c.items 
      : [{ descripcion: `Plan ${c.plan_nombre}`, precio: c.total }];

    generateQuotePDF({
      numero: cotizaciones.length - index,
      fecha: c.created_at ? new Date(c.created_at).toLocaleDateString("es-CL") : new Date().toLocaleDateString("es-CL"),
      cliente: {
        nombre: c.cliente_nombre,
        email: c.cliente_email,
        telefono: c.cliente_id || "", // Usamos el ID como fallback si no hay teléfono directo
        empresa: "",
        rut: ""
      },
      items: items.map(item => ({
        descripcion: item.descripcion,
        precio: item.precio
      })),
      subtotal: c.total, // Simplificado
      iva: 0,
      total: c.total,
      notas: c.notas
    });
  };

  const filtradas = filtro === "todas" ? cotizaciones : cotizaciones.filter((c) => c.estado === filtro);

  const filtros: { key: Filtro; label: string }[] = [
    { key: "todas", label: "Todas" },
    { key: "pendiente", label: "Pendientes" },
    { key: "aprobada", label: "Aprobadas" },
    { key: "rechazada", label: "Rechazadas" },
  ];

  if (loading && cotizaciones.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Gestión de Cotizaciones</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">{filtradas.length} resultados filtrados</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#7C5CBF] text-white text-xs font-bold px-5 py-2.5 rounded-2xl hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M12 4v16m8-8H4" /></svg>
            Nueva
          </button>
          <div className="flex gap-1 p-1 bg-[#F4F4F5] dark:bg-[#1A1A20] rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35]">
            {filtros.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg transition-all ${
                  filtro === f.key
                    ? "bg-white dark:bg-[#2A2A35] text-[#7C5CBF] shadow-sm"
                    : "text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#1C1C1E] border-b border-[#E4E4E7] dark:border-[#2A2A35]">
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Fecha</th>
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Cliente / Plan</th>
                <th className="text-right text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Monto Total</th>
                <th className="text-center text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Estado</th>
                <th className="text-center text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-[#A1A1AA] py-12 text-xs italic">No hay cotizaciones con este filtro.</td>
                </tr>
              )}
              {filtradas.map((c, idx) => (
                <tr key={c.id} className={`hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors group ${updating === c.id ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 text-[#A1A1AA] text-xs font-mono">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("es-CL") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#18181B] dark:text-white text-xs">{c.cliente_nombre}</p>
                    <p className="text-[10px] text-[#7C5CBF] font-medium uppercase tracking-tighter">{c.plan_nombre}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-[#18181B] dark:text-white text-sm">
                    {clpFormatter.format(c.total)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${estadoBadge[c.estado]}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <select
                        value={c.estado}
                        disabled={updating === c.id}
                        onChange={(e) => handleEstado(c.id, e.target.value as Cotizacion["estado"])}
                        className="text-[10px] font-bold border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#0F0F12] text-[#18181B] dark:text-white rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#7C5CBF] transition-all"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                      
                      <button
                        onClick={() => handleDownloadPDF(c, idx)}
                        className="p-1.5 text-[#A1A1AA] hover:text-[#7C5CBF] transition-colors"
                        title="Exportar PDF"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-[#A1A1AA] hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <NuevaCotizacionModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
