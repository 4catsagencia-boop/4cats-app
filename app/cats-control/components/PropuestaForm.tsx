"use client";

import { useState, useEffect } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { 
  Propuesta, 
  MetricaBenchmark, 
  Ventaja, 
  LinkRecurso,
  RoadmapModule,
  RoadmapItem,
  METRICAS_ROI_TEMPLATE
} from "@/utils/supabase";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, X, Link as LinkIcon, BarChart3, Star, Zap, Shield, ShieldAlert, ListChecks, ChevronDown, ChevronUp } from "lucide-react";

interface PropuestaFormProps {
  propuesta?: Propuesta;
  clienteId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const HARDY_ROADMAP_TEMPLATE: RoadmapModule[] = [
  {
    id: "1", titulo: "Fundación y Arquitectura", items: [
      { id: "1.1", titulo: "Arquitectura del Proyecto y Modelamiento de Datos", descripcion: "Diseño de la arquitectura, interfaces, DB y configuraciones iniciales.", fases: "1" },
      { id: "1.2", titulo: "Conexión con Base de Datos", descripcion: "Asegurar almacenamiento, consulta y edición de registros.", fases: "1" },
      { id: "1.3", titulo: "Autenticación y Control de Acceso", descripcion: "Sesiones, roles y restricciones de acceso.", fases: "1" },
      { id: "1.4", titulo: "Creación de vistas iniciales", descripcion: "Login, home y barra de menú.", fases: "1" }
    ]
  },
  {
    id: "2", titulo: "Administración de Recursos y Activos", items: [
      { id: "2.1", titulo: "Mantenedor de Usuarios y Roles", descripcion: "CRUD completo de usuarios del sistema.", fases: "2" },
      { id: "2.2", titulo: "Mantenedor de Grúas y Patentes", descripcion: "Gestión de flota de grúas.", fases: "2" },
      { id: "2.3", titulo: "Panel de Mantenimiento", descripcion: "Tablas de monitoreo y gestión de servicios técnicos.", fases: "2" }
    ]
  },
  {
    id: "3", titulo: "Core Operacional y Logística", items: [
      { id: "3.1", titulo: "Módulo de Solicitudes", descripcion: "Flujo de atención e ingreso por formulario.", fases: "3" },
      { id: "3.2", titulo: "Módulo de Agendamiento", descripcion: "Programación y gestión de citas.", fases: "3" },
      { id: "3.3", titulo: "Módulo de Logística", descripcion: "Trazabilidad y visualización de disponibilidad.", fases: "3" },
      { id: "3.4", titulo: "Lógica de validación de disponibilidad", descripcion: "Motor de reglas de negocio para asignaciones.", fases: "3" }
    ]
  },
  {
    id: "4", titulo: "Ejecución App Móvil y Tracking", items: [
      { id: "4.1", titulo: "App del Conductor", descripcion: "Gestión de servicios asignados, captura de evidencia.", fases: "4" },
      { id: "4.2", titulo: "Tracking Actualizado", descripcion: "Ubicación en tiempo real del conductor.", fases: "4" },
      { id: "4.3", titulo: "Vista de Cliente Externo", descripcion: "Seguimiento del mapa por el cliente final.", fases: "4" },
      { id: "4.4", titulo: "Notificaciones Push", descripcion: "Alertas críticas en tiempo real.", fases: "4" }
    ]
  },
  {
    id: "5", titulo: "Administración Final y Cierre", items: [
      { id: "5.1", titulo: "Panel / Dashboard KPIs", descripcion: "Métricas gerenciales clave.", fases: "5" },
      { id: "5.2", titulo: "Registro Histórico", descripcion: "Historial completo con filtros avanzados.", fases: "5" },
      { id: "5.3", titulo: "Módulo de Aseguradora", descripcion: "Gestión documental para seguros.", fases: "5" },
      { id: "5.4", titulo: "Integración de Whatsapp / Email", descripcion: "Automatización de avisos a clientes.", fases: "5" },
      { id: "5.5", titulo: "Revisión final", descripcion: "Despliegue y validación total.", fases: "5" }
    ]
  }
];

export default function PropuestaForm({ propuesta, clienteId, onSuccess, onCancel }: PropuestaFormProps) {
  const [loading, setLoading] = useState(false);
  const adminDB = useAdminDB();
  const [formData, setFormData] = useState<Partial<Propuesta>>({
    cliente_id: clienteId,
    titulo: "",
    subtitulo: "",
    slug: "",
    estado: "borrador",
    problema: "",
    competidor_nombre: "",
    competidor_url: "",
    solucion_titulo: "",
    solucion_descripcion: "",
    metricas: [],
    ventajas: [],
    links: [],
    roadmap: [],
  });

  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (propuesta) {
      setFormData(propuesta);
    }
  }, [propuesta]);

  const toggleModule = (idx: number) => {
    setExpandedModules(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const generateSlug = (text: string) => {
    const base = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, "")
      .trim()
      .replace(/ +/g, "-");
    
    if (!base) return "";
    
    const seed = Date.now();
    const hash = ((seed * 1103515245 + 12345) & 0x7fffffff).toString(36).substring(0, 6);
    return `${base}-${hash}`;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titulo = e.target.value;
    if (propuesta) {
      setFormData({ ...formData, titulo });
    } else {
      setFormData({ ...formData, titulo, slug: generateSlug(titulo) });
    }
  };

  const loadRoiTemplate = () => {
    setFormData({
      ...formData,
      metricas: [...METRICAS_ROI_TEMPLATE]
    });
  };

  const loadHardyRoadmap = () => {
    if (confirm("¿Cargar el Roadmap de Hardy como plantilla? Se borrará lo que tengas.")) {
      setFormData({
        ...formData,
        roadmap: JSON.parse(JSON.stringify(HARDY_ROADMAP_TEMPLATE))
      });
    }
  };

  const addItem = (type: "metricas" | "ventajas" | "links" | "roadmap") => {
    if (type === "metricas") {
      const newItem: MetricaBenchmark = { nombre: "", actual: 0, competidor: 0, propuesta: 0, unidad: "" };
      setFormData({ ...formData, metricas: [...(formData.metricas || []), newItem] });
    } else if (type === "ventajas") {
      const newItem: Ventaja = { icono: "✨", titulo: "", descripcion: "" };
      setFormData({ ...formData, ventajas: [...(formData.ventajas || []), newItem] });
    } else if (type === "links") {
      const newItem: LinkRecurso = { label: "", url: "", tipo: "cliente" };
      setFormData({ ...formData, links: [...(formData.links || []), newItem] });
    } else if (type === "roadmap") {
      const newModule: RoadmapModule = { id: (formData.roadmap?.length || 0 + 1).toString(), titulo: "Nuevo Módulo", items: [] };
      setFormData({ ...formData, roadmap: [...(formData.roadmap || []), newModule] });
    }
  };

  const addRoadmapItem = (moduleIdx: number) => {
    const roadmap = [...(formData.roadmap || [])];
    const mod = roadmap[moduleIdx];
    const newItem: RoadmapItem = { 
      id: `${mod.id}.${mod.items.length + 1}`, 
      titulo: "", 
      descripcion: "", 
      fases: "" 
    };
    mod.items.push(newItem);
    setFormData({ ...formData, roadmap });
  };

  const removeItem = (type: "metricas" | "ventajas" | "links" | "roadmap", index: number) => {
    const list = [...(formData[type] as any[])];
    list.splice(index, 1);
    setFormData({ ...formData, [type]: list });
  };

  const removeRoadmapItem = (moduleIdx: number, itemIdx: number) => {
    const roadmap = [...(formData.roadmap || [])];
    roadmap[moduleIdx].items.splice(itemIdx, 1);
    setFormData({ ...formData, roadmap });
  };

  const updateItem = (type: "metricas" | "ventajas" | "links", index: number, field: string, value: string | number) => {
    const list = [...(formData[type] as (MetricaBenchmark | Ventaja | LinkRecurso)[])];
    (list[index] as any)[field] = value;
    setFormData({ ...formData, [type]: list });
  };

  const updateRoadmapModule = (idx: number, field: keyof RoadmapModule, value: string) => {
    const roadmap = [...(formData.roadmap || [])];
    (roadmap[idx] as any)[field] = value;
    setFormData({ ...formData, roadmap });
  };

  const updateRoadmapItem = (moduleIdx: number, itemIdx: number, field: keyof RoadmapItem, value: string) => {
    const roadmap = [...(formData.roadmap || [])];
    (roadmap[moduleIdx].items[itemIdx] as any)[field] = value;
    setFormData({ ...formData, roadmap });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (propuesta?.id) {
        await adminDB.update("propuestas", propuesta.id, formData);
      } else {
        await adminDB.insert("propuestas", formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving propuesta:", error);
      alert("Error al guardar la propuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[#0F0F12] p-6 sm:p-8 rounded-3xl border border-[#E4E4E7] dark:border-[#2A2A35]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#18181B] dark:text-white">
          {propuesta ? "Editar Propuesta" : "Nueva Propuesta"}
        </h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1A1A20] rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        )}
      </div>

      {/* Información Básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Título del Proyecto *</label>
          <input
            type="text"
            required
            value={formData.titulo}
            onChange={handleTitleChange}
            className="w-full px-5 py-3 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-4 focus:ring-[#7C5CBF]/10 outline-none transition-all text-lg font-medium placeholder:text-gray-400/40"
            placeholder="Ej: Transformación Digital 4cats"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">URL Amigable (Slug)</label>
          <div className="flex items-center px-5 py-3 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-gray-50 dark:bg-[#16161D]/50 focus-within:ring-4 focus-within:ring-[#7C5CBF]/10 transition-all">
            <span className="text-gray-400/50 text-sm flex-shrink-0 select-none">4cats.cl/propuesta/</span>
            <input 
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="flex-1 bg-transparent outline-none text-sm font-mono dark:text-white ml-0.5"
              placeholder="url-de-la-propuesta"
            />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Subtítulo / Bajada</label>
          <input
            type="text"
            value={formData.subtitulo}
            onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-4 focus:ring-[#7C5CBF]/10 outline-none transition-all placeholder:text-gray-400/40"
            placeholder="Breve descripción del alcance estratégico"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
          <select
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as Propuesta['estado'] })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-2 focus:ring-[#7C5CBF] outline-none transition-all"
          >
            <option value="borrador">Borrador</option>
            <option value="enviada">Enviada</option>
            <option value="vista">Vista</option>
            <option value="aprobada">Aprobada</option>
          </select>
        </div>
      </div>

      <hr className="border-[#E4E4E7] dark:border-[#2A2A35]" />

      {/* Roadmap / Backlog */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#7C5CBF]" />
            Roadmap del Proyecto (Backlog)
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadHardyRoadmap}
              className="bg-[#7C5CBF]/10 text-[#7C5CBF] px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-[#7C5CBF]/20 transition-all flex items-center gap-1"
            >
              <Zap className="w-3 h-3 fill-current" /> Cargar Roadmap Hardy
            </button>
            <button
              type="button"
              onClick={() => addItem("roadmap")}
              className="text-sm font-medium text-[#7C5CBF] hover:text-[#6B4DAE] flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar Módulo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {formData.roadmap?.map((module, mIdx) => (
            <div key={mIdx} className="border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden bg-gray-50/30 dark:bg-[#16161D]/20">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#1A1A22]">
                <input
                  value={module.id}
                  onChange={(e) => updateRoadmapModule(mIdx, "id", e.target.value)}
                  className="w-12 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-2 py-1 text-xs font-bold text-center"
                  placeholder="ID"
                />
                <input
                  value={module.titulo}
                  onChange={(e) => updateRoadmapModule(mIdx, "titulo", e.target.value)}
                  className="flex-1 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1 text-sm font-bold"
                  placeholder="Título del Módulo"
                />
                <button
                  type="button"
                  onClick={() => toggleModule(mIdx)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {expandedModules[mIdx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeItem("roadmap", mIdx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {(expandedModules[mIdx] || true) && (
                <div className="p-4 space-y-4">
                  {module.items.map((item, iIdx) => (
                    <div key={iIdx} className="grid grid-cols-12 gap-3 p-4 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl relative group">
                      <div className="col-span-1">
                        <input
                          value={item.id}
                          onChange={(e) => updateRoadmapItem(mIdx, iIdx, "id", e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#16161D] border border-transparent rounded-lg px-2 py-1 text-[10px] font-mono text-center"
                          placeholder="ID"
                        />
                      </div>
                      <div className="col-span-11 space-y-2">
                        <div className="flex gap-2">
                          <input
                            value={item.titulo}
                            onChange={(e) => updateRoadmapItem(mIdx, iIdx, "titulo", e.target.value)}
                            className="flex-1 bg-gray-50 dark:bg-[#16161D] border border-transparent focus:border-[#7C5CBF] rounded-lg px-3 py-1 text-sm font-bold outline-none"
                            placeholder="Nombre de la funcionalidad"
                          />
                          <input
                            value={item.fases}
                            onChange={(e) => updateRoadmapItem(mIdx, iIdx, "fases", e.target.value)}
                            className="w-24 bg-gray-50 dark:bg-[#16161D] border border-transparent rounded-lg px-3 py-1 text-xs text-center"
                            placeholder="Fase (ej: 1)"
                          />
                          <button
                            type="button"
                            onClick={() => removeRoadmapItem(mIdx, iIdx)}
                            className="p-1.5 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={item.descripcion}
                          onChange={(e) => updateRoadmapItem(mIdx, iIdx, "descripcion", e.target.value)}
                          rows={2}
                          className="w-full bg-gray-50 dark:bg-[#16161D] border border-transparent focus:border-[#7C5CBF] rounded-lg px-3 py-1.5 text-xs outline-none resize-none"
                          placeholder="Descripción detallada, notas técnicas, etc."
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addRoadmapItem(mIdx)}
                    className="w-full py-2 border-2 border-dashed border-[#E4E4E7] dark:border-[#2A2A35] rounded-2xl text-xs font-bold text-gray-400 hover:text-[#7C5CBF] hover:border-[#7C5CBF] transition-all"
                  >
                    + Agregar ítem al módulo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[#E4E4E7] dark:border-[#2A2A35]" />

      {/* Contexto y Problema */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-sm">⚠️</span>
          Problema y Competencia
        </h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Definición del Problema</label>
          <textarea
            value={formData.problema}
            onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-2 focus:ring-[#7C5CBF] outline-none transition-all placeholder:text-gray-400/40"
            placeholder="¿Qué dolor estamos resolviendo?"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Competidor</label>
            <input
              type="text"
              value={formData.competidor_nombre}
              onChange={(e) => setFormData({ ...formData, competidor_nombre: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-2 focus:ring-[#7C5CBF] outline-none transition-all placeholder:text-gray-400/40"
              placeholder="Ej: Agencia X"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL del Competidor</label>
            <input
              type="url"
              value={formData.competidor_url}
              onChange={(e) => setFormData({ ...formData, competidor_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-2 focus:ring-[#7C5CBF] outline-none transition-all placeholder:text-gray-400/40"
              placeholder="https://competidor.com"
            />
          </div>
        </div>
      </div>

      <hr className="border-[#E4E4E7] dark:border-[#2A2A35]" />

      {/* Solución */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-sm">💡</span>
          Nuestra Solución
        </h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título de la Solución</label>
          <input
            type="text"
            value={formData.solucion_titulo}
            onChange={(e) => setFormData({ ...formData, solucion_titulo: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-2 focus:ring-[#7C5CBF] outline-none transition-all placeholder:text-gray-400/40"
            placeholder="Ej: Ecosistema Digital Escalable"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción detallada</label>
          <textarea
            value={formData.solucion_descripcion}
            onChange={(e) => setFormData({ ...formData, solucion_descripcion: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-2 focus:ring-[#7C5CBF] outline-none transition-all placeholder:text-gray-400/40"
            placeholder="Explicá cómo vamos a resolver el problema..."
          />
        </div>
      </div>

      {/* Métricas / Benchmarking */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#7C5CBF]" />
            Métricas de Benchmarking
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadRoiTemplate}
              className="bg-[#7C5CBF]/10 text-[#7C5CBF] px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-[#7C5CBF]/20 transition-all flex items-center gap-1"
            >
              <Zap className="w-3 h-3 fill-current" /> Cargar ROI
            </button>
            <button
              type="button"
              onClick={() => addItem("metricas")}
              className="text-sm font-medium text-[#7C5CBF] hover:text-[#6B4DAE] flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar métrica
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {formData.metricas?.map((m, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-gray-50/50 dark:bg-[#16161D]/30 relative group"
            >
              <input
                placeholder="Nombre (ej: Velocidad)"
                value={m.nombre}
                onChange={(e) => updateItem("metricas", idx, "nombre", e.target.value)}
                className="col-span-1 sm:col-span-1 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
              />
              <input
                type="number"
                placeholder="Actual"
                value={m.actual}
                onChange={(e) => updateItem("metricas", idx, "actual", Number(e.target.value))}
                className="col-span-1 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
              />
              <input
                type="number"
                placeholder="Competidor"
                value={m.competidor}
                onChange={(e) => updateItem("metricas", idx, "competidor", Number(e.target.value))}
                className="col-span-1 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
              />
              <input
                type="number"
                placeholder="Propuesta"
                value={m.propuesta}
                onChange={(e) => updateItem("metricas", idx, "propuesta", Number(e.target.value))}
                className="col-span-1 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
              />
              <div className="flex gap-2">
                <input
                  placeholder="Unidad (ej: %)"
                  value={m.unidad}
                  onChange={(e) => updateItem("metricas", idx, "unidad", e.target.value)}
                  className="flex-1 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
                />
                <button
                  type="button"
                  onClick={() => removeItem("metricas", idx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ventajas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-[#7C5CBF]" />
            Ventajas Diferenciales
          </h3>
          <button
            type="button"
            onClick={() => addItem("ventajas")}
            className="text-sm font-medium text-[#7C5CBF] hover:text-[#6B4DAE] flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Agregar ventaja
          </button>
        </div>
        <div className="space-y-3">
          {formData.ventajas?.map((v, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className="flex gap-3 p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-gray-50/50 dark:bg-[#16161D]/30"
            >
              <input
                placeholder="Emoji"
                value={v.icono}
                onChange={(e) => updateItem("ventajas", idx, "icono", e.target.value)}
                className="w-16 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-center placeholder:text-gray-400/40"
              />
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Título de la ventaja"
                  value={v.titulo}
                  onChange={(e) => updateItem("ventajas", idx, "titulo", e.target.value)}
                  className="w-full bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm font-medium placeholder:text-gray-400/40"
                />
                <input
                  placeholder="Descripción corta"
                  value={v.descripcion}
                  onChange={(e) => updateItem("ventajas", idx, "descripcion", e.target.value)}
                  className="w-full bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem("ventajas", idx)}
                className="self-start p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#7C5CBF]" />
            Recursos y Links
          </h3>
          <button
            type="button"
            onClick={() => addItem("links")}
            className="text-sm font-medium text-[#7C5CBF] hover:text-[#6B4DAE] flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Agregar link
          </button>
        </div>
        <div className="space-y-3">
          {formData.links?.map((l, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className="flex flex-wrap sm:flex-nowrap gap-3 p-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-gray-50/50 dark:bg-[#16161D]/30"
            >
              <input
                placeholder="Etiqueta (ej: Ver Prototipo)"
                value={l.label}
                onChange={(e) => updateItem("links", idx, "label", e.target.value)}
                className="flex-1 min-w-[150px] bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
              />
              <input
                type="url"
                placeholder="https://..."
                value={l.url}
                onChange={(e) => updateItem("links", idx, "url", e.target.value)}
                className="flex-[2] min-w-[200px] bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm placeholder:text-gray-400/40"
              />
              <select
                value={l.tipo}
                onChange={(e) => updateItem("links", idx, "tipo", e.target.value)}
                className="w-32 bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="cliente">Cliente</option>
                <option value="competidor">Competidor</option>
                <option value="prototipo">Prototipo</option>
                <option value="reporte">Reporte</option>
              </select>
              <button
                type="button"
                onClick={() => removeItem("links", idx)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#7C5CBF] text-white py-3 rounded-2xl font-bold shadow-lg shadow-[#7C5CBF]/20 hover:bg-[#6B4DAE] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Guardando..." : <><Save className="w-5 h-5" /> Guardar Propuesta</>}
        </button>
      </div>
    </form>
  );
}
