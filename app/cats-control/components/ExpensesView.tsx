"use client";

import { useEffect, useState } from "react";
import { fetchGastos, insertGasto, type Gasto, type Moneda } from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ExpensesView() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGasto, setNewGasto] = useState({
    descripcion: "",
    monto: 0,
    moneda: "CLP" as Moneda,
    categoria: "ia" as Gasto['categoria'],
    tipo: "fijo" as Gasto['tipo'],
    estado: "pagado" as Gasto['estado']
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchGastos();
      setGastos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!newGasto.descripcion || newGasto.monto <= 0) return;
    setIsSaving(true);
    try {
      await insertGasto(newGasto);
      setShowModal(false);
      setNewGasto({ descripcion: "", monto: 0, moneda: "CLP", categoria: "ia", tipo: "fijo", estado: "pagado" });
      await loadData();
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const totals = gastos.reduce((acc, g) => {
    if (g.moneda === 'CLP') acc.clp += g.monto;
    if (g.moneda === 'USD') acc.usd += g.monto;
    return acc;
  }, { clp: 0, usd: 0 });

  if (loading && gastos.length === 0) return (
    <div className="p-12 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C5CBF]" />
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Gestor de Gastos</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Control de suscripciones, infraestructura y costos operativos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#7C5CBF] text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Registrar Gasto
        </button>
      </div>

      {/* Resumen de Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Gasto Total CLP</p>
          <p className="text-xl font-black text-[#18181B] dark:text-white">{clp.format(totals.clp)}</p>
        </div>
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Gasto Total USD</p>
          <p className="text-xl font-black text-[#7C5CBF]">{usd.format(totals.usd)}</p>
        </div>
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Gastos Fijos</p>
          <p className="text-xl font-black text-[#18181B] dark:text-white">{gastos.filter(g => g.tipo === 'fijo').length} suscripciones</p>
        </div>
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Próximo Vencimiento</p>
          <p className="text-xl font-black text-orange-500">Próximamente</p>
        </div>
      </div>

      {/* Listado de Gastos */}
      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#1C1C1E]">
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Fecha</th>
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Descripción</th>
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Categoría</th>
                <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Tipo</th>
                <th className="text-right text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
              {gastos.map((g) => (
                <tr key={g.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors">
                  <td className="px-6 py-4 text-[#A1A1AA]">{new Date(g.fecha).toLocaleDateString("es-CL")}</td>
                  <td className="px-6 py-4 font-medium text-[#18181B] dark:text-white">{g.descripcion}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold bg-[#F3EEFF] dark:bg-[#1C1630] text-[#7C5CBF] px-2 py-0.5 rounded-full uppercase">
                      {g.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#A1A1AA] capitalize">{g.tipo}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#18181B] dark:text-white">
                    {g.moneda === 'CLP' ? clp.format(g.monto) : usd.format(g.monto)}
                  </td>
                </tr>
              ))}
              {gastos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#A1A1AA]">No hay gastos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Gasto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-[#18181B] dark:text-white mb-6">Registrar Gasto</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Descripción</label>
                <input 
                  type="text" 
                  value={newGasto.descripcion}
                  onChange={(e) => setNewGasto({...newGasto, descripcion: e.target.value})}
                  placeholder="Ej: Suscripción Claude Pro"
                  className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Monto</label>
                  <input 
                    type="number" 
                    value={newGasto.monto}
                    onChange={(e) => setNewGasto({...newGasto, monto: Number(e.target.value)})}
                    placeholder="20"
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Moneda</label>
                  <select 
                    value={newGasto.moneda}
                    onChange={(e) => setNewGasto({...newGasto, moneda: e.target.value as Moneda})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  >
                    <option value="CLP">CLP</option>
                    <option value="USD">USD</option>
                    <option value="BRL">BRL</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Categoría</label>
                  <select 
                    value={newGasto.categoria}
                    onChange={(e) => setNewGasto({...newGasto, categoria: e.target.value as Gasto['categoria']})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  >
                    <option value="ia">IA (Claude, GPT, etc)</option>
                    <option value="nube">Nube (Supabase, Vercel)</option>
                    <option value="hosting">Hosting</option>
                    <option value="infraestructura">Infraestructura</option>
                    <option value="marketing">Marketing</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Tipo</label>
                  <select 
                    value={newGasto.tipo}
                    onChange={(e) => setNewGasto({...newGasto, tipo: e.target.value as Gasto['tipo']})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  >
                    <option value="fijo">Recurrente / Fijo</option>
                    <option value="variable">Puntual / Variable</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-10">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-xs font-bold text-[#A1A1AA] hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-[#7C5CBF] text-white text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Guardar Gasto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
