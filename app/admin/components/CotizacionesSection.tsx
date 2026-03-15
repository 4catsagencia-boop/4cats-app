"use client";

import { useState, useEffect } from "react";
import { fetchCotizaciones, fetchClientes, fetchPlanes, insertCotizacion, updateCotizacionStatus } from "@/utils/supabase";
import { generateQuotePDF } from "./PDFGenerator";

interface Cotizacion {
  id: string;
  numero: number;
  cliente_id: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_empresa: string;
  cliente_rut: string;
  plan_nombre: string;
  items: any[];
  subtotal: number;
  impuesto: number;
  total: number;
  estado: "pendiente" | "enviada" | "aceptada" | "rechazada";
  notas: string;
  created_at: string;
}

const formatCLP = (precio: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(precio);
};

const ESTADOS = {
  pendiente: { label: "Pendiente", color: "bg-gray-100 text-gray-700" },
  enviada: { label: "Enviada", color: "bg-blue-100 text-blue-700" },
  aceptada: { label: "Aceptada", color: "bg-green-100 text-green-700" },
  rechazada: { label: "Rechazada", color: "bg-red-100 text-red-700" },
};

export default function CotizacionesSection() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    cliente_id: "",
    nuevo_cliente: {
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      rut: "",
    },
    plan_id: "",
    items_manuales: [] as { descripcion: string; precio: number }[],
    notas: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [cots, clis, pls] = await Promise.all([
        fetchCotizaciones(),
        fetchClientes(),
        fetchPlanes(),
      ]);
      setCotizaciones(cots || []);
      setClientes(clis || []);
      setPlanes(pls || []);
    } catch (error) {
      console.error("Error loading cotizaciones data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: any) {
    try {
      await updateCotizacionStatus(id, status);
      loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    let clienteFinal = {
      id: form.cliente_id,
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      rut: "",
    };

    if (form.cliente_id === "nuevo") {
      clienteFinal.nombre = form.nuevo_cliente.nombre;
      clienteFinal.email = form.nuevo_cliente.email;
      clienteFinal.telefono = form.nuevo_cliente.telefono;
      clienteFinal.empresa = form.nuevo_cliente.empresa;
      clienteFinal.rut = form.nuevo_cliente.rut;
    } else {
      const selected = clientes.find(c => c.id === form.cliente_id);
      clienteFinal.nombre = selected.nombre;
      clienteFinal.email = selected.email;
      clienteFinal.telefono = selected.telefono;
      clienteFinal.empresa = selected.empresa;
      clienteFinal.rut = selected.rut;
    }

    let itemsFinal: { descripcion: string; precio: number }[] = [];
    let planNombre = "";

    if (form.plan_id && form.plan_id !== "manual") {
      const plan = planes.find(p => p.id === form.plan_id);
      itemsFinal.push({ descripcion: plan.nombre, precio: plan.precio });
      planNombre = plan.nombre;
    }

    itemsFinal = [...itemsFinal, ...form.items_manuales];

    const subtotal = itemsFinal.reduce((acc, item) => acc + item.precio, 0);
    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;

    try {
      await insertCotizacion({
        cliente_id: clienteFinal.id === "nuevo" ? null : clienteFinal.id,
        cliente_nombre: clienteFinal.nombre,
        cliente_email: clienteFinal.email,
        cliente_telefono: clienteFinal.telefono,
        cliente_empresa: clienteFinal.empresa,
        cliente_rut: clienteFinal.rut,
        plan_nombre: planNombre || "Personalizado",
        items: itemsFinal,
        subtotal,
        impuesto,
        total,
        notas: form.notas,
        estado: "pendiente",
      });
      setShowForm(false);
      setForm({
        cliente_id: "",
        nuevo_cliente: { nombre: "", email: "", telefono: "", empresa: "", rut: "" },
        plan_id: "",
        items_manuales: [],
        notas: "",
      });
      loadData();
    } catch (error) {
      console.error("Error creating cotizacion:", error);
    }
  }

  const handleDownloadPDF = (cot: Cotizacion) => {
    generateQuotePDF({
      numero: cot.numero,
      fecha: new Date(cot.created_at).toLocaleDateString(),
      cliente: {
        nombre: cot.cliente_nombre,
        empresa: cot.cliente_empresa,
        rut: cot.cliente_rut,
        email: cot.cliente_email,
        telefono: cot.cliente_telefono,
      },
      items: cot.items,
      subtotal: cot.subtotal,
      iva: cot.impuesto,
      total: cot.total,
      notas: cot.notas,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#111]">Cotizaciones</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#111] text-white text-sm px-4 py-2 rounded-md hover:bg-[#333] transition-colors"
        >
          {showForm ? "Cerrar" : "Nueva cotización"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 border border-[#e5e5e5] rounded-lg bg-[#fafafa]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cliente */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-[#111]">Información del Cliente</h3>
              <select
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none"
                value={form.cliente_id}
                onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
                required
              >
                <option value="">Seleccionar cliente...</option>
                <option value="nuevo">-- Nuevo cliente --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.empresa ? `(${c.empresa})` : ""}</option>
                ))}
              </select>

              {form.cliente_id === "nuevo" && (
                <div className="flex flex-col gap-3 p-4 border border-[#e5e5e5] rounded bg-white">
                  <input
                    placeholder="Nombre"
                    className="text-sm px-3 py-1.5 border border-[#e5e5e5] rounded"
                    value={form.nuevo_cliente.nombre}
                    onChange={(e) => setForm({ ...form, nuevo_cliente: { ...form.nuevo_cliente, nombre: e.target.value }})}
                    required
                  />
                  <input
                    placeholder="Email"
                    className="text-sm px-3 py-1.5 border border-[#e5e5e5] rounded"
                    value={form.nuevo_cliente.email}
                    onChange={(e) => setForm({ ...form, nuevo_cliente: { ...form.nuevo_cliente, email: e.target.value }})}
                  />
                  <input
                    placeholder="Teléfono"
                    className="text-sm px-3 py-1.5 border border-[#e5e5e5] rounded"
                    value={form.nuevo_cliente.telefono}
                    onChange={(e) => setForm({ ...form, nuevo_cliente: { ...form.nuevo_cliente, telefono: e.target.value }})}
                  />
                  <input
                    placeholder="Empresa"
                    className="text-sm px-3 py-1.5 border border-[#e5e5e5] rounded"
                    value={form.nuevo_cliente.empresa}
                    onChange={(e) => setForm({ ...form, nuevo_cliente: { ...form.nuevo_cliente, empresa: e.target.value }})}
                  />
                  <input
                    placeholder="RUT"
                    className="text-sm px-3 py-1.5 border border-[#e5e5e5] rounded"
                    value={form.nuevo_cliente.rut}
                    onChange={(e) => setForm({ ...form, nuevo_cliente: { ...form.nuevo_cliente, rut: e.target.value }})}
                  />
                </div>
              )}
            </div>

            {/* Plan / Items */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-[#111]">Plan y Servicios</h3>
              <select
                className="w-full text-sm px-3.5 py-2 rounded-md border border-[#e5e5e5] outline-none"
                value={form.plan_id}
                onChange={(e) => setForm({ ...form, plan_id: e.target.value })}
              >
                <option value="">Seleccionar plan...</option>
                <option value="manual">-- Ítems personalizados --</option>
                {planes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({formatCLP(p.precio)})</option>
                ))}
              </select>

              {form.plan_id === "manual" && (
                <div className="flex flex-col gap-3 p-4 border border-[#e5e5e5] rounded bg-white">
                  {form.items_manuales.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        placeholder="Descripción"
                        className="flex-1 text-sm px-3 py-1.5 border border-[#e5e5e5] rounded"
                        value={item.descripcion}
                        onChange={(e) => {
                          const newItems = [...form.items_manuales];
                          newItems[index].descripcion = e.target.value;
                          setForm({ ...form, items_manuales: newItems });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Precio"
                        className="w-24 text-sm px-3 py-1.5 border border-[#e5e5e5] rounded"
                        value={item.precio}
                        onChange={(e) => {
                          const newItems = [...form.items_manuales];
                          newItems[index].precio = Number(e.target.value);
                          setForm({ ...form, items_manuales: newItems });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = form.items_manuales.filter((_, i) => i !== index);
                          setForm({ ...form, items_manuales: newItems });
                        }}
                        className="text-red-500 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, items_manuales: [...form.items_manuales, { descripcion: "", precio: 0 }] })}
                    className="text-xs text-[#111] border border-dashed border-[#e5e5e5] py-2 rounded hover:bg-[#f9f9f9]"
                  >
                    + Agregar ítem manual
                  </button>
                </div>
              )}

              <textarea
                placeholder="Notas adicionales..."
                className="text-sm px-3.5 py-2 border border-[#e5e5e5] rounded min-h-[100px]"
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 bg-[#111] text-white text-sm px-6 py-2.5 rounded-md hover:bg-[#333] transition-colors"
          >
            Generar y Guardar Cotización
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#888] uppercase border-b border-[#e5e5e5]">
            <tr>
              <th className="px-4 py-3 font-medium">Nro</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-[#888]">Cargando...</td></tr>
            ) : cotizaciones.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-[#888]">No hay cotizaciones.</td></tr>
            ) : (
              cotizaciones.map((cot) => (
                <tr key={cot.id} className="hover:bg-[#f9f9f9]">
                  <td className="px-4 py-4 font-mono text-xs">{String(cot.numero).padStart(4, "0")}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-[#111]">{cot.cliente_nombre}</div>
                    <div className="text-[10px] text-[#888] uppercase tracking-wider">{cot.cliente_empresa || "Particular"}</div>
                  </td>
                  <td className="px-4 py-4 text-[#555]">{cot.plan_nombre}</td>
                  <td className="px-4 py-4 font-medium">{formatCLP(cot.total)}</td>
                  <td className="px-4 py-4">
                    <select
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded border-none outline-none ${ESTADOS[cot.estado]?.color}`}
                      value={cot.estado}
                      onChange={(e) => handleStatusChange(cot.id, e.target.value)}
                    >
                      {Object.keys(ESTADOS).map(key => (
                        <option key={key} value={key}>{(ESTADOS as any)[key].label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleDownloadPDF(cot)}
                      className="text-xs text-[#111] border border-[#e5e5e5] px-2.5 py-1 rounded hover:bg-[#f3f3f3] transition-colors"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
