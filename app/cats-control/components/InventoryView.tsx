"use client";

import { useEffect, useState } from "react";
import { fetchServicios, type Servicio } from "../../../utils/supabase";

export default function InventoryView() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicios().then(data => {
      setServicios(data);
    }).finally(() => setLoading(false));
  }, []);

  // Mock data if fetch returns empty (since we haven't created the table in DB yet)
  const displayServicios = servicios.length > 0 ? servicios : [
    { id: "1", nombre: "Desarrollo Web", tipo: "web_dev", capacidad_mensual: 4, cupos_ocupados: 5 },
    { id: "2", nombre: "Mantenimiento Mensual", tipo: "mantenimiento", capacidad_mensual: 20, cupos_ocupados: 12 },
    { id: "3", nombre: "Asesoría Técnica", tipo: "asesoria", capacidad_mensual: 10, cupos_ocupados: 8 }
  ];

  if (loading) return null;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Inventario de Servicios</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Gestión de capacidad y slots operativos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayServicios.map((s) => {
          const isOverbooked = s.cupos_ocupados > s.capacidad_mensual;
          const percentage = Math.min((s.cupos_ocupados / s.capacidad_mensual) * 100, 100);
          
          return (
            <div key={s.id} className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[#18181B] dark:text-white">{s.nombre}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{s.tipo}</span>
                </div>
                {isOverbooked && (
                  <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                    OVERBOOKING
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#71717A]">Slots Ocupados</span>
                  <span className="font-bold text-[#18181B] dark:text-white">{s.cupos_ocupados} / {s.capacidad_mensual}</span>
                </div>

                <div className="w-full bg-[#F4F4F5] dark:bg-[#2A2A35] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isOverbooked ? 'bg-[#EF4444]' : 'bg-[#7C5CBF]'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="pt-2">
                  <p className="text-xs text-[#A1A1AA]">
                    {isOverbooked 
                      ? `Atención: Se ha excedido la capacidad en ${s.cupos_ocupados - s.capacidad_mensual} slot(s).`
                      : `Quedan ${s.capacidad_mensual - s.cupos_ocupados} slots disponibles para este mes.`}
                  </p>
                </div>
              </div>

              <button className="w-full mt-6 py-2 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-xs font-bold text-[#18181B] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#2A2A35] transition-all">
                Ajustar Capacidad
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
