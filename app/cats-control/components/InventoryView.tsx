"use client";

import { useEffect, useState } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { type Servicio } from "../../../utils/supabase";

export default function InventoryView() {
  const adminDB = useAdminDB();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminDB.select("servicios");
      setServicios(data || []);
    } catch (err) {
      console.error("Error al cargar inventario:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjust = async (id: string, field: 'capacidad_mensual' | 'cupos_ocupados', delta: number) => {
    const servicio = servicios.find(s => s.id === id);
    if (!servicio) return;

    const newValue = Math.max(0, (servicio[field] || 0) + delta);
    setUpdating(id);
    
    try {
      await adminDB.update("servicios", id, { [field]: newValue });
      setServicios(prev => prev.map(s => s.id === id ? { ...s, [field]: newValue } : s));
    } catch (err) {
      console.error("Error al ajustar capacidad:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading && servicios.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Fallback a servicios base si la tabla está vacía en Supabase
  const displayServicios = servicios.length > 0 ? servicios : [
    { id: "1", nombre: "Desarrollo Web", tipo: "web_dev", capacidad_mensual: 4, cupos_ocupados: 0 },
    { id: "2", nombre: "Mantenimiento Mensual", tipo: "mantenimiento", capacidad_mensual: 20, cupos_ocupados: 0 },
    { id: "3", nombre: "Asesoría Técnica", tipo: "asesoria", capacidad_mensual: 10, cupos_ocupados: 0 }
  ] as Servicio[];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Inventario de Capacidades</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Gestión de slots operativos y carga de trabajo</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayServicios.map((s) => {
          const isOverbooked = s.cupos_ocupados > s.capacidad_mensual;
          const percentage = Math.min((s.cupos_ocupados / s.capacidad_mensual) * 100, 100);
          const isUpdating = updating === s.id;
          
          return (
            <div key={s.id} className={`bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CBF] bg-[#7C5CBF]/10 px-2.5 py-1 rounded-lg mb-2 inline-block">{s.tipo}</span>
                  <h3 className="font-black text-[#18181B] dark:text-white text-lg leading-tight">{s.nombre}</h3>
                </div>
                {isOverbooked && (
                  <div className="flex flex-col items-end">
                    <span className="bg-[#EF4444] text-white text-[9px] font-black px-2 py-1 rounded-full animate-pulse uppercase tracking-tighter">
                      Overbooked
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {/* Slots Ocupados */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Slots Ocupados</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleAdjust(s.id, 'cupos_ocupados', -1)}
                        className="w-8 h-8 rounded-full border border-[#E4E4E7] dark:border-[#2A2A35] flex items-center justify-center text-[#18181B] dark:text-white hover:bg-gray-50 dark:hover:bg-[#27272A] transition-all"
                      >-</button>
                      <span className="font-black text-2xl text-[#18181B] dark:text-white w-8 text-center">{s.cupos_ocupados}</span>
                      <button 
                        onClick={() => handleAdjust(s.id, 'cupos_ocupados', 1)}
                        className="w-8 h-8 rounded-full border border-[#E4E4E7] dark:border-[#2A2A35] flex items-center justify-center text-[#18181B] dark:text-white hover:bg-gray-50 dark:hover:bg-[#27272A] transition-all"
                      >+</button>
                    </div>
                  </div>

                  <div className="w-full bg-[#F4F4F5] dark:bg-[#2A2A35] h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${isOverbooked ? 'bg-[#EF4444]' : 'bg-gradient-to-r from-[#7C5CBF] to-[#9B7ED9]'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Capacidad Total */}
                <div className="flex justify-between items-center pt-6 border-t border-[#F4F4F5] dark:border-[#2A2A35]">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Capacidad Mensual</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAdjust(s.id, 'capacidad_mensual', -1)}
                      className="text-[10px] font-bold text-[#A1A1AA] hover:text-[#7C5CBF]"
                    >Reducir</button>
                    <span className="font-bold text-[#18181B] dark:text-white text-sm bg-[#F4F4F5] dark:bg-[#2A2A35] px-3 py-1 rounded-lg">
                      {s.capacidad_mensual}
                    </span>
                    <button 
                      onClick={() => handleAdjust(s.id, 'capacidad_mensual', 1)}
                      className="text-[10px] font-bold text-[#A1A1AA] hover:text-[#7C5CBF]"
                    >Ampliar</button>
                  </div>
                </div>

                <p className="text-[10px] text-[#A1A1AA] text-center italic">
                  {isOverbooked 
                    ? `⚠️ Alerta: Exceso de ${s.cupos_ocupados - s.capacidad_mensual} proyecto(s).`
                    : `Quedan ${s.capacidad_mensual - s.cupos_ocupados} slots disponibles para este mes.`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
