"use client";

import { useState, useEffect } from "react";
import { Backlog, Cliente, UserStory, Epica } from "@/utils/supabase";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { generateBacklogPDF } from "@/utils/backlog-pdf";

export default function BacklogsView() {
  const { query, insert, update, remove } = useAdminDB();
  const [backlogs, setBacklogs] = useState<Backlog[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBacklog, setEditingBacklog] = useState<Backlog | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal form state
  const [formData, setFormData] = useState({
    nombre: "",
    cliente_nombre: "",
    cliente_id: "",
    descripcion: "",
    notas: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const backlogsData = await query("backlogs", { sort: "created_at", ascending: false });
      const clientesData = await query("clientes", { sort: "nombre", ascending: true });
      setBacklogs((backlogsData || []) as Backlog[]);
      setClientes((clientesData || []) as Cliente[]);
    } catch (error) {
      console.error("Error loading backlogs:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingBacklog(null);
    setFormData({ nombre: "", cliente_nombre: "", cliente_id: "", descripcion: "", notas: "" });
    setShowModal(true);
  }

  function openEditModal(backlog: Backlog) {
    setEditingBacklog(backlog);
    setFormData({
      nombre: backlog.nombre,
      cliente_nombre: backlog.cliente_nombre,
      cliente_id: backlog.cliente_id || "",
      descripcion: backlog.descripcion || "",
      notas: backlog.notas || "",
    });
    setShowModal(true);
  }

  async function handleSaveModal() {
    if (!formData.nombre.trim() || !formData.cliente_nombre.trim()) {
      alert("Nombre del proyecto y cliente son requeridos");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        cliente_nombre: formData.cliente_nombre,
        cliente_id: formData.cliente_id || null,
        descripcion: formData.descripcion,
        notas: formData.notas,
        epicas: editingBacklog?.epicas || [],
      };

      if (editingBacklog) {
        await update("backlogs", editingBacklog.id, payload);
      } else {
        await insert("backlogs", payload);
      }

      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error("Error saving backlog:", error);
      alert("Error al guardar el backlog");
    } finally {
      setSaving(false);
    }
  }

  async function handleClone(backlog: Backlog) {
    const newClientName = prompt("Nuevo nombre del cliente:");
    if (!newClientName?.trim()) return;

    setSaving(true);
    try {
      const payload = {
        nombre: backlog.nombre,
        cliente_nombre: newClientName,
        cliente_id: null,
        descripcion: backlog.descripcion,
        notas: backlog.notas,
        epicas: JSON.parse(JSON.stringify(backlog.epicas)), // Deep clone
      };

      await insert("backlogs", payload);
      await loadData();
    } catch (error) {
      console.error("Error cloning backlog:", error);
      alert("Error al clonar el backlog");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este backlog?")) return;

    setSaving(true);
    try {
      await remove("backlogs", id);
      await loadData();
    } catch (error) {
      console.error("Error deleting backlog:", error);
      alert("Error al eliminar el backlog");
    } finally {
      setSaving(false);
    }
  }

  async function handleExportPDF(backlog: Backlog) {
    try {
      generateBacklogPDF(backlog);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error al generar el PDF");
    }
  }

  async function handleSaveEpicas(backlogId: string, epicas: Epica[]) {
    setSaving(true);
    try {
      await update("backlogs", backlogId, { epicas });
      await loadData();
      setExpandedId(null);
    } catch (error) {
      console.error("Error saving epicas:", error);
      alert("Error al guardar las épicas");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C5CBF]"></div>
          <p className="mt-4 text-sm text-[#52525B] dark:text-[#A1A1AA]">Cargando backlogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#18181B] dark:text-white">Backlogs</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Gestiona los product backlogs de tus proyectos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#7C5CBF] text-white px-6 py-2 rounded-xl hover:bg-[#6B4DAE] transition-all font-medium text-sm active:scale-[0.98]"
        >
          + Nuevo Backlog
        </button>
      </div>

      {backlogs.length === 0 ? (
        <div className="text-center py-16 bg-[#F9F8FF] dark:bg-[#1A1825] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35]">
          <svg className="w-16 h-16 mx-auto text-[#D4CCFF] dark:text-[#3D3357] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          <p className="text-[#52525B] dark:text-[#A1A1AA] font-medium">No hay backlogs aún</p>
          <p className="text-sm text-[#A1A1AA] mt-1">Crea uno nuevo para empezar a gestionar tus proyectos</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F8FF] dark:bg-[#1A1825] border-b border-[#E4E4E7] dark:border-[#2A2A35]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[#52525B] dark:text-[#A1A1AA]">Proyecto</th>
                <th className="px-6 py-3 text-left font-semibold text-[#52525B] dark:text-[#A1A1AA]">Cliente</th>
                <th className="px-6 py-3 text-center font-semibold text-[#52525B] dark:text-[#A1A1AA]">Épicas</th>
                <th className="px-6 py-3 text-center font-semibold text-[#52525B] dark:text-[#A1A1AA]">HUs</th>
                <th className="px-6 py-3 text-left font-semibold text-[#52525B] dark:text-[#A1A1AA]">Fecha</th>
                <th className="px-6 py-3 text-center font-semibold text-[#52525B] dark:text-[#A1A1AA]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#2A2A35]">
              {backlogs.map((backlog) => {
                const totalHUs = backlog.epicas.reduce((sum, e) => sum + e.historias.length, 0);
                const isExpanded = expandedId === backlog.id;

                return (
                  <React.Fragment key={backlog.id}>
                    <tr className="hover:bg-[#F9F8FF] dark:hover:bg-[#1A1825] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#18181B] dark:text-white">{backlog.nombre}</td>
                      <td className="px-6 py-4 text-[#52525B] dark:text-[#A1A1AA]">{backlog.cliente_nombre}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-[#F3EEFF] dark:bg-[#2D1F4D] text-[#7C5CBF] px-3 py-1 rounded-lg text-xs font-semibold">
                          {backlog.epicas.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-[#52525B] dark:text-[#A1A1AA]">{totalHUs}</td>
                      <td className="px-6 py-4 text-xs text-[#A1A1AA]">
                        {backlog.created_at ? new Date(backlog.created_at).toLocaleDateString("es-CL") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : backlog.id)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#7C5CBF] transition-colors"
                            title="Editar épicas"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(backlog)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#52525B] dark:text-[#A1A1AA] transition-colors"
                            title="Editar metadatos"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleExportPDF(backlog)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#52525B] dark:text-[#A1A1AA] transition-colors"
                            title="Exportar PDF"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2m0-8v6m0-6L3 7m9 0l9-4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleClone(backlog)}
                            className="p-1.5 rounded-lg hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] text-[#52525B] dark:text-[#A1A1AA] transition-colors"
                            title="Clonar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(backlog.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-[#F9F8FF] dark:bg-[#1A1825]">
                          <BacklogEditor backlog={backlog} onSave={handleSaveEpicas} saving={saving} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] max-w-lg w-full p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#18181B] dark:text-white">
                {editingBacklog ? "Editar Backlog" : "Nuevo Backlog"}
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-1">Gestiona el nombre y detalles de tu backlog</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="ej: Sistema ERP Hardy"
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Cliente *
                </label>
                <input
                  type="text"
                  value={formData.cliente_nombre}
                  onChange={(e) => setFormData({ ...formData, cliente_nombre: e.target.value })}
                  placeholder="ej: Grúas Hardy"
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción general del proyecto"
                  rows={3}
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181B] dark:text-white mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Notas adicionales"
                  rows={2}
                  className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] transition-all bg-white dark:bg-[#27272A] text-[#18181B] dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[#E4E4E7] dark:border-[#2A2A35]">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#3F3F46] text-[#18181B] dark:text-white hover:bg-[#F9F8FF] dark:hover:bg-[#27272A] transition-all font-medium"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveModal}
                className="flex-1 px-4 py-3 rounded-xl bg-[#7C5CBF] text-white hover:bg-[#6B4DAE] transition-all font-medium disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BacklogEditor Component
// ============================================================================

interface BacklogEditorProps {
  backlog: Backlog;
  onSave: (backlogId: string, epicas: Epica[]) => Promise<void>;
  saving: boolean;
}

function BacklogEditor({ backlog, onSave, saving }: BacklogEditorProps) {
  const [epicas, setEpicas] = useState<Epica[]>(backlog.epicas || []);

  function addEpica() {
    const newEpica: Epica = {
      id: crypto.randomUUID(),
      codigo: `ÉPICA ${epicas.length + 1}`,
      nombre: "",
      historias: [],
    };
    setEpicas([...epicas, newEpica]);
  }

  function updateEpica(id: string, updates: Partial<Epica>) {
    setEpicas(epicas.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }

  function deleteEpica(id: string) {
    setEpicas(epicas.filter((e) => e.id !== id));
  }

  function addHU(epicaId: string) {
    setEpicas(
      epicas.map((e) => {
        if (e.id === epicaId) {
          const newHU: UserStory = {
            id: crypto.randomUUID(),
            codigo: `HU${e.id.slice(0, 2).toUpperCase()}.${e.historias.length + 1}`,
            descripcion: "",
          };
          return { ...e, historias: [...e.historias, newHU] };
        }
        return e;
      })
    );
  }

  function updateHU(epicaId: string, huId: string, updates: Partial<UserStory>) {
    setEpicas(
      epicas.map((e) => {
        if (e.id === epicaId) {
          return {
            ...e,
            historias: e.historias.map((hu) => (hu.id === huId ? { ...hu, ...updates } : hu)),
          };
        }
        return e;
      })
    );
  }

  function deleteHU(epicaId: string, huId: string) {
    setEpicas(
      epicas.map((e) => {
        if (e.id === epicaId) {
          return { ...e, historias: e.historias.filter((hu) => hu.id !== huId) };
        }
        return e;
      })
    );
  }

  return (
    <div className="space-y-4">
      {epicas.map((epica) => (
        <div key={epica.id} className="border border-[#E4E4E7] dark:border-[#3F3F46] rounded-xl p-4 bg-white dark:bg-[#27272A]">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <input
                type="text"
                value={epica.nombre}
                onChange={(e) => updateEpica(epica.id, { nombre: e.target.value })}
                placeholder="Nombre de la épica"
                className="w-full border border-[#E4E4E7] dark:border-[#3F3F46] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] bg-white dark:bg-[#3F3F46] text-[#18181B] dark:text-white"
              />
            </div>
            <button
              onClick={() => deleteEpica(epica.id)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2 ml-3">
            {epica.historias.map((hu) => (
              <div key={hu.id} className="flex items-start gap-2">
                <input
                  type="text"
                  value={hu.codigo}
                  onChange={(e) => updateHU(epica.id, hu.id, { codigo: e.target.value })}
                  placeholder="HU1.1"
                  className="w-20 border border-[#E4E4E7] dark:border-[#3F3F46] rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] bg-white dark:bg-[#3F3F46] text-[#18181B] dark:text-white"
                />
                <textarea
                  value={hu.descripcion}
                  onChange={(e) => updateHU(epica.id, hu.id, { descripcion: e.target.value })}
                  placeholder="Descripción de la historia de usuario"
                  rows={2}
                  className="flex-1 border border-[#E4E4E7] dark:border-[#3F3F46] rounded-lg px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-[#7C5CBF] focus:border-[#7C5CBF] bg-white dark:bg-[#3F3F46] text-[#18181B] dark:text-white"
                />
                <button
                  onClick={() => deleteHU(epica.id, hu.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => addHU(epica.id)}
              className="text-sm text-[#7C5CBF] hover:underline font-medium"
            >
              + Agregar HU
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addEpica}
        className="w-full py-3 rounded-xl border-2 border-dashed border-[#D4CCFF] dark:border-[#3D3357] text-[#7C5CBF] hover:bg-[#F3EEFF] dark:hover:bg-[#2D1F4D] transition-all font-medium text-sm"
      >
        + Agregar Épica
      </button>

      <button
        onClick={() => onSave(backlog.id, epicas)}
        disabled={saving}
        className="w-full py-3 rounded-xl bg-[#7C5CBF] text-white hover:bg-[#6B4DAE] transition-all font-medium disabled:opacity-50 mt-4"
      >
        {saving ? "Guardando..." : "Guardar Épicas"}
      </button>
    </div>
  );
}
