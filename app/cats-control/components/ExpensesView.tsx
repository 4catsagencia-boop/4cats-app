"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { type Gasto, type Moneda } from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ExpensesView() {
  const adminDB = useAdminDB();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGasto, setNewGasto] = useState({
    descripcion: "",
    monto: 0,
    moneda: "CLP" as Moneda,
    categoria: "infraestructura" as Gasto['categoria'],
    tipo: "fijo" as Gasto['tipo'],
    estado: "pagado" as Gasto['estado'],
    fecha: new Date().toISOString().split('T')[0]
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminDB.select("gastos");
      setGastos(data || []);
    } catch (e) {
      console.error("Error cargando gastos:", e);
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
      await adminDB.insert("gastos", newGasto);
      setShowModal(false);
      setNewGasto({ 
        descripcion: "", monto: 0, moneda: "CLP", 
        categoria: "infraestructura", tipo: "fijo", 
        estado: "pagado", fecha: new Date().toISOString().split('T')[0] 
      });
      await loadData();
      alert("Gasto registrado ✅");
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
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Control de Gastos</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Egresos operativos, software e infraestructura</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#7C5CBF] text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#6B4DAE] transition-all flex items-center gap-2 shadow-lg shadow-[#7C5CBF]/20 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Registrar Gasto
        </button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Total Egresos CLP</p>
          <p className="text-xl font-black text-[#18181B] dark:text-white">{clp.format(totals.clp)}</p>
        </div>
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Total Egresos USD</p>
          <p className="text-xl font-black text-[#7C5CBF]">{usd.format(totals.usd)}</p>
        </div>
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Gastos Fijos</p>
          <p className="text-xl font-black text-[#18181B] dark:text-white">{gastos.filter(g => g.tipo === 'fijo').length} recurrentes</p>
        </div>
        <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest mb-1">Estado de Caja</p>
          <p className="text-xl font-black text-green-500">SANEADA</p>
        </div>
      </div>

      {/* Tabla de Gastos */}
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
                <tr key={g.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors group">
                  <td className="px-6 py-4 text-[11px] text-[#A1A1AA] font-mono">{new Date(g.fecha).toLocaleDateString("es-CL")}</td>
                  <td className="px-6 py-4 font-bold text-[#18181B] dark:text-white text-xs">{g.descripcion}</td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-black bg-[#F3EEFF] dark:bg-[#1C1630] text-[#7C5CBF] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {g.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-[#A1A1AA] uppercase tracking-widest">{g.tipo}</td>
                  <td className="px-6 py-4 text-right font-black text-[#18181B] dark:text-white">
                    {g.moneda === 'CLP' ? clp.format(g.monto) : usd.format(g.monto)}
                  </td>
                </tr>
              ))}
              {gastos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#A1A1AA] text-xs italic">No hay registros de gastos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#18181B] dark:text-white">Nuevo Gasto</h3>
              <button onClick={() => setShowModal(false)} className="text-[#A1A1AA] hover:text-[#18181B]">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Fecha del Gasto</label>
                <input 
                  type="date" 
                  value={newGasto.fecha}
                  onChange={(e) => setNewGasto({...newGasto, fecha: e.target.value})}
                  className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Descripción</label>
                <input 
                  type="text" 
                  value={newGasto.descripcion}
                  onChange={(e) => setNewGasto({...newGasto, descripcion: e.target.value})}
                  placeholder="Ej: Servidor Vercel Pro"
                  className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Monto</label>
                  <input 
                    type="number" 
                    value={newGasto.monto}
                    onChange={(e) => setNewGasto({...newGasto, monto: Number(e.target.value)})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Moneda</label>
                  <select 
                    value={newGasto.moneda}
                    onChange={(e) => setNewGasto({...newGasto, moneda: e.target.value as Moneda})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                  >
                    <option value="CLP">CLP</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Categoría</label>
                  <select 
                    value={newGasto.categoria}
                    onChange={(e) => setNewGasto({...newGasto, categoria: e.target.value as Gasto['categoria']})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                  >
                    <option value="ia">IA / APIs</option>
                    <option value="infraestructura">Infra / Cloud</option>
                    <option value="marketing">Marketing</option>
                    <option value="operaciones">Operaciones</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Tipo</label>
                  <select 
                    value={newGasto.tipo}
                    onChange={(e) => setNewGasto({...newGasto, tipo: e.target.value as Gasto['tipo']})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                  >
                    <option value="fijo">Fijo / Suscripción</option>
                    <option value="variable">Variable / Único</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-xs font-bold text-[#A1A1AA]">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 rounded-xl bg-[#7C5CBF] text-white text-xs font-bold shadow-lg shadow-[#7C5CBF]/20">{isSaving ? "Guardando..." : "Guardar Gasto"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
