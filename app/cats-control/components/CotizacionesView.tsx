"use client";

import { useEffect, useState } from "react";
import { fetchCotizaciones, updateCotizacionStatus, type Cotizacion } from "../../../utils/supabase";
import { generateQuotePDF } from "../../../utils/pdf-generator";
import NuevaCotizacionModal from "./NuevaCotizacionModal";

const clpFormatter = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const estadoBadge: Record<Cotizacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  aprobada: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rechazada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type Filtro = "todas" | Cotizacion["estado"];

export default function CotizacionesView() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetchCotizaciones().then(setCotizaciones).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleEstado(id: string, estado: Cotizacion["estado"]) {
    setUpdating(id);
    try {
      await updateCotizacionStatus(id, estado);
      setCotizaciones((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
    } finally {
      setUpdating(null);
    }
  }

  const handleDownloadPDF = (c: Cotizacion, index: number) => {
    const items = c.items && c.items.length > 0 
      ? c.items 
      : [{ descripcion: `Plan ${c.plan_nombre}`, precio: c.subtotal }];

    generateQuotePDF({
      numero: cotizaciones.length - index, // El número de folio será relativo a la posición
      fecha: c.created_at ? new Date(c.created_at).toLocaleDateString("es-CL") : new Date().toLocaleDateString("es-CL"),
      cliente: {
        nombre: c.cliente_nombre,
        email: c.cliente_email,
        telefono: c.cliente_telefono || "",
        empresa: c.cliente_razon_social || "",
        rut: c.cliente_rut || ""
      },
      items: items.map(item => ({
        descripcion: item.descripcion,
        precio: item.precio
      })),
      subtotal: c.subtotal,
      iva: c.impuesto,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Cotizaciones</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">{cotizaciones.length} en total</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#7C5CBF] hover:bg-[#6D4EB0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-[#7C5CBF]/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Cotización
          </button>
          <div className="flex gap-1 p-1 bg-[#F4F4F5] dark:bg-[#27272A] rounded-xl">
            {filtros.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg transition-all ${
                  filtro === f.key
                    ? "bg-white dark:bg-[#18181B] text-[#7C5CBF] shadow-sm"
                    : "text-[#A1A1AA] hover:text-[#52525B] dark:hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4E4E7] dark:border-[#2A2A35]">
                <th className="text-left text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Fecha</th>
                <th className="text-left text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Cliente</th>
                <th className="text-left text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3 hidden md:table-cell">Plan</th>
                <th className="text-right text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Total</th>
                <th className="text-center text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Estado</th>
                <th className="text-center text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-[#A1A1AA] py-8 font-medium">No hay cotizaciones registradas</td>
                </tr>
              )}
              {filtradas.map((c, idx) => (
                <tr key={c.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors group">
                  <td className="px-5 py-3 text-[#52525B] dark:text-[#A1A1AA] whitespace-nowrap">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("es-CL") : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#18181B] dark:text-white">{c.cliente_nombre}</p>
                    <p className="text-xs text-[#A1A1AA]">{c.cliente_email}</p>
                  </td>
                  <td className="px-5 py-3 text-[#52525B] dark:text-[#A1A1AA] hidden md:table-cell font-medium">{c.plan_nombre}</td>
                  <td className="px-5 py-3 text-right font-bold text-[#18181B] dark:text-white whitespace-nowrap">
                    {clpFormatter.format(c.total)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${estadoBadge[c.estado]}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        value={c.estado}
                        disabled={updating === c.id}
                        onChange={(e) => handleEstado(c.id, e.target.value as Cotizacion["estado"])}
                        className="text-xs border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white rounded-lg px-2 py-1 disabled:opacity-50 cursor-pointer outline-none focus:ring-1 focus:ring-[#7C5CBF]"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                      <button
                        onClick={() => handleDownloadPDF(c, idx)}
                        title="Descargar PDF"
                        className="p-1.5 text-[#A1A1AA] hover:text-[#7C5CBF] hover:bg-[#7C5CBF]/10 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>
                      {c.cliente_telefono && (
                        <a
                          href={`https://wa.me/${c.cliente_telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hola ${c.cliente_nombre}, te escribo de 4cats Studio por tu cotización del plan ${c.plan_nombre}. ¡Quedo atento a tus dudas!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Enviar WhatsApp"
                          className="p-1.5 text-[#A1A1AA] hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </a>
                      )}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${c.cliente_email}&su=${encodeURIComponent(
                          `Cotización 4cats Studio - ${c.plan_nombre}`
                        )}&body=${encodeURIComponent(
                          `Hola ${c.cliente_nombre},\n\nEspero que estés muy bien. Te adjunto la cotización conversada por el plan ${c.plan_nombre}.\n\nQuedamos atentos a cualquier duda.\n\nSaludos,\nEquipo 4cats Studio`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Enviar Email (Gmail)"
                        className="p-1.5 text-[#A1A1AA] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </a>
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
