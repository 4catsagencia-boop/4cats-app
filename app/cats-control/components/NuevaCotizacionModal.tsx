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
}

export default function NuevaCotizacionModal({ onClose, onSuccess }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const adminDB = useAdminDB();

  // Form state
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");
  const [clienteManual, setClienteManual] = useState({ nombre: "", email: "", telefono: "" });
  const [planSeleccionado, setPlanSeleccionado] = useState<string>("");
  const [moneda, setMoneda] = useState<Moneda>("CLP");
  const [items, setItems] = useState<CotizacionItem[]>([{ descripcion: "", precio: 0 }]);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    // Usamos adminDB para cargar clientes y planes publicados
    // Nota: Aunque los planes publicados son visibles por RLS, 
    // usamos el proxy para mantener consistencia en el panel administrativo.
    Promise.all([
      adminDB.select("clientes"),
      adminDB.select("planes")
    ])
      .then(([c, p]) => {
        setClientes(c || []);
        setPlanes((p || []).filter((plan: Plan) => plan.publicado));
      })
      .finally(() => setLoading(false));
  }, []);

  // Efecto para cargar datos del plan automáticamente
  const handlePlanChange = (planId: string) => {
    setPlanSeleccionado(planId);
    const plan = planes.find(p => p.id === planId);
    if (plan) {
      const newItems = [...items];
      newItems[0] = { descripcion: `Plan ${plan.nombre}`, precio: plan.precio };
      setItems(newItems);
    }
  };

  const addItem = () => setItems([...items, { descripcion: "", precio: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof CotizacionItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + item.precio, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado && !clienteManual.nombre) {
      alert("Debes seleccionar un cliente o ingresar uno nuevo.");
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
        // Si es manual, primero creamos el cliente
        const [nuevoCliente] = await adminDB.insert("clientes", clienteManual);
        cliente_id = nuevoCliente.id;
        cliente_nombre = nuevoCliente.nombre;
      }

      const plan = planes.find(p => p.id === planSeleccionado);

      const cotizacionData = {
        cliente_id,
        cliente_nombre,
        plan_id: planSeleccionado || null,
        plan_nombre: plan?.nombre || "Personalizada",
        total,
        moneda,
        notas,
        estado: "pendiente",
        items
      };

      await adminDB.insert("cotizaciones", cotizacionData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al crear cotización:", err);
      alert("Hubo un error al crear la cotización.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#18181B] dark:text-white">Nueva Cotización</h2>
            <p className="text-sm text-[#A1A1AA] mt-1">Generar presupuesto para cliente</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded-full transition-colors text-[#A1A1AA]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección Cliente */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7C5CBF]">Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Seleccionar Existente</label>
                <select
                  value={clienteSeleccionado}
                  onChange={(e) => { setClienteSeleccionado(e.target.value); if(e.target.value) setClienteManual({nombre:"", email:"", telefono:""}); }}
                  className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-[#F4F4F5] dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                >
                  <option value="">-- Nuevo Cliente --</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>

            {!clienteSeleccionado && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F4F4F5] dark:bg-[#27272A] rounded-2xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={clienteManual.nombre}
                    onChange={(e) => setClienteManual({ ...clienteManual, nombre: e.target.value })}
                    className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Email *</label>
                  <input
                    type="email"
                    required
                    value={clienteManual.email}
                    onChange={(e) => setClienteManual({ ...clienteManual, email: e.target.value })}
                    className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Teléfono</label>
                  <input
                    type="text"
                    value={clienteManual.telefono}
                    onChange={(e) => setClienteManual({ ...clienteManual, telefono: e.target.value })}
                    className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sección Plan y Moneda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Plan Base (Opcional)</label>
              <select
                value={planSeleccionado}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-[#F4F4F5] dark:bg-[#27272A] text-sm text-[#18181B] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
              >
                <option value="">Personalizada / Ninguno</option>
                {planes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Moneda</label>
              <div className="flex gap-2">
                {["CLP", "USD"].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMoneda(m as Moneda)}
                    className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${moneda === m ? 'bg-[#7C5CBF] border-[#7C5CBF] text-white shadow-lg shadow-[#7C5CBF]/20' : 'bg-white dark:bg-[#18181B] border-[#E4E4E7] dark:border-[#2A2A35] text-[#71717A]'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sección Ítems */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#7C5CBF]">Servicios Incluidos</h3>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-[#7C5CBF] hover:text-[#6B4DAE] flex items-center gap-1"
              >
                + Agregar Ítem
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Descripción del servicio"
                      value={item.descripcion}
                      onChange={(e) => updateItem(idx, "descripcion", e.target.value)}
                      required
                      className="w-full border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Precio"
                      value={item.precio}
                      onChange={(e) => updateItem(idx, "precio", Number(e.target.value))}
                      required
                      className="w-full border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF]"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Notas Adicionales</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] text-sm text-[#18181B] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all resize-none"
              placeholder="Ej: Incluye 3 meses de soporte, validez 15 días..."
            />
          </div>

          {/* Footer del Form */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E4E4E7] dark:border-[#2A2A35]">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#A1A1AA]">Total estimado</p>
              <p className="text-2xl font-black text-[#7C5CBF]">
                {moneda === "CLP" ? `$${total.toLocaleString("es-CL")}` : `USD ${total.toLocaleString("en-US")}`}
              </p>
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
                {saving ? "Generando..." : "Crear Cotización"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
