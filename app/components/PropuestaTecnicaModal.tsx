"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PropuestaTecnicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  clientName: string;
}

export default function PropuestaTecnicaModal({
  isOpen,
  onClose,
  clienteId,
  clientName,
}: PropuestaTecnicaModalProps) {
  const [contenido, setContenido] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessTime, setAccessTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPropuesta = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/propuestas-tecnicas/${clienteId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Propuesta no encontrada");
          } else if (response.status === 410) {
            setError("Esta propuesta ha expirado");
          } else {
            setError("Error al cargar la propuesta");
          }
          return;
        }

        const data = await response.json();
        setContenido(data.contenido);
        setAccessTime(new Date());
      } catch (err) {
        setError("Error al cargar la propuesta técnica");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropuesta();
  }, [isOpen, clienteId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handlePrint = (e: React.PrintEvent) => {
    e.preventDefault();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-4 z-50 flex flex-col rounded-3xl bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E4E4E7] dark:border-[#2A2A35] bg-gray-50 dark:bg-[#16161D]/50">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#18181B] dark:text-white">
                  Propuesta Técnica Protegida
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Documento confidencial — Acceso restringido
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-[#2A2A35] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto relative">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-[#7C5CBF]/20 border-t-[#7C5CBF] rounded-full animate-spin" />
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-sm">
                    <p className="text-red-500 font-bold mb-2">Error</p>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                  </div>
                </div>
              )}

              {contenido && !loading && !error && (
                <div
                  className="p-8 sm:p-12 select-none max-w-3xl mx-auto"
                  onContextMenu={handleContextMenu}
                  style={{
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                  } as any}
                >
                  {/* Watermark */}
                  <div
                    className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-5"
                    style={{
                      fontSize: "6rem",
                      fontWeight: "bold",
                      color: "#7C5CBF",
                      wordBreak: "break-word",
                      textAlign: "center",
                      whiteSpace: "pre-wrap",
                      transform: "rotate(-45deg)",
                    }}
                  >
                    {clientName}
                  </div>

                  {/* Content with protection */}
                  <div className="relative z-10 space-y-8">
                    {contenido.titulo && (
                      <h1 className="text-3xl font-black text-[#18181B] dark:text-white">
                        {contenido.titulo}
                      </h1>
                    )}

                    {contenido.autor && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>
                          <strong>Autor:</strong> {contenido.autor}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {contenido.fecha}
                        </p>
                        {contenido.destinatario && (
                          <p>
                            <strong>Destinatario:</strong> {contenido.destinatario}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Introducción */}
                    {contenido.introduccion && (
                      <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#18181B] dark:text-white">
                          Introducción
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {contenido.introduccion}
                        </p>
                      </section>
                    )}

                    {/* Secciones dinámicas */}
                    {contenido.secciones && (
                      <div className="space-y-6">
                        {Object.entries(contenido.secciones).map(([key, value]: [string, any]) => (
                          <section key={key} className="space-y-3">
                            <h2 className="text-lg font-bold text-[#18181B] dark:text-white capitalize">
                              {key.replace(/_/g, " ")}
                            </h2>

                            {typeof value === "string" && (
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {value}
                              </p>
                            )}

                            {typeof value === "object" && !Array.isArray(value) && (
                              <div className="space-y-4 ml-4">
                                {Object.entries(value).map(([subkey, subvalue]: [string, any]) => (
                                  <div key={subkey}>
                                    <h3 className="font-semibold text-[#18181B] dark:text-white capitalize">
                                      {subkey.replace(/_/g, " ")}
                                    </h3>
                                    {typeof subvalue === "string" ? (
                                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1">
                                        {subvalue}
                                      </p>
                                    ) : Array.isArray(subvalue) ? (
                                      <ul className="list-disc list-inside space-y-1 mt-1">
                                        {subvalue.map((item, idx) => (
                                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                            {typeof item === "string" ? item : JSON.stringify(item)}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            )}

                            {Array.isArray(value) && (
                              <ul className="list-disc list-inside space-y-2 ml-4">
                                {value.map((item, idx) => (
                                  <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">
                                    {typeof item === "string" ? item : JSON.stringify(item)}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </section>
                        ))}
                      </div>
                    )}

                    {/* Objetivos */}
                    {contenido.objetivos && Array.isArray(contenido.objetivos) && (
                      <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#18181B] dark:text-white">Objetivos</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          {contenido.objetivos.map((obj: string, idx: number) => (
                            <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Módulos */}
                    {contenido.modulos && Array.isArray(contenido.modulos) && (
                      <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#18181B] dark:text-white">Módulos</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          {contenido.modulos.map((mod: string, idx: number) => (
                            <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">
                              {mod}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#E4E4E7] dark:border-[#2A2A35] bg-gray-50 dark:bg-[#16161D]/50 text-xs text-gray-500 dark:text-gray-400 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex-1">
                  ⚠️ Documento confidencial. Protegido contra copia, descarga e impresión.
                </span>
                {accessTime && (
                  <span className="flex-shrink-0 ml-4">
                    Accedido: {accessTime.toLocaleString("es-CL")}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
