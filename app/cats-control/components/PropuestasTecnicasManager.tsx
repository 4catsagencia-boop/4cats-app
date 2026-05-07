"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Shield,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { PropouestaTecnica } from "@/utils/supabase";

export default function PropuestasTecnicasManager() {
  const adminDB = useAdminDB();
  const [propuestas, setPropuestas] = useState<PropouestaTecnica[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropuesta, setSelectedPropuesta] = useState<PropouestaTecnica | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarPropuestas();
  }, []);

  const cargarPropuestas = async () => {
    setLoading(true);
    try {
      const data = await adminDB.select("propuestas_tecnicas");
      setPropuestas(data || []);
    } catch (err) {
      console.error("Error cargando propuestas técnicas:", err);
      alert(`Error: ${err instanceof Error ? err.message : "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (propuesta: PropouestaTecnica) => {
    try {
      await adminDB.update("propuestas_tecnicas", propuesta.id, {
        estado: propuesta.estado === "activo" ? "inactivo" : "activo",
      });
      cargarPropuestas();
    } catch (err) {
      console.error("Error actualizando estado:", err);
      alert("Error al actualizar. Revisá la consola.");
    }
  };

  const deletePropuesta = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar esta propuesta técnica?")) return;
    try {
      await adminDB.remove("propuestas_tecnicas", id);
      cargarPropuestas();
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("Error al eliminar. Revisá la consola.");
    }
  };

  const handleCopyLink = (propuesta: PropouestaTecnica) => {
    const url = `${window.location.origin}/propuesta-tecnica/${propuesta.cliente_id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`Link copiado: ${url}`);
    });
  };

  const isExpired = (expira_at?: string) => {
    if (!expira_at) return false;
    return new Date(expira_at) < new Date();
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#18181B] dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#7C5CBF]" />
            Propuestas Técnicas Protegidas
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona templates de propuestas con protección contra copia y descarga
          </p>
        </div>
      </div>

      {/* Lista de Propuestas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#7C5CBF]/20 border-t-[#7C5CBF] rounded-full animate-spin mx-auto" />
        </div>
      ) : propuestas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-[#16161D]/50 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35]">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay propuestas técnicas registradas</p>
          <p className="text-sm text-gray-400 mt-1">
            Se cargó exitosamente la propuesta de Hardy vía script.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {propuestas.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#18181B] dark:text-white">
                      {p.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.estado === "activo"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {p.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                    {isExpired(p.expira_at) && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Expirado
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {p.descripcion}
                  </p>

                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Creado: {p.created_at ? new Date(p.created_at).toLocaleDateString("es-CL") : "—"}
                    </span>
                    {p.expira_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Expira: {new Date(p.expira_at).toLocaleDateString("es-CL")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleEstado(p)}
                    title={
                      p.estado === "activo"
                        ? "Desactivar propuesta"
                        : "Activar propuesta"
                    }
                    className={`p-2 rounded-lg transition-all ${
                      p.estado === "activo"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200"
                        : "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {p.estado === "activo" ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopyLink(p)}
                    title="Copiar link para cliente"
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deletePropuesta(p.id)}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Panel */}
      <div className="p-4 rounded-2xl bg-[#F3EEFF] dark:bg-[#1C1630] border border-[#7C5CBF]/20">
        <p className="text-sm text-[#7C5CBF] font-medium">
          💡 <strong>Tip:</strong> Las propuestas técnicas son documentos protegidos
          contra copy-paste, descarga e impresión. Se registra automáticamente cuándo y
          desde dónde se accede.
        </p>
      </div>
    </div>
  );
}
