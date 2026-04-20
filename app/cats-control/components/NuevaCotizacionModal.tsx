"use client";

import { useEffect, useState } from "react";
import { 
  fetchClientes, 
  fetchPlanesPublicados, 
  insertCotizacion, 
  type Cliente, 
  type Plan, 
  type Cotizacion,
  type CotizacionItem,
  type Moneda
} from "../../../utils/supabase";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NuevaCotizacionModal({ onClose, onSuccess }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");
  const [clienteManual, setClienteManual] = useState({ nombre: "", email: "", telefono: "" });
  const [planSeleccionado, setPlanSeleccionado] = useState<string>("");
  const [moneda, setMoneda] = useState<Moneda>("CLP");
  const [items, setItems] = useState<CotizacionItem[]>([{ descripcion: "", precio: 0 }]);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    Promise.all([fetchClientes(), fetchPlanesPublicados()])
      .then(([c, p]) => {
        setClientes(c);
        setPlanes(p);
      })
      .finally(() => setLoading(false));
  }, []);

  // Efecto para cargar datos del plan automáticamente
  const handlePlanChange = (planId: string) => {
    setPlanSeleccionado(planId);
    const plan = planes.find(p => p.id === planId);
    if (plan) {
      // Si el primer ítem está vacío o es de un plan anterior, lo reemplazamos
      const newItems = [...items];
      newItems[0] = { descripcion: `Plan ${plan.nombre}`, precio: plan.precio };
      setItems(newItems);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { descripcion: "", precio: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof CotizacionItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
  const impuesto = subtotal * 0.19; // IVA 19%
  const total = subtotal + impuesto;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let cNombre = clienteManual.nombre;
      let cEmail = clienteManual.email;
      let cTel = clienteManual.telefono;
      let cRut = "";
      let cRazonSocial = "";
      let cId = undefined;

      if (clienteSeleccionado) {
        const client = clientes.find(c => c.id === clienteSeleccionado);
        if (client) {
          cNombre = client.nombre;
          cEmail = client.email;
          cTel = client.telefono || "";
          cRut = client.rut || "";
          cRazonSocial = client.razon_social || "";
          cId = client.id;
        }
      }

      const plan = planes.find(p => p.id === planSeleccionado);

      const cotizacionData: Partial<Cotizacion> = {
        cliente_id: cId,
        cliente_nombre: cNombre,
        cliente_email: cEmail,
        cliente_telefono: cTel,
        cliente_rut: cRut,
        cliente_razon_social: cRazonSocial,
        plan_nombre: plan?.nombre || "Personalizado",
        items,
        subtotal,
        impuesto,
        total,
        estado: "pendiente",
        moneda,
        notas,
      };

      await insertCotizacion(cotizacionData);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Error al crear cotización:", error);
      const msg = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al crear la cotización: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#18181B] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E4E4E7] dark:border-[#2A2A35] shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#18181B] dark:text-white">Nueva Cotización</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA]">Cliente</label>
              <select
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                className="w-full bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-3 text-[#18181B] dark:text-white focus:ring-2 focus:ring-[#7C5CBF] transition-all"
              >
                <option value="">-- Nuevo Cliente / Manual --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>
                ))}
              </select>

              {!clienteSeleccionado && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    required
                    value={clienteManual.nombre}
                    onChange={(e) => setClienteManual({ ...clienteManual, nombre: e.target.value })}
                    className="bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-3 text-[#18181B] dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={clienteManual.email}
                    onChange={(e) => setClienteManual({ ...clienteManual, email: e.target.value })}
                    className="bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-3 text-[#18181B] dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Plan, Moneda y Notas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA]">Plan Sugerido</label>
                <select
                  value={planSeleccionado}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-3 text-[#18181B] dark:text-white"
                >
                  <option value="">Personalizado</option>
                  {planes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA]">Moneda</label>
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value as Moneda)}
                  className="w-full bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-3 text-[#18181B] dark:text-white"
                >
                  <option value="CLP">Pesos (CLP)</option>
                  <option value="BRL">Reales (BRL)</option>
                  <option value="USD">Dólares (USD)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA]">Notas</label>
                <input
                  type="text"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-3 text-[#18181B] dark:text-white"
                />
              </div>
            </div>

            {/* Ítems */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA]">Detalle de Cobro</label>
                <button type="button" onClick={handleAddItem} className="text-[#7C5CBF] text-xs font-bold hover:underline">+ Agregar Ítem</button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Descripción"
                    required
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, "descripcion", e.target.value)}
                    className="flex-1 bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-2 text-sm text-[#18181B] dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    required
                    value={item.precio}
                    onChange={(e) => handleItemChange(index, "precio", e.target.value)}
                    className="w-24 bg-[#F4F4F5] dark:bg-[#27272A] border-none rounded-xl px-4 py-2 text-sm text-[#18181B] dark:text-white"
                  />
                  {items.length > 1 && (
                    <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="bg-[#F4F4F5] dark:bg-[#27272A] p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#52525B] dark:text-[#A1A1AA]">Subtotal</span>
                <span className="font-semibold text-[#18181B] dark:text-white">{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#52525B] dark:text-[#A1A1AA]">IVA (19%)</span>
                <span className="font-semibold text-[#18181B] dark:text-white">{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(impuesto)}</span>
              </div>
              <div className="flex justify-between text-base border-t border-[#E4E4E7] dark:border-[#3F3F46] pt-2">
                <span className="font-bold text-[#18181B] dark:text-white">Total</span>
                <span className="font-bold text-[#7C5CBF]">{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#7C5CBF] hover:bg-[#6D4EB0] text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Creando..." : "Crear Cotización"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
