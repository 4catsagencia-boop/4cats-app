"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { type Colaborador, type Comision } from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function HRView() {
  const adminDB = useAdminDB();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newColab, setNewColab] = useState({
    nombre: "", email: "", rol: "", rut: "", telefono: "", 
    direccion: "", banco: "", tipo_cuenta: "", numero_cuenta: "", 
    comision_porcentaje: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // Optimizamos: Aunque traemos todos los colaboradores (pocos), 
      // para comisiones podríamos filtrar en el futuro si la tabla crece.
      const [colabs, coms] = await Promise.all([
        adminDB.select("colaboradores"),
        adminDB.select("comisiones")
      ]);
      setColaboradores(colabs || []);
      setComisiones(coms || []);
    } catch (e) {
      console.error("Error cargando RRHH:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!newColab.nombre || !newColab.email) return;
    setIsSaving(true);
    try {
      await adminDB.insert("colaboradores", { ...newColab, activo: true });
      setShowModal(false);
      setNewColab({ 
        nombre: "", email: "", rol: "", rut: "", telefono: "", 
        direccion: "", banco: "", tipo_cuenta: "", numero_cuenta: "", 
        comision_porcentaje: 0 
      });
      await loadData();
      alert("Colaborador registrado ✅");
    } catch (error) {
      console.error("Error saving collaborator:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && colaboradores.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Recursos Humanos</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Gestión de equipo y liquidación de comisiones</p>
        </div>
        <button 
          onClick={loadData}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A35] rounded-xl transition-colors"
        >
          <svg className={`w-4 h-4 text-[#7C5CBF] ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colaboradores */}
        <div className="lg:col-span-1 bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Equipo Activo</h2>
            <span className="bg-[#F3EEFF] text-[#7C5CBF] text-[10px] font-bold px-2 py-0.5 rounded-full">{colaboradores.length}</span>
          </div>
          <div className="space-y-3">
            {colaboradores.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#0F0F12] border border-transparent hover:border-[#7C5CBF]/30 transition-all cursor-default">
                <div>
                  <p className="text-sm font-bold text-[#18181B] dark:text-white">{c.nombre}</p>
                  <p className="text-[10px] text-[#A1A1AA] uppercase tracking-tighter">{c.rol} • {c.comision_porcentaje}% COM.</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
            ))}
            {colaboradores.length === 0 && (
              <p className="text-xs text-[#A1A1AA] text-center py-8 italic border border-dashed border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl">
                Sin colaboradores aún.
              </p>
            )}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full mt-6 py-3 rounded-xl bg-[#7C5CBF] text-white text-xs font-bold hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20 active:scale-[0.98]"
          >
            Agregar Colaborador
          </button>
        </div>

        {/* Comisiones */}
        <div className="lg:col-span-2 bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E4E4E7] dark:border-[#2A2A35] bg-[#FAFAFA] dark:bg-[#1C1C1E]">
            <h2 className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Historial de Comisiones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white dark:bg-[#18181B]">
                  <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Fecha</th>
                  <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Colaborador</th>
                  <th className="text-right text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Monto</th>
                  <th className="text-center text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
                {comisiones.map((com) => {
                  const colab = colaboradores.find(c => c.id === com.colaborador_id);
                  return (
                    <tr key={com.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors">
                      <td className="px-6 py-4 text-[11px] text-[#A1A1AA]">{new Date(com.created_at!).toLocaleDateString("es-CL")}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#18181B] dark:text-white text-xs">{colab?.nombre || 'Desconocido'}</p>
                        <p className="text-[9px] text-[#A1A1AA] uppercase">{colab?.rol || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-[#7C5CBF]">{clp.format(com.monto)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          com.estado === 'pagada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {com.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {comisiones.length === 0 && (
              <div className="px-6 py-12 text-center text-[#A1A1AA] text-xs italic">No hay comisiones procesadas aún.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - Simplificado para el ejemplo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-[#18181B] dark:text-white mb-6">Nuevo Colaborador</h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Nombre Completo"
                value={newColab.nombre} onChange={(e) => setNewColab({...newColab, nombre: e.target.value})}
                className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
              />
              <input 
                type="email" placeholder="Email institucional"
                value={newColab.email} onChange={(e) => setNewColab({...newColab, email: e.target.value})}
                className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Rol"
                  value={newColab.rol} onChange={(e) => setNewColab({...newColab, rol: e.target.value})}
                  className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                />
                <input 
                  type="number" placeholder="% Comisión"
                  value={newColab.comision_porcentaje} onChange={(e) => setNewColab({...newColab, comision_porcentaje: Number(e.target.value)})}
                  className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-xs font-bold text-[#A1A1AA]">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 rounded-xl bg-[#7C5CBF] text-white text-xs font-bold disabled:opacity-50">{isSaving ? "Guardando..." : "Registrar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
