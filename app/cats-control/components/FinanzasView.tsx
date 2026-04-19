"use client";

import { useEffect, useState } from "react";
import { fetchCotizaciones, fetchMeta, upsertMeta, type Cotizacion, type Meta } from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function FinanzasView() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newMeta, setNewMeta] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchCotizaciones(),
      fetchMeta(selectedMonth, selectedYear)
    ]).then(([cots, m]) => {
      setCotizaciones(cots);
      setMeta(m);
      setNewMeta(m?.monto.toString() || "");
    }).finally(() => setLoading(false));
  }, [selectedMonth, selectedYear]);

  const handleSaveMeta = async () => {
    setSavingMeta(true);
    try {
      await upsertMeta(selectedMonth, selectedYear, Number(newMeta));
      setMeta({ id: "", mes: selectedMonth, anio: selectedYear, monto: Number(newMeta) });
      alert("Meta actualizada correctamente");
    } finally {
      setSavingMeta(false);
    }
  };

  // Cálculos de ingresos por mes (últimos 6 meses)
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    
    const total = cotizaciones
      .filter(c => c.estado === "aprobada" && c.created_at)
      .filter(c => {
        const cd = new Date(c.created_at!);
        return cd.getMonth() + 1 === m && cd.getFullYear() === y;
      })
      .reduce((acc, c) => acc + c.total, 0);

    return {
      name: d.toLocaleDateString("es-CL", { month: "short" }),
      total,
      month: m,
      year: y
    };
  });

  const maxIncome = Math.max(...chartData.map(d => d.total), 1);
  const currentMonthIncome = cotizaciones
    .filter(c => c.estado === "aprobada" && c.created_at)
    .filter(c => {
      const cd = new Date(c.created_at!);
      return cd.getMonth() + 1 === selectedMonth && cd.getFullYear() === selectedYear;
    })
    .reduce((acc, c) => acc + c.total, 0);

  if (loading) return null;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Finanzas</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Control de ingresos y metas</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm text-[#18181B] dark:text-white outline-none"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleDateString("es-CL", { month: "long" })}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-3 py-2 text-sm text-[#18181B] dark:text-white outline-none"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Histórico */}
        <div className="lg:col-span-2 bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6">
          <h2 className="text-sm font-bold text-[#18181B] dark:text-white mb-8 uppercase tracking-widest">Ingresos Históricos</h2>
          <div className="h-48 flex items-end justify-between gap-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="absolute -top-8 bg-[#18181B] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {clp.format(d.total)}
                </div>
                <div 
                  className="w-full bg-[#7C5CBF]/20 hover:bg-[#7C5CBF] rounded-t-lg transition-all duration-500 cursor-help"
                  style={{ height: `${(d.total / maxIncome) * 100}%` }}
                />
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meta del Mes */}
        <div className="bg-[#7C5CBF] rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl shadow-[#7C5CBF]/20">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#E5D8FF] mb-1">Meta del Mes</p>
            <h3 className="text-2xl font-bold">{clp.format(currentMonthIncome)} <span className="text-sm font-normal text-[#E5D8FF]">/ {meta ? clp.format(meta.monto) : "—"}</span></h3>
          </div>
          
          <div className="space-y-3">
            <input 
              type="number" 
              placeholder="Nueva meta CLP"
              value={newMeta}
              onChange={(e) => setNewMeta(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all"
            />
            <button 
              onClick={handleSaveMeta}
              disabled={savingMeta}
              className="w-full bg-white text-[#7C5CBF] font-bold py-3 rounded-xl hover:bg-[#F4F4F5] transition-all disabled:opacity-50"
            >
              {savingMeta ? "Guardando..." : "Actualizar Meta"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de ingresos del mes seleccionado */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E4E4E7] dark:border-[#2A2A35]">
          <h2 className="text-sm font-bold text-[#18181B] dark:text-white uppercase tracking-widest">Detalle de Ingresos ({new Date(selectedYear, selectedMonth - 1).toLocaleDateString("es-CL", { month: "long" })})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#1C1C1E]">
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Fecha</th>
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Cliente</th>
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Concepto</th>
                <th className="text-right text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
              {cotizaciones
                .filter(c => c.estado === "aprobada" && c.created_at)
                .filter(c => {
                  const cd = new Date(c.created_at!);
                  return cd.getMonth() + 1 === selectedMonth && cd.getFullYear() === selectedYear;
                })
                .map(c => (
                  <tr key={c.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors">
                    <td className="px-6 py-4 text-[#A1A1AA]">{new Date(c.created_at!).toLocaleDateString("es-CL")}</td>
                    <td className="px-6 py-4 font-medium text-[#18181B] dark:text-white">{c.cliente_nombre}</td>
                    <td className="px-6 py-4 text-[#52525B] dark:text-[#A1A1AA]">{c.plan_nombre}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#18181B] dark:text-white">{clp.format(c.total)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
