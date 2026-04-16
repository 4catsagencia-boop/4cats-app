"use client";

import { useEffect, useState } from "react";
import {
  fetchCotizaciones, fetchClientes, fetchMeta,
  type Cotizacion, type Cliente, type Meta
} from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const estadoBadge: Record<Cotizacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  aprobada: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rechazada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function KPICard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? "bg-[#7C5CBF] border-[#7C5CBF] text-white" : "bg-white dark:bg-[#18181B] border-[#E4E4E7] dark:border-[#2A2A35]"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accent ? "text-[#E5D8FF]" : "text-[#A1A1AA]"}`}>{label}</p>
      <p className={`text-2xl font-bold truncate ${accent ? "text-white" : "text-[#18181B] dark:text-white"}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${accent ? "text-[#E5D8FF]" : "text-[#A1A1AA]"}`}>{sub}</p>}
    </div>
  );
}

function GoalBar({ actual, meta }: { actual: number; meta: number }) {
  const pct = meta > 0 ? Math.min((actual / meta) * 100, 100) : 0;
  const color = pct >= 100 ? "#16a34a" : pct >= 60 ? "#ca8a04" : "#7C5CBF";
  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[#18181B] dark:text-white">Meta del mes</p>
        <p className="text-sm font-bold text-[#18181B] dark:text-white">{Math.round(pct)}%</p>
      </div>
      <div className="w-full h-2.5 bg-[#F4F4F5] dark:bg-[#27272A] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-xs text-[#A1A1AA]">{clp.format(actual)} facturado</p>
        <p className="text-xs text-[#A1A1AA]">Meta: {meta > 0 ? clp.format(meta) : "—"}</p>
      </div>
    </div>
  );
}

export default function DashboardView() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const mes = now.getMonth() + 1;
  const anio = now.getFullYear();

  useEffect(() => {
    Promise.all([fetchCotizaciones(), fetchClientes(), fetchMeta(mes, anio)])
      .then(([cots, cls, m]) => { setCotizaciones(cots); setClientes(cls); setMeta(m); })
      .finally(() => setLoading(false));
  }, [mes, anio]);

  const aprobadas = cotizaciones.filter((c) => c.estado === "aprobada");
  const pendientes = cotizaciones.filter((c) => c.estado === "pendiente");

  const aprobadasEsteMes = aprobadas.filter((c) => {
    if (!c.created_at) return false;
    const d = new Date(c.created_at);
    return d.getMonth() + 1 === mes && d.getFullYear() === anio;
  });

  const ingresosMes = aprobadasEsteMes.reduce((acc, c) => acc + c.total, 0);
  const ultimas = cotizaciones.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const mesNombre = now.toLocaleDateString("es-CL", { month: "long", year: "numeric" });

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Dashboard</h1>
        <p className="text-sm text-[#A1A1AA] mt-0.5 capitalize">{mesNombre}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ingresos del mes" value={clp.format(ingresosMes)} sub={`${aprobadasEsteMes.length} aprobadas`} accent />
        <KPICard label="Pendientes" value={String(pendientes.length)} sub="sin respuesta" />
        <KPICard label="Total clientes" value={String(clientes.length)} />
        <KPICard label="Cotizaciones" value={String(cotizaciones.length)} sub="historial total" />
      </div>

      <GoalBar actual={ingresosMes} meta={meta?.monto ?? 0} />

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
                <p className="text-sm font-semibold text-[#18181B] dark:text-white">{clp.format(c.total)}</p>
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
