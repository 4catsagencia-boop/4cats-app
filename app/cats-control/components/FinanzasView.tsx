"use client";

import { useEffect, useState } from "react";
import {
  fetchCotizaciones, fetchPagos, insertPago, deletePago, fetchMeta, upsertMeta,
  type Cotizacion, type Pago
} from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

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

export default function FinanzasView() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [anio, setAnio] = useState(now.getFullYear());

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [metaMonto, setMetaMonto] = useState(0);
  const [loading, setLoading] = useState(true);

  const [modalMeta, setModalMeta] = useState(false);
  const [modalPago, setModalPago] = useState(false);
  const [metaInput, setMetaInput] = useState("");
  const [pagoForm, setPagoForm] = useState({ cotizacion_id: "", monto: "", fecha: now.toISOString().slice(0, 10), descripcion: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCotizaciones(), fetchPagos(), fetchMeta(mes, anio)])
      .then(([cots, pgs, meta]) => {
        setCotizaciones(cots);
        setPagos(pgs);
        setMetaMonto(meta?.monto ?? 0);
      })
      .finally(() => setLoading(false));
  }, [mes, anio]);

  const cotizacionesMes = cotizaciones.filter((c) => {
    if (!c.created_at) return false;
    const d = new Date(c.created_at);
    return d.getMonth() + 1 === mes && d.getFullYear() === anio;
  });

  const pagosMes = pagos.filter((p) => {
    const d = new Date(p.fecha);
    return d.getMonth() + 1 === mes && d.getFullYear() === anio;
  });

  const ingresosCotizaciones = cotizacionesMes.filter(c => c.estado === "aprobada").reduce((a, c) => a + c.total, 0);
  const totalPagos = pagosMes.reduce((a, p) => a + p.monto, 0);
  const pct = metaMonto > 0 ? Math.min((ingresosCotizaciones / metaMonto) * 100, 100) : 0;
  const barColor = pct >= 100 ? "#16a34a" : pct >= 60 ? "#ca8a04" : "#7C5CBF";

  async function saveMeta() {
    const monto = parseFloat(metaInput.replace(/\./g, "").replace(",", "."));
    if (!monto || monto <= 0) return;
    setSaving(true);
    try {
      await upsertMeta(mes, anio, monto);
      setMetaMonto(monto);
      setModalMeta(false);
    } finally {
      setSaving(false);
    }
  }

  async function savePago() {
    const monto = parseFloat(pagoForm.monto.replace(/\./g, "").replace(",", "."));
    if (!pagoForm.cotizacion_id || !monto || !pagoForm.fecha) return;
    setSaving(true);
    try {
      const [nuevo] = await insertPago({ ...pagoForm, monto });
      setPagos((prev) => [nuevo, ...prev]);
      setModalPago(false);
      setPagoForm({ cotizacion_id: "", monto: "", fecha: now.toISOString().slice(0, 10), descripcion: "" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePago(id: string) {
    await deletePago(id);
    setPagos((prev) => prev.filter((p) => p.id !== id));
  }

  const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

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
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Finanzas</h1>
            <p className="text-sm text-[#A1A1AA] mt-0.5">Control de ingresos y metas</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="text-sm border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
            >
              {mesesNombres.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="text-sm border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] text-[#18181B] dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
            >
              {[anio - 1, anio, anio + 1].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#7C5CBF] rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#E5D8FF] uppercase tracking-wider mb-2">Ingresos del mes</p>
            <p className="text-2xl font-bold text-white">{clp.format(ingresosCotizaciones)}</p>
            <p className="text-xs text-[#E5D8FF] mt-1">{cotizacionesMes.filter(c => c.estado === "aprobada").length} cotizaciones aprobadas</p>
          </div>
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Pagos recibidos</p>
            <p className="text-2xl font-bold text-[#18181B] dark:text-white">{clp.format(totalPagos)}</p>
            <p className="text-xs text-[#A1A1AA] mt-1">{pagosMes.length} abonos registrados</p>
          </div>
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Meta mensual</p>
              <p className="text-2xl font-bold text-[#18181B] dark:text-white">{metaMonto > 0 ? clp.format(metaMonto) : "—"}</p>
            </div>
            <button onClick={() => { setMetaInput(metaMonto > 0 ? String(metaMonto) : ""); setModalMeta(true); }} className="mt-3 text-xs font-semibold text-[#7C5CBF] hover:underline text-left">
              {metaMonto > 0 ? "Cambiar meta" : "Definir meta →"}
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        {metaMonto > 0 && (
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-5">
            <div className="flex justify-between mb-3">
              <p className="text-sm font-semibold text-[#18181B] dark:text-white">Progreso hacia la meta</p>
              <p className="text-sm font-bold text-[#18181B] dark:text-white">{Math.round(pct)}%</p>
            </div>
            <div className="w-full h-3 bg-[#F4F4F5] dark:bg-[#27272A] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
            </div>
            <p className="text-xs text-[#A1A1AA] mt-2">Faltan {clp.format(Math.max(0, metaMonto - ingresosCotizaciones))} para la meta</p>
          </div>
        )}

        {/* Pagos registrados */}
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E4E4E7] dark:border-[#2A2A35] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#18181B] dark:text-white">Pagos / Abonos</h2>
            <button
              onClick={() => setModalPago(true)}
              className="text-xs font-semibold bg-[#7C5CBF] text-white px-3 py-1.5 rounded-lg hover:bg-[#6B4DAE] transition-all"
            >
              + Registrar pago
            </button>
          </div>
          <div className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
            {pagosMes.length === 0 && (
              <p className="text-sm text-[#A1A1AA] px-5 py-4">Sin pagos registrados este mes.</p>
            )}
            {pagosMes.map((p) => {
              const cot = cotizaciones.find((c) => c.id === p.cotizacion_id);
              return (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#18181B] dark:text-white truncate">
                      {cot ? cot.cliente_nombre : "Cliente desvinculado"}
                    </p>
                    <p className="text-xs text-[#A1A1AA]">
                      {new Date(p.fecha).toLocaleDateString("es-CL")}
                      {p.descripcion && ` · ${p.descripcion}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm font-semibold text-[#18181B] dark:text-white">{clp.format(p.monto)}</p>
                    <button onClick={() => handleDeletePago(p.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 text-xs">✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal meta */}
      {modalMeta && (
        <Modal title="Definir meta mensual" onClose={() => setModalMeta(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">Monto en CLP</label>
              <input
                type="number"
                value={metaInput}
                onChange={(e) => setMetaInput(e.target.value)}
                placeholder="1000000"
                className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModalMeta(false)} className="flex-1 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all">
                Cancelar
              </button>
              <button onClick={saveMeta} disabled={saving || !metaInput} className="flex-1 py-2.5 rounded-xl bg-[#7C5CBF] text-white text-sm font-semibold hover:bg-[#6B4DAE] transition-all disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal pago */}
      {modalPago && (
        <Modal title="Registrar pago" onClose={() => setModalPago(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">Cotización *</label>
              <select
                value={pagoForm.cotizacion_id}
                onChange={(e) => setPagoForm((f) => ({ ...f, cotizacion_id: e.target.value }))}
                className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
              >
                <option value="">Seleccionar...</option>
                {cotizaciones.filter(c => c.estado === "aprobada").map((c) => (
                  <option key={c.id} value={c.id}>{c.cliente_nombre} — {c.plan_nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">Monto CLP *</label>
              <input
                type="number"
                value={pagoForm.monto}
                onChange={(e) => setPagoForm((f) => ({ ...f, monto: e.target.value }))}
                placeholder="0"
                className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">Fecha *</label>
              <input
                type="date"
                value={pagoForm.fecha}
                onChange={(e) => setPagoForm((f) => ({ ...f, fecha: e.target.value }))}
                className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">Descripción (opcional)</label>
              <input
                type="text"
                value={pagoForm.descripcion}
                onChange={(e) => setPagoForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Ej: 50% anticipo"
                className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModalPago(false)} className="flex-1 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all">
                Cancelar
              </button>
              <button onClick={savePago} disabled={saving || !pagoForm.cotizacion_id || !pagoForm.monto} className="flex-1 py-2.5 rounded-xl bg-[#7C5CBF] text-white text-sm font-semibold hover:bg-[#6B4DAE] transition-all disabled:opacity-50">
                {saving ? "Guardando..." : "Registrar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
