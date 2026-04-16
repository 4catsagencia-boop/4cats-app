"use client";

import { useEffect, useState } from "react";
import { fetchClientes, type Cliente } from "../../../utils/supabase";

export default function ClientesView() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientes().then(setClientes).finally(() => setLoading(false));
  }, []);

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Clientes</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">{clientes.length} clientes registrados</p>
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre o email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#18181B] text-sm text-[#18181B] dark:text-white placeholder-[#A1A1AA] rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#7C5CBF] w-full sm:w-64"
        />
      </div>

      {filtrados.length === 0 && (
        <p className="text-sm text-[#A1A1AA]">Sin resultados.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl p-5 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F3EEFF] dark:bg-[#1C1630] flex items-center justify-center text-sm font-bold text-[#7C5CBF]">
                {c.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#18181B] dark:text-white text-sm truncate">{c.nombre}</p>
                <p className="text-xs text-[#A1A1AA] truncate">{c.email}</p>
              </div>
            </div>
            {c.telefono && (
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">{c.telefono}</p>
            )}
            {c.sitio_web && (
              <a
                href={c.sitio_web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#7C5CBF] hover:underline truncate"
              >
                {c.sitio_web}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
