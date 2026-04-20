"use client";

import { useEffect, useState } from "react";
import { fetchFacturas, fetchHitosPago, type Factura, type HitoPago, type Moneda, updateHitoStatus, type MetodoPago } from "../../../utils/supabase";

const formatters = {
  CLP: new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }),
  BRL: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
};

export default function BillingView() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [hitos, setHitos] = useState<Record<string, HitoPago[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacturas().then(async (data) => {
      setFacturas(data);
      
      // Fetch hitos for each factura (placeholder/mock for now)
      const hitosMap: Record<string, HitoPago[]> = {};
      for (const f of data) {
        const h = await fetchHitosPago(f.id);
        hitosMap[f.id] = h;
      }
      setHitos(hitosMap);
    }).finally(() => setLoading(false));
  }, []);

  // Mock data if empty
  const displayFacturas = facturas.length > 0 ? facturas : [
    { id: "f1", cotizacion_id: "c1", cliente_id: "cl1", numero_factura: "FAC-001", monto_total: 1500000, moneda: "CLP" as Moneda, estado: "pendiente" as const, created_at: new Date().toISOString() },
    { id: "f2", cotizacion_id: "c2", cliente_id: "cl2", numero_factura: "FAC-002", monto_total: 5000, moneda: "BRL" as Moneda, estado: "pendiente" as const, created_at: new Date().toISOString() },
    { id: "f3", cotizacion_id: "c3", cliente_id: "cl3", numero_factura: "FAC-003", monto_total: 1200, moneda: "USD" as Moneda, estado: "pagada" as const, created_at: new Date().toISOString() }
  ];

  const mockHitos: Record<string, HitoPago[]> = {
    "f1": [
      { id: "h1", factura_id: "f1", nombre: "Anticipo 50%", monto: 750000, moneda: "CLP", estado: "pagado", fecha_pago: "2024-03-01", metodo_pago: "transferencia" },
      { id: "h2", factura_id: "f1", nombre: "Finalización 50%", monto: 750000, moneda: "CLP", estado: "pendiente" }
    ],
    "f2": [
      { id: "h3", factura_id: "f2", nombre: "Pago Único", monto: 5000, moneda: "BRL", estado: "pendiente" }
    ],
    "f3": [
      { id: "h4", factura_id: "f3", nombre: "Pago Único", monto: 1200, moneda: "USD", estado: "pagado", fecha_pago: "2024-03-05", metodo_pago: "tarjeta_credito" }
    ]
  };

  const finalHitos = Object.keys(hitos).length > 0 ? hitos : mockHitos;

  const handleMarkAsPaid = async (hitoId: string, metodo: MetodoPago) => {
    try {
      await updateHitoStatus(hitoId, 'pagado', new Date().toISOString(), metodo);
      alert("Hito marcado como pagado");
      // Refresh logic would go here
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && facturas.length === 0) return null;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Facturación y Cobranza</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Control de hitos de pago y multi-moneda (CLP, BRL, USD)</p>
        </div>
      </div>

      <div className="space-y-6">
        {displayFacturas.map((f) => (
          <div key={f.id} className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-[#FAFAFA] dark:bg-[#1C1C1E] border-b border-[#E4E4E7] dark:border-[#2A2A35] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#7C5CBF] bg-[#7C5CBF]/10 px-2 py-1 rounded">
                  {f.numero_factura || "S/N"}
                </span>
                <h3 className="text-sm font-bold text-[#18181B] dark:text-white uppercase tracking-widest">
                  Cotización: {f.cotizacion_id}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#A1A1AA] uppercase font-bold tracking-tighter">Total Factura</p>
                <p className="text-lg font-bold text-[#18181B] dark:text-white">
                  {formatters[f.moneda].format(f.monto_total)}
                </p>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-4">Hitos de Pago</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {finalHitos[f.id]?.map((h) => (
                  <div key={h.id} className="border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-4 flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-[#18181B] dark:text-white">{h.nombre}</p>
                        <p className="text-xs text-[#A1A1AA]">{formatters[h.moneda].format(h.monto)}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        h.estado === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {h.estado.toUpperCase()}
                      </span>
                    </div>

                    {h.estado === 'pagado' ? (
                      <div className="text-[10px] text-[#A1A1AA]">
                        <p>Pagado el: {new Date(h.fecha_pago!).toLocaleDateString("es-CL")}</p>
                        <p>Medio: {h.metodo_pago?.replace('_', ' ')}</p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleMarkAsPaid(h.id, 'transferencia')}
                          className="flex-1 bg-[#7C5CBF] text-white text-[10px] font-bold py-2 rounded-lg hover:opacity-90 transition-all"
                        >
                          Transferencia
                        </button>
                        <button 
                          onClick={() => handleMarkAsPaid(h.id, 'tarjeta_credito')}
                          className="flex-1 border border-[#E4E4E7] dark:border-[#2A2A35] text-[10px] font-bold py-2 rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#2A2A35] dark:text-white transition-all"
                        >
                          Tarjeta
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
