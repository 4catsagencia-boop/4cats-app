"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { type Factura, type HitoPago, type Moneda, type MetodoPago } from "../../../utils/supabase";

const formatters = {
  CLP: new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }),
  BRL: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
};

export default function BillingView() {
  const adminDB = useAdminDB();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [hitos, setHitos] = useState<Record<string, HitoPago[]>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // Traemos las facturas (el proxy ya las ordena por created_at desc)
      const facturasData = await adminDB.select("facturas");
      setFacturas(facturasData || []);
      
      // Optimizamos: Traemos solo los hitos de pago relevantes
      // Por ahora el proxy soporta un filtro eq. Traer todos los hitos 
      // sigue siendo necesario para el map, pero centralizamos la lógica.
      const allHitos = await adminDB.select("hitos_pago") as HitoPago[];
      
      const hitosMap: Record<string, HitoPago[]> = {};
      if (facturasData && allHitos) {
        for (const f of facturasData) {
          hitosMap[f.id] = allHitos.filter(h => h.factura_id === f.id);
        }
      }
      setHitos(hitosMap);
    } catch (e) {
      console.error("Error al cargar facturación:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAsPaid = async (hitoId: string, metodo: MetodoPago) => {
    try {
      await adminDB.update("hitos_pago", hitoId, {
        estado: 'pagado',
        fecha_pago: new Date().toISOString(),
        metodo_pago: metodo
      });
      alert("Hito marcado como pagado ✅");
      loadData();
    } catch (e) {
      console.error("Error al actualizar hito:", e);
    }
  };

  if (loading && facturas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback a mock data solo si la carga falló o está vacía (desarrollo)
  const displayFacturas = facturas.length > 0 ? facturas : [];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Facturación y Cobranza</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Control de hitos de pago y multi-moneda (CLP, BRL, USD)</p>
        </div>
        <button 
          onClick={loadData}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A35] rounded-xl transition-colors"
          title="Refrescar data"
        >
          <svg className={`w-4 h-4 text-[#7C5CBF] ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {displayFacturas.length === 0 && !loading && (
        <div className="text-center py-20 bg-white dark:bg-[#18181B] border border-dashed border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl">
          <p className="text-[#A1A1AA]">No se encontraron facturas registradas.</p>
        </div>
      )}

      <div className="space-y-6">
        {displayFacturas.map((f) => (
          <div key={f.id} className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="px-6 py-4 bg-[#FAFAFA] dark:bg-[#1C1C1E] border-b border-[#E4E4E7] dark:border-[#2A2A35] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-[#7C5CBF] bg-[#7C5CBF]/10 px-2 py-1 rounded uppercase tracking-tighter">
                  {f.numero_factura || "Proforma"}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#18181B] dark:text-white uppercase tracking-widest">
                    Factura ID: {f.id.substring(0, 8)}
                  </h3>
                  <p className="text-[10px] text-[#A1A1AA] uppercase">Creada el {new Date(f.created_at!).toLocaleDateString("es-CL")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-tighter">Total Factura</p>
                <p className="text-lg font-bold text-[#18181B] dark:text-white">
                  {formatters[f.moneda]?.format(f.monto_total) || f.monto_total}
                </p>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#7C5CBF]" />
                Hitos de Pago
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hitos[f.id]?.map((h) => (
                  <div key={h.id} className="border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-4 flex flex-col justify-between gap-4 bg-[#FAFAFA]/30 dark:bg-transparent">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-[#18181B] dark:text-white">{h.nombre}</p>
                        <p className="text-xs text-[#A1A1AA]">{formatters[h.moneda]?.format(h.monto) || h.monto}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        h.estado === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {h.estado.toUpperCase()}
                      </span>
                    </div>

                    {h.estado === 'pagado' ? (
                      <div className="text-[10px] text-[#A1A1AA] bg-white dark:bg-[#0F0F12] p-2 rounded-lg border border-[#E4E4E7] dark:border-[#2A2A35]">
                        <p>🗓️ Pagado el: {new Date(h.fecha_pago!).toLocaleDateString("es-CL")}</p>
                        <p>💳 Medio: {h.metodo_pago?.replace('_', ' ')}</p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleMarkAsPaid(h.id, 'transferencia')}
                          className="flex-1 bg-[#7C5CBF] text-white text-[10px] font-bold py-2 rounded-lg hover:bg-[#6B4DAE] transition-all shadow-sm shadow-[#7C5CBF]/20"
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
                {(!hitos[f.id] || hitos[f.id].length === 0) && (
                  <p className="text-[10px] text-[#A1A1AA] italic">No hay hitos para esta factura.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
