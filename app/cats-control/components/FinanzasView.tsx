"use client";

import { useEffect, useState } from "react";
import { fetchCotizaciones, fetchMeta, upsertMeta, fetchHitosPago, fetchGastos, type Cotizacion, type Meta, type HitoPago, type Gasto } from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function FinanzasView() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [hitos, setHitos] = useState<HitoPago[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newMeta, setNewMeta] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchCotizaciones(),
      fetchMeta(selectedMonth, selectedYear),
      fetchHitosPago(),
      fetchGastos()
    ]).then(([cots, m, h, g]) => {
      setCotizaciones(cots);
      setMeta(m);
      setHitos(h);
      setGastos(g);
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

  // Cálculos de ingresos y gastos por mes (últimos 6 meses)
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    
    const projected = cotizaciones
      .filter(c => c.estado === "aprobada" && c.created_at)
      .filter(c => {
        const cd = new Date(c.created_at!);
        return cd.getMonth() + 1 === m && cd.getFullYear() === y;
      })
      .reduce((acc, c) => acc + c.total, 0);

    const real = hitos
      .filter(h => h.estado === "pagado" && h.fecha_pago)
      .filter(h => {
        const hd = new Date(h.fecha_pago!);
        return hd.getMonth() + 1 === m && hd.getFullYear() === y;
      })
      .reduce((acc, h) => acc + h.monto, 0);

    const expense = gastos
      .filter(g => {
        const gd = new Date(g.fecha);
        return gd.getMonth() + 1 === m && gd.getFullYear() === y;
      })
      .reduce((acc, g) => acc + g.monto, 0); // Simplificación: asume CLP para el gráfico rápido

    return {
      name: d.toLocaleDateString("es-CL", { month: "short" }),
      projected,
      real,
      expense,
      month: m,
      year: y
    };
  });

  const maxIncome = Math.max(...chartData.map(d => Math.max(d.projected, d.real, d.expense)), 1);
  
  const currentMonthProjected = cotizaciones
    .filter(c => c.estado === "aprobada" && c.created_at)
    .filter(c => {
      const cd = new Date(c.created_at!);
      return cd.getMonth() + 1 === selectedMonth && cd.getFullYear() === selectedYear;
    })
    .reduce((acc, c) => acc + c.total, 0);

  const currentMonthReal = hitos
    .filter(h => h.estado === "pagado" && h.fecha_pago)
    .filter(h => {
      const hd = new Date(h.fecha_pago!);
      return hd.getMonth() + 1 === selectedMonth && hd.getFullYear() === selectedYear;
    })
    .reduce((acc, h) => acc + h.monto, 0);

  const currentMonthExpense = gastos
    .filter(g => {
      const gd = new Date(g.fecha);
      return gd.getMonth() + 1 === selectedMonth && gd.getFullYear() === selectedYear;
    })
    .reduce((acc, g) => acc + g.monto, 0);

  const netProfit = currentMonthReal - currentMonthExpense;

  if (loading) return null;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Finanzas y Utilidad</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Control de ingresos, gastos y margen neto</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Ingreso Real</p>
          <p className="text-2xl font-black text-[#18181B] dark:text-white">{clp.format(currentMonthReal)}</p>
        </div>
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 text-red-500">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Egresos Totales</p>
          <p className="text-2xl font-black">{clp.format(currentMonthExpense)}</p>
        </div>
        <div className="bg-[#7C5CBF] rounded-3xl p-6 text-white shadow-xl shadow-[#7C5CBF]/20">
          <p className="text-[10px] font-bold text-[#E5D8FF] uppercase tracking-widest mb-1">Utilidad Neta (Margen)</p>
          <p className="text-2xl font-black">{clp.format(netProfit)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Histórico */}
        <div className="lg:col-span-2 bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-bold text-[#18181B] dark:text-white uppercase tracking-widest">Balance Histórico</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#7C5CBF]" />
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase">Ingreso</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase">Gasto</span>
              </div>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="absolute -top-12 bg-[#18181B] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-center">
                  I: {clp.format(d.real)}<br/>G: {clp.format(d.expense)}
                </div>
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div 
                    className="w-1/3 bg-[#7C5CBF] rounded-t-sm transition-all duration-500 cursor-help"
                    style={{ height: `${(d.real / maxIncome) * 100}%` }}
                  />
                  <div 
                    className="w-1/3 bg-red-400/50 rounded-t-sm transition-all duration-500 cursor-help"
                    style={{ height: `${(d.expense / maxIncome) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meta del Mes */}
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-1">Configurar Meta de Ingresos</p>
            <h3 className="text-xl font-bold text-[#18181B] dark:text-white">{meta ? clp.format(meta.monto) : "Sin meta"}</h3>
          </div>
          
          <div className="space-y-3 mt-6">
            <input 
              type="number" 
              placeholder="Nueva meta CLP"
              value={newMeta}
              onChange={(e) => setNewMeta(e.target.value)}
              className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-[#18181B] dark:text-white"
            />
            <button 
              onClick={handleSaveMeta}
              disabled={savingMeta}
              className="w-full bg-[#7C5CBF] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {savingMeta ? "Guardando..." : "Actualizar Meta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
