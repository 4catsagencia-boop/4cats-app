"use client";

import { useState, useEffect } from "react";
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { 
  Propuesta, 
  MetricaBenchmark, 
  Ventaja, 
  LinkRecurso,
  METRICAS_ROI_TEMPLATE
} from "@/utils/supabase";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, X, Link as LinkIcon, BarChart3, Star, Zap } from "lucide-react";

interface PropuestaFormProps {
  propuesta?: Propuesta;
  clienteId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

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
  });

  useEffect(() => {
    if (propuesta) {
      setFormData(propuesta);
    }
  }, [propuesta]);

  const generateSlug = (text: string) => {
    const base = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, "")
      .trim()
      .replace(/ +/g, "-");
    
    if (!base) return "";
    
    // Usamos un generador de seed basado en el tiempo para cumplir con React 19 Purity (Contexto Alpha)
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

  const addItem = (type: "metricas" | "ventajas" | "links") => {
    if (type === "metricas") {
      const newItem: MetricaBenchmark = { nombre: "", actual: 0, competidor: 0, propuesta: 0, unidad: "" };
      setFormData({ ...formData, metricas: [...(formData.metricas || []), newItem] });
    } else if (type === "ventajas") {
      const newItem: Ventaja = { icono: "✨", titulo: "", descripcion: "" };
      setFormData({ ...formData, ventajas: [...(formData.ventajas || []), newItem] });
    } else {
      const newItem: LinkRecurso = { label: "", url: "", tipo: "cliente" };
      setFormData({ ...formData, links: [...(formData.links || []), newItem] });
    }
  };

  const removeItem = (type: "metricas" | "ventajas" | "links", index: number) => {
    const list = [...(formData[type] as (MetricaBenchmark | Ventaja | LinkRecurso)[])];
    list.splice(index, 1);
    setFormData({ ...formData, [type]: list });
  };

  const updateItem = (type: "metricas" | "ventajas" | "links", index: number, field: string, value: string | number) => {
    const list = [...(formData[type] as (MetricaBenchmark | Ventaja | LinkRecurso)[])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, [type]: list });
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
