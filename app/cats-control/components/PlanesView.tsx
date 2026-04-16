"use client";

import { useEffect, useState } from "react";
import { fetchPlanes, type Plan } from "../../../utils/supabase";

const clpFormatter = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

export default function PlanesView() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanes().then(setPlanes).finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Planes</h1>
        <p className="text-sm text-[#A1A1AA] mt-0.5">{planes.length} planes configurados</p>
      </div>

      <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4E4E7] dark:border-[#2A2A35]">
                <th className="text-left text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Nombre</th>
                <th className="text-right text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Precio</th>
                <th className="text-center text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Visibilidad</th>
                <th className="text-center text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider px-5 py-3">Destacado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
              {planes.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-[#A1A1AA] py-8">Sin planes aún.</td>
                </tr>
              )}
              {planes.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#18181B] dark:text-white">{p.nombre}</p>
                    {p.descripcion && (
                      <p className="text-xs text-[#A1A1AA] mt-0.5 line-clamp-1">{p.descripcion}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-[#18181B] dark:text-white whitespace-nowrap">
                    {clpFormatter.format(p.precio)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.publicado
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-[#F4F4F5] text-[#A1A1AA] dark:bg-[#27272A]"
                    }`}>
                      {p.publicado ? "Publicado" : "Oculto"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {p.destacado ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F3EEFF] text-[#7C5CBF] dark:bg-[#1C1630]">
                        Destacado
                      </span>
                    ) : (
                      <span className="text-[#E4E4E7] dark:text-[#2A2A35]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
