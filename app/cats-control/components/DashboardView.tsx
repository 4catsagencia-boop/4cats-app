"use client";

import { useEffect, useState } from "react";
import { fetchCotizaciones, fetchClientes, type Cotizacion, type Cliente } from "../../../utils/supabase";

const clpFormatter = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const estadoBadge: Record<Cotizacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  aprobada: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rechazada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

function KPICard({ label, value, sub, color = "#7C5CBF" }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-5">
      <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#18181B] dark:text-white" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-[#A1A1AA] mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardView() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCotizaciones(), fetchClientes()])
      .then(([cots, cls]) => { setCotizaciones(cots); setClientes(cls); })
      .finally(() => setLoading(false));
  }, []);

  const aprobadas = cotizaciones.filter((c) => c.estado === "aprobada");
  const pendientes = cotizaciones.filter((c) => c.estado === "pendiente");
  const revenueTotal = aprobadas.reduce((acc, c) => acc + c.total, 0);
  const ultimas = cotizaciones.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Dashboard</h1>
        <p className="text-sm text-[#A1A1AA] mt-0.5">Resumen del negocio en tiempo real</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total cotizaciones" value={cotizaciones.length} color="#18181B" />
        <KPICard
          label="Aprobadas"
          value={aprobadas.length}
          sub={clpFormatter.format(revenueTotal)}
          color="#16a34a"
        />
        <KPICard label="Pendientes" value={pendientes.length} color="#ca8a04" />
        <KPICard label="Clientes" value={clientes.length} color="#7C5CBF" />
      </div>

      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E4E4E7] dark:border-[#2A2A35]">
          <h2 className="text-sm font-semibold text-[#18181B] dark:text-white">Últimas cotizaciones</h2>
        </div>
        <div className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
          {ultimas.length === 0 && (
            <p className="text-sm text-[#A1A1AA] px-5 py-4">Sin cotizaciones aún.</p>
          )}
          {ultimas.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-5 py-3 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#18181B] dark:text-white truncate">{c.cliente_nombre}</p>
                <p className="text-xs text-[#A1A1AA]">{c.plan_nombre}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-sm font-semibold text-[#18181B] dark:text-white">{clpFormatter.format(c.total)}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${estadoBadge[c.estado]}`}>
                  {c.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
