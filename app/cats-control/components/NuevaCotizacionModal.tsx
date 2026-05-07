"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import {
  type Cliente,
  type Plan,
  type Cotizacion,
  type CotizacionItem,
  type Moneda
} from "../../../utils/supabase";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Cotizacion;
}

const clp = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

const MODULO_LABELS: Record<string, { label: string; color: string }> = {
  sistema: { label: "Sistema", color: "bg-[#7C5CBF]/10 text-[#7C5CBF]" },
  web:     { label: "Web",     color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  mantencion: { label: "Mantención", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

const emptyItem = (): CotizacionItem => ({
  descripcion: "", detalle: "", costo_desarrollo: 0,
  margen_porcentaje: 50, pvp: 0, precio: 0, modulo: "sistema"
});

const PLANTILLAS: Record<string, { nombre: string; items: CotizacionItem[] }> = {
  web: {
    nombre: "Solo Landing Page",
    items: [
      { descripcion: "Fase 1: Arquitectura Frontend e Interfaz UI/UX", detalle: "Diseño orientado a conversión móvil.", costo_desarrollo: 150000, margen_porcentaje: 50, pvp: 225000, precio: 225000, modulo: "web" },
      { descripcion: "Fase 2: Ingeniería de Rendimiento (SSR)", detalle: "Configuración SSG y compresión AVIF/WebP.", costo_desarrollo: 250000, margen_porcentaje: 50, pvp: 375000, precio: 375000, modulo: "web" },
      { descripcion: "Fase 3: Optimización Estructural SEO", detalle: "Microdatos JSON-LD y protocolos OpenGraph.", costo_desarrollo: 250000, margen_porcentaje: 50, pvp: 375000, precio: 375000, modulo: "web" },
    ]
  },
  ecosistema: {
    nombre: "Ecosistema Completo (Sistema + Web Bonificada)",
    items: [
      { descripcion: "Fase 1: Fundación y Arquitectura", detalle: "Arquitectura de proyecto, modelamiento de BD, conexión persistente, lógica de autenticación y vistas iniciales (Login/Home).", costo_desarrollo: 2000000, margen_porcentaje: 50, pvp: 3000000, precio: 3000000, modulo: "sistema" },
      { descripcion: "Fase 2: Administración de Recursos y Activos", detalle: "Módulos maestros para gestión de Usuarios/Roles, Grúas/Patentes y Panel de Mantenimiento con monitoreo de estados.", costo_desarrollo: 2000000, margen_porcentaje: 50, pvp: 3000000, precio: 3000000, modulo: "sistema" },
      { descripcion: "Fase 3: Core Operacional y Logística", detalle: "Módulos de Solicitudes, Agendamiento programado, Logística de trazabilidad y lógica de validación de disponibilidad de flota.", costo_desarrollo: 3000000, margen_porcentaje: 50, pvp: 4500000, precio: 4500000, modulo: "sistema" },
      { descripcion: "Fase 4: Ejecución App Móvil y Tracking", detalle: "App del Conductor (Servicios/Evidencia), Tracking en tiempo real por GPS, Vista de Cliente Externo y Notificaciones Push.", costo_desarrollo: 3000000, margen_porcentaje: 50, pvp: 4500000, precio: 4500000, modulo: "sistema" },
      { descripcion: "Fase 5: Administración Final y Cierre", detalle: "Dashboard de KPIs gerenciales, Registro Histórico avanzado, Módulo de Aseguradoras e integración automática de WhatsApp/Email.", costo_desarrollo: 1500000, margen_porcentaje: 20, pvp: 1800000, precio: 1800000, modulo: "sistema" },
      { descripcion: "Módulo I: Plataforma Web de alto rendimiento", detalle: "Landing Page (100/100 PageSpeed). Incluida como beneficio por contratación del ecosistema completo.", costo_desarrollo: 650000, margen_porcentaje: -100, pvp: 0, precio: 0, modulo: "web" },
    ]
  },
  mantencion: {
    nombre: "Mantención Mensual",
    items: [
      { descripcion: "Operación Sistema de Administración (mensual)", detalle: "Soporte y operación mensual del sistema logístico. Incluye actualizaciones y monitoreo.", costo_desarrollo: 120000, margen_porcentaje: 50, pvp: 180000, precio: 180000, modulo: "mantencion" },
      { descripcion: "Operación Web Landing Page (mensual)", detalle: "Soporte y operación mensual de la plataforma web. Actualizaciones de contenido incluidas.", costo_desarrollo: 25000, margen_porcentaje: 50, pvp: 37500, precio: 37500, modulo: "mantencion" },
    ]
  }
};

export default function NuevaCotizacionModal({ onClose, onSuccess, initialData }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const adminDB = useAdminDB();

  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");
  const [clienteManual, setClienteManual] = useState({ nombre: "", email: "", telefono: "" });
  const [planSeleccionado, setPlanSeleccionado] = useState<string>("");
  const [moneda, setMoneda] = useState<Moneda>("CLP");
  const [items, setItems] = useState<CotizacionItem[]>([emptyItem()]);
  const [notas, setNotas] = useState("");
  const [plantilla, setPlantilla] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([adminDB.select("clientes"), adminDB.select("planes")])
      .then(([c, p]) => {
        setClientes(c || []);
        setPlanes((p || []).filter((pl: Plan) => pl.publicado));

        if (initialData) {
          setClienteSeleccionado(initialData.cliente_id);
          setPlanSeleccionado(initialData.plan_id || "");
          setMoneda(initialData.moneda || "CLP");
          setNotas(initialData.notas || "");
          if (initialData.items && initialData.items.length > 0) {
            const parsed = typeof initialData.items === "string" ? JSON.parse(initialData.items) : initialData.items;
            setItems(parsed);
            setExpandedItems(new Set(parsed.map((_: unknown, i: number) => i)));
          }
        }
      })
      .finally(() => setLoading(false));
  }, [initialData]);

  const applyPlantilla = (key: string) => {
    setPlantilla(key);
    if (!key || !PLANTILLAS[key]) return;
    const newItems = PLANTILLAS[key].items.map(item => ({ ...item }));
    setItems(newItems);
    setExpandedItems(new Set(newItems.map((_, i) => i)));
  };

  const handlePlanChange = (planId: string) => {
    setPlanSeleccionado(planId);
    const plan = planes.find(p => p.id === planId);
    if (plan && !initialData) {
      setItems([{ descripcion: `Plan ${plan.nombre}`, precio: plan.precio, pvp: plan.precio, costo_desarrollo: 0, margen_porcentaje: 0, modulo: "sistema" }]);
    }
  };

  const calcPvp = (costo: number, margen: number) => Math.round(costo * (1 + margen / 100));

  const updateItem = (index: number, field: keyof CotizacionItem, value: unknown) => {
    const newItems = [...items];
    const updated = { ...newItems[index], [field]: value };

    if (field === "costo_desarrollo" || field === "margen_porcentaje") {
      const costo = field === "costo_desarrollo" ? Number(value) : Number(updated.costo_desarrollo ?? 0);
      const margen = field === "margen_porcentaje" ? Number(value) : Number(updated.margen_porcentaje ?? 0);
      const pvp = calcPvp(costo, margen);
      updated.pvp = pvp;
      updated.precio = pvp;
    }

    newItems[index] = updated;
    setItems(newItems);
  };

  const addItem = () => {
    const idx = items.length;
    setItems([...items, emptyItem()]);
    setExpandedItems(prev => new Set([...prev, idx]));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setExpandedItems(prev => {
      const next = new Set<number>();
      prev.forEach(i => { if (i < index) next.add(i); else if (i > index) next.add(i - 1); });
      return next;
    });
  };

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  // Totales
  const totalPvp = items.reduce((acc, item) => acc + (item.pvp ?? item.precio ?? 0), 0);
  const totalCosto = items.reduce((acc, item) => acc + (item.costo_desarrollo ?? 0), 0);

  const moduloGroups = ["sistema", "web", "mantencion"] as const;
  const subtotalPorModulo = moduloGroups.reduce<Record<string, number>>((acc, mod) => {
    acc[mod] = items.filter(i => i.modulo === mod).reduce((s, i) => s + (i.pvp ?? i.precio ?? 0), 0);
    return acc;
  }, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado && !clienteManual.nombre) {
      alert("Seleccioná un cliente o ingresá uno nuevo.");
      return;
    }
    setSaving(true);
    try {
      let cliente_id = clienteSeleccionado;
      let cliente_nombre = "";

      if (cliente_id) {
        const c = clientes.find(cl => cl.id === cliente_id);
        cliente_nombre = c?.nombre || "";
      } else {
        const [nuevoCliente] = await adminDB.insert("clientes", clienteManual);
        cliente_id = nuevoCliente.id;
        cliente_nombre = nuevoCliente.nombre;
      }

      const plan = planes.find(p => p.id === planSeleccionado);

      const cotizacionData = {
        cliente_id,
        cliente_nombre,
        plan_id: planSeleccionado || null,
        plan_nombre: plan?.nombre || (initialData?.plan_nombre || "Personalizada"),
        total: totalPvp,
        moneda,
        notas,
        items
      };

      if (initialData) {
        await adminDB.update("cotizaciones", initialData.id, cotizacionData);
      } else {
        await adminDB.insert("cotizaciones", { ...cotizacionData, estado: "pendiente" });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al guardar cotización:", err);
      alert("Hubo un error al guardar la cotización.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#18181B] dark:text-white">
              {initialData ? "Editar Cotización" : "Nueva Cotización"}
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-1">
              {initialData ? "Modificar presupuesto existente" : "Generar presupuesto para cliente"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded-full transition-colors text-[#A1A1AA]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Plantilla */}
          {!initialData && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Plantilla Base</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { key: "", label: "Personalizada", desc: "Desde cero" },
                  { key: "web", label: "Solo Web", desc: "Landing Page" },
                  { key: "ecosistema", label: "Ecosistema", desc: "Sistema + Web" },
                  { key: "mantencion", label: "Mantención", desc: "Mensual" }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => applyPlantilla(opt.key)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      plantilla === opt.key
                        ? "border-[#7C5CBF] bg-[#F3EEFF] dark:bg-[#1C1630]"
                        : "border-[#E4E4E7] dark:border-[#2A2A35] hover:border-[#7C5CBF]/50"
                    }`}
                  >
                    <p className={`text-xs font-bold ${plantilla === opt.key ? "text-[#7C5CBF]" : "text-[#18181B] dark:text-white"}`}>{opt.label}</p>
                    <p className="text-[10px] text-[#A1A1AA]">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cliente */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7C5CBF]">Cliente</h3>
            <select
              value={clienteSeleccionado}
              onChange={(e) => { setClienteSeleccionado(e.target.value); if (e.target.value) setClienteManual({ nombre: "", email: "", telefono: "" }); }}
              className="w-full border border-[#E4E4E7] dark:border-[#2A2A35] bg-[#F4F4F5] dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
            >
              <option value="">-- Nuevo Cliente --</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {!clienteSeleccionado && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F4F4F5] dark:bg-[#27272A] rounded-2xl">
                {[
                  { label: "Nombre *", key: "nombre", type: "text", required: true },
                  { label: "Email *", key: "email", type: "email", required: true },
                  { label: "Teléfono", key: "telefono", type: "text", required: false },
                ].map(f => (
                  <div key={f.key} className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">{f.label}</label>
                    <input
                      type={f.type}
                      required={f.required}
                      value={clienteManual[f.key as keyof typeof clienteManual]}
                      onChange={(e) => setClienteManual({ ...clienteManual, [f.key]: e.target.value })}
                      className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Plan y Moneda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Plan Base (Opcional)</label>
              <select
                value={planSeleccionado}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-[#F4F4F5] dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C5CBF]"
              >
                <option value="">Personalizada / Ninguno</option>
                {planes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Moneda</label>
              <div className="flex gap-2">
                {(["CLP", "USD"] as Moneda[]).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMoneda(m)}
                    className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${moneda === m ? "bg-[#7C5CBF] border-[#7C5CBF] text-white shadow-lg shadow-[#7C5CBF]/20" : "bg-white dark:bg-[#18181B] border-[#E4E4E7] dark:border-[#2A2A35] text-[#71717A]"}`}
                  >{m}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Ítems */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#7C5CBF]">Servicios Incluidos</h3>
              <button type="button" onClick={addItem} className="text-xs font-bold text-[#7C5CBF] hover:text-[#6B4DAE] flex items-center gap-1">
                + Agregar Ítem
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const isExpanded = expandedItems.has(idx);
                const modInfo = MODULO_LABELS[item.modulo || "sistema"];
                return (
                  <div key={idx} className="border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl overflow-hidden">
                    {/* Cabecera del ítem */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#FAFAFA] dark:bg-[#0F0F12]">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 ${modInfo.color}`}>
                        {modInfo.label}
                      </span>
                      <input
                        type="text"
                        placeholder="Descripción (va al PDF)"
                        value={item.descripcion}
                        onChange={(e) => updateItem(idx, "descripcion", e.target.value)}
                        required
                        className="flex-1 bg-transparent text-sm text-[#18181B] dark:text-white outline-none placeholder:text-[#A1A1AA]"
                      />
                      <span className="text-sm font-black text-green-600 dark:text-green-400 shrink-0">
                        {clp(item.pvp ?? item.precio ?? 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleExpand(idx)}
                        className="p-1 rounded-lg hover:bg-[#E4E4E7] dark:hover:bg-[#2A2A35] transition-colors shrink-0"
                        title="Detalle interno"
                      >
                        <svg className={`w-3.5 h-3.5 text-[#A1A1AA] transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0">
                          <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Detalle interno (colapsable) */}
                    {isExpanded && (
                      <div className="px-4 py-4 space-y-3 border-t border-[#E4E4E7] dark:border-[#2A2A35]">
                        {/* Módulo selector */}
                        <div className="flex gap-2">
                          {(["sistema", "web", "mantencion"] as const).map(mod => (
                            <button
                              key={mod}
                              type="button"
                              onClick={() => updateItem(idx, "modulo", mod)}
                              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                                item.modulo === mod
                                  ? MODULO_LABELS[mod].color + " border-transparent"
                                  : "border-[#E4E4E7] dark:border-[#2A2A35] text-[#A1A1AA] hover:border-[#7C5CBF]/50"
                              }`}
                            >
                              {MODULO_LABELS[mod].label}
                            </button>
                          ))}
                        </div>

                        {/* Detalle */}
                        <textarea
                          placeholder="Detalle interno (descripción técnica, alcance, notas...)"
                          value={item.detalle || ""}
                          onChange={(e) => updateItem(idx, "detalle", e.target.value)}
                          rows={2}
                          className="w-full bg-[#F4F4F5] dark:bg-[#27272A] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-xs text-[#18181B] dark:text-white outline-none focus:ring-2 focus:ring-[#7C5CBF] resize-none"
                        />

                        {/* Costo / Margen / PVP */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-widest font-bold text-[#A1A1AA]">Costo Dev (CLP)</label>
                            <input
                              type="number"
                              value={item.costo_desarrollo ?? 0}
                              onChange={(e) => updateItem(idx, "costo_desarrollo", Number(e.target.value))}
                              className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-widest font-bold text-[#A1A1AA]">Margen %</label>
                            <input
                              type="number"
                              value={item.margen_porcentaje ?? 50}
                              onChange={(e) => updateItem(idx, "margen_porcentaje", Number(e.target.value))}
                              className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-widest font-bold text-green-600 dark:text-green-400">PVP (calculado)</label>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2 text-sm font-black text-green-700 dark:text-green-400">
                              {clp(item.pvp ?? item.precio ?? 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Subtotales por módulo */}
            {items.some(i => i.modulo) && (
              <div className="mt-4 p-4 bg-[#FAFAFA] dark:bg-[#0F0F12] rounded-2xl space-y-2 border border-[#E4E4E7] dark:border-[#2A2A35]">
                <p className="text-[9px] uppercase tracking-widest font-bold text-[#A1A1AA] mb-3">Desglose Interno por Módulo</p>
                {moduloGroups.map(mod => {
                  const total = subtotalPorModulo[mod];
                  const costoMod = items.filter(i => i.modulo === mod).reduce((s, i) => s + (i.costo_desarrollo ?? 0), 0);
                  if (!items.some(i => i.modulo === mod)) return null;
                  return (
                    <div key={mod} className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${MODULO_LABELS[mod].color}`}>{MODULO_LABELS[mod].label}</span>
                      <div className="flex gap-6 text-xs">
                        <span className="text-[#A1A1AA]">Costo: <span className="font-bold text-[#18181B] dark:text-white">{clp(costoMod)}</span></span>
                        <span className="text-[#A1A1AA]">PVP: <span className="font-bold text-green-600 dark:text-green-400">{clp(total)}</span></span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-[#E4E4E7] dark:border-[#2A2A35] pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-[#A1A1AA]">Total Costo Agencia</span>
                  <span className="text-sm font-black text-[#18181B] dark:text-white">{clp(totalCosto)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Notas Adicionales</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] text-sm text-[#18181B] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C5CBF] resize-none"
              placeholder="Ej: Incluye 3 meses de soporte, validez 15 días, entrega en 8 semanas..."
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E4E4E7] dark:border-[#2A2A35]">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Total PVP Cliente</p>
              <p className="text-2xl font-black text-[#7C5CBF]">
                {moneda === "CLP" ? clp(totalPvp) : `USD ${totalPvp.toLocaleString("en-US")}`}
              </p>
              <p className="text-[10px] text-[#A1A1AA]">Costo agencia: {clp(totalCosto)}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-sm text-[#71717A] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#7C5CBF] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#6B4DAE] transition-all active:scale-[0.98] shadow-lg shadow-[#7C5CBF]/20 disabled:opacity-50"
              >
                {saving ? "Guardando..." : initialData ? "Actualizar" : "Crear Cotización"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
