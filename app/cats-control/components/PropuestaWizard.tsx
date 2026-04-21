"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Smartphone, 
  FolderOpen, 
  Settings, 
  Cloud, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  X, 
  ExternalLink, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Info,
  Zap,
  Layout,
  BarChart3,
  Star,
  Link as LinkIcon
} from "lucide-react";
import { 
  Propuesta, 
  MetricaBenchmark, 
  Ventaja, 
  LinkRecurso, 
  insertPropuesta,
  METRICAS_ROI_TEMPLATE,
  METRIC_HIGHER_IS_BETTER
} from "@/utils/supabase";

interface PropuestaWizardProps {
  clienteId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TIPOS_PROPUESTA = [
  { id: 'web', icon: Globe, label: 'Web', desc: 'Análisis PageSpeed, SEO, competencia', active: true },
  { id: 'app', icon: Smartphone, label: 'App', desc: 'Store ratings, performance, UX', active: false },
  { id: 'crm', icon: FolderOpen, label: 'CRM', desc: 'Gestión de clientes y ventas', active: false },
  { id: 'erp', icon: Settings, label: 'ERP', desc: 'Procesos internos y eficiencia', active: false },
  { id: 'saas', icon: Cloud, label: 'SaaS', desc: 'Métricas de producto y retención', active: false },
];

const VENTAJAS_PREDEFINIDAS: Ventaja[] = [
  { icono: "🚀", titulo: "SEO Orgánico", descripcion: "Métrica perfecta 100/100 como señal de calidad para Google, aumentando la probabilidad de primera posición." },
  { icono: "📲", titulo: "Mayor Conversión", descripcion: "Botón de contacto persistente en móvil, reduciendo la fricción al solicitar el servicio." },
  { icono: "📶", titulo: "Retención en Zonas Críticas", descripcion: "Carga instantánea en áreas rurales o rutas interurbanas con conectividad inestable." },
  { icono: "💰", titulo: "Menor Costo en Ads", descripcion: "Quality Score óptimo reduce el Costo Por Clic en Google Ads maximizando el ROI." }
];

export default function PropuestaWizard({ clienteId, onSuccess, onCancel }: PropuestaWizardProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Propuesta>>({
    cliente_id: clienteId,
    tipo: 'web',
    estado: 'borrador',
    titulo: '',
    subtitulo: '',
    slug: '',
    problema: '',
    competidor_nombre: '',
    competidor_url: '',
    solucion_titulo: '',
    solucion_descripcion: '',
    metricas: [...METRICAS_ROI_TEMPLATE],
    ventajas: [],
    links: []
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const generateSlug = (text: string) => {
    const base = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, "")
      .trim()
      .replace(/ +/g, "-");
    
    if (!base) return "";
    
    // Generamos un hash corto de 6 caracteres para seguridad por obscuridad
    const hash = Math.random().toString(36).substring(2, 8);
    return `${base}-${hash}`;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Establecer expiración por defecto (7 días) si no tiene una
      const finalData = { ...formData };
      if (!finalData.expira_at) {
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + 7);
        finalData.expira_at = expDate.toISOString();
      }

      await insertPropuesta(finalData);
      onSuccess();
    } catch (error) {
      console.error("Error guardando propuesta:", error);
      alert("Hubo un error al guardar. Revisá la consola.");
    } finally {
      setLoading(false);
    }
  };

  const HelpPanel = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-[#F3EEFF] dark:bg-[#1C1630] border-l-4 border-[#7C5CBF] p-5 rounded-r-2xl h-fit">
      <h4 className="font-bold text-[#7C5CBF] flex items-center gap-2 mb-2">
        <Info className="w-4 h-4" /> {title}
      </h4>
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-[#0F0F12] w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#E4E4E7] dark:border-[#2A2A35]"
      >
        {/* Header con Progreso */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#18181B] dark:text-white flex items-center gap-2">
                <Zap className="text-[#7C5CBF] fill-[#7C5CBF]" /> 
                Constructor de Propuesta
              </h2>
              <p className="text-gray-500 text-sm">Paso {step + 1} de 7: {getStepTitle(step)}</p>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1A1A20] rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="w-full h-2 bg-gray-100 dark:bg-[#1A1A20] rounded-full overflow-hidden">
            <motion.div 
              initial={false}
              animate={{ width: `${((step + 1) / 7) * 100}%` }}
              className="h-full bg-[#7C5CBF] shadow-[0_0_10px_rgba(124,92,191,0.5)]"
            />
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {renderStep(step, formData, setFormData, generateSlug, HelpPanel)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer de Navegación */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-[#16161D]/50 border-t border-[#E4E4E7] dark:border-[#2A2A35] flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="px-6 py-3 rounded-2xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2A2A35] transition-all flex items-center gap-2 disabled:opacity-0"
          >
            <ChevronLeft className="w-5 h-5" /> Anterior
          </button>

          {step < 6 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(step, formData)}
              className="px-10 py-3 bg-[#7C5CBF] text-white rounded-2xl font-bold shadow-lg shadow-[#7C5CBF]/20 hover:bg-[#6B4DAE] transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              Siguiente <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-10 py-3 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all flex items-center gap-2"
            >
              {loading ? "Guardando..." : <><Save className="w-5 h-5" /> Finalizar y Guardar</>}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// For each metric: true = higher is better, false = lower is better
const METRIC_HIGHER_IS_BETTER: Record<string, boolean> = {
  'PageSpeed Mobile':    true,
  'PageSpeed Desktop':   true,
  'CTR (Click-to-Call)': true,
  'Tasa Conversión':     true,
  'Engagement Rate':     true,
  'Scroll Depth':        true,
  'Ranking Keywords':    false,
  'Visibilidad Maps':    true,
  'Autoridad Dominio':   true,
  'Uptime (24/7)':       true,
  'Accesibilidad (A11y)': true,
  'Security Score':      true,
  'Tiempo Tarea Crítica': false,
  'Costo por Lead':      false,
  'FCP (mobile)':        false,
  'LCP (mobile)':        false,
  'TBT (mobile)':        false,
  'CLS (mobile)':        false,
  'Speed Index (mobile)':false,
};

function scoreColor(val: number, ref: number, higherBetter: boolean) {
  if (val === 0 && ref === 0) return '';
  const wins = higherBetter ? val > ref : val < ref;
  const ties = val === ref;
  if (ties) return 'text-yellow-600 dark:text-yellow-400';
  return wins ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400';
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const clamp = Math.min(Math.max(score, 0), 100);
  const r = 28; const circ = 2 * Math.PI * r;
  const dash = (clamp / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="rotate-[-90deg]" width="80" height="80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="7" className="text-gray-100 dark:text-[#2A2A35]" />
          <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="7"
            className={color}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-black dark:text-white">{score}</span>
      </div>
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center leading-tight">{label}</span>
    </div>
  );
}

function BenchmarkingStep({ data, setData, Help }: { data: Partial<Propuesta>; setData: (d: Partial<Propuesta>) => void; Help: React.ComponentType<{ title: string; children: React.ReactNode }> }) {
  const [urls, setUrls] = useState({ actual: '', competidor: '', propuesta: '' });
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const analizar = async (campo: 'actual' | 'competidor' | 'propuesta') => {
    const url = urls[campo];
    if (!url) return;
    setAnalyzing(campo);
    setErrors(e => ({ ...e, [campo]: '' }));
    try {
      const [mobile, desktop] = await Promise.all([
        fetch(`/api/pagespeed?url=${encodeURIComponent(url)}&strategy=mobile`).then(r => r.json()),
        fetch(`/api/pagespeed?url=${encodeURIComponent(url)}&strategy=desktop`).then(r => r.json()),
      ]);
      if (mobile.error) throw new Error(mobile.error);

      const fill: Record<string, number | null> = {
        'PageSpeed Mobile':    mobile.score,
        'PageSpeed Desktop':   desktop.score ?? null,
        'FCP (mobile)':        mobile.metrics?.fcp ?? null,
        'LCP (mobile)':        mobile.metrics?.lcp ?? null,
        'TBT (mobile)':        mobile.metrics?.tbt ?? null,
        'CLS (mobile)':        mobile.metrics?.cls ?? null,
        'Speed Index (mobile)':mobile.metrics?.speedIndex ?? null,
      };

      const newM = (data.metricas || []).map(m => {
        const val = fill[m.nombre];
        return val != null ? { ...m, [campo]: val } : m;
      });
      setData({ ...data, metricas: newM });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al analizar';
      setErrors(e => ({ ...e, [campo]: msg }));
    } finally {
      setAnalyzing(null);
    }
  };

  const CAMPOS = [
    { key: 'actual' as const, label: 'URL del Cliente', placeholder: 'https://gruashardy.cl', color: 'text-gray-500' },
    { key: 'competidor' as const, label: 'URL del Competidor', placeholder: 'https://servigrua.cl', color: 'text-red-500' },
    { key: 'propuesta' as const, label: 'URL del Prototipo', placeholder: 'https://mi-prototipo.netlify.app', color: 'text-[#7C5CBF]' },
  ];

  const mobileScore = (campo: 'actual' | 'competidor' | 'propuesta') =>
    data.metricas?.find(m => m.nombre === 'PageSpeed Mobile')?.[campo] ?? 0;

  const hasResults = (data.metricas || []).some(m => m.actual > 0 || m.competidor > 0 || m.propuesta > 0);

  const actualScore = mobileScore('actual');
  const propuestaScore = mobileScore('propuesta');
  const mejora = actualScore > 0 && propuestaScore > 0
    ? Math.round(((propuestaScore - actualScore) / actualScore) * 100)
    : null;

  return (
    <div className="space-y-6">
      <Help title="⚡ Análisis automático de PageSpeed">
        <p>Ingresá las URLs y hacé click en <strong>Analizar</strong>. El sistema obtiene los scores de Google y llena la tabla automáticamente.</p>
        <p className="text-xs opacity-70">Requiere <code>PAGESPEED_API_KEY</code> en .env.local</p>
      </Help>

      <div className="space-y-3">
        {CAMPOS.map(({ key, label, placeholder, color }) => (
          <div key={key} className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</label>
              <input
                type="url"
                value={urls[key]}
                onChange={e => setUrls(u => ({ ...u, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] placeholder:text-gray-400/40"
              />
              {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
            </div>
            <button
              onClick={() => analizar(key)}
              disabled={!urls[key] || analyzing === key}
              className="px-5 py-3 bg-[#7C5CBF] text-white rounded-xl font-bold text-sm hover:bg-[#6B4DAE] disabled:opacity-40 transition-all whitespace-nowrap flex items-center gap-2"
            >
              {analyzing === key ? (
                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analizando</>
              ) : 'Analizar'}
            </button>
          </div>
        ))}
      </div>

      {hasResults && (
        <div className="rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] overflow-hidden">
          {/* Score cards */}
          <div className="grid grid-cols-3 divide-x divide-[#E4E4E7] dark:divide-[#2A2A35] bg-gray-50 dark:bg-[#16161D]/50 p-6">
            <div className="flex flex-col items-center gap-3 px-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente actual</p>
              <ScoreRing score={mobileScore('actual')} label="PageSpeed Mobile" color="text-gray-400" />
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Competidor</p>
              <ScoreRing score={mobileScore('competidor')} label="PageSpeed Mobile" color="text-red-400" />
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
              <p className="text-xs font-bold text-[#7C5CBF] uppercase tracking-widest">Nuestra propuesta</p>
              <ScoreRing score={mobileScore('propuesta')} label="PageSpeed Mobile" color="text-[#7C5CBF]" />
            </div>
          </div>

          {/* Insight banner */}
          {mejora !== null && (
            <div className={`px-6 py-3 flex items-center gap-3 text-sm font-bold ${
              mejora > 0
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              <Zap className="w-4 h-4 flex-shrink-0" />
              {mejora > 0
                ? `Tu prototipo mejora el rendimiento del cliente en un ${mejora}% — argumento sólido para la propuesta.`
                : `El prototipo aún no supera al cliente. Hay trabajo por hacer antes de presentar.`}
            </div>
          )}

          {/* Metrics table */}
          <div className="divide-y divide-[#E4E4E7] dark:divide-[#2A2A35]">
            <div className="grid grid-cols-4 px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white dark:bg-[#0F0F12]">
              <span>Métrica</span>
              <span className="text-center">Cliente</span>
              <span className="text-center text-red-400">Competidor</span>
              <span className="text-center text-[#7C5CBF]">Propuesta</span>
            </div>
            {data.metricas?.map((m, idx) => {
              const higherBetter = METRIC_HIGHER_IS_BETTER[m.nombre] ?? true;
              const propuestaVsActual = scoreColor(m.propuesta, m.actual, higherBetter);
              return (
                <div key={idx} className="grid grid-cols-4 px-4 py-3 items-center bg-white dark:bg-[#0F0F12] hover:bg-gray-50 dark:hover:bg-[#16161D]/30 transition-colors">
                  <span className="text-sm font-medium dark:text-gray-300">{m.nombre || '—'}</span>
                  <span className="text-center text-sm text-gray-500 font-mono">{m.actual}{m.unidad}</span>
                  <span className="text-center text-sm text-red-400 font-mono">{m.competidor}{m.unidad}</span>
                  <span className={`text-center text-sm font-bold font-mono ${propuestaVsActual}`}>
                    {m.propuesta}{m.unidad}
                    {m.propuesta > 0 && m.actual > 0 && (
                      <span className="ml-1 text-[10px]">
                        {higherBetter
                          ? (m.propuesta > m.actual ? '↑' : m.propuesta < m.actual ? '↓' : '=')
                          : (m.propuesta < m.actual ? '↑' : m.propuesta > m.actual ? '↓' : '=')}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Editable raw table (collapsed when results visible) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 text-sm text-gray-400"><BarChart3 className="w-4 h-4" /> Editar métricas manualmente</h3>
          <button
            onClick={() => setData({ ...data, metricas: [...(data.metricas || []), { nombre: '', actual: 0, competidor: 0, propuesta: 0, unidad: '' }] })}
            className="text-[#7C5CBF] font-bold text-xs flex items-center gap-1 hover:bg-[#F3EEFF] px-3 py-1 rounded-lg"
          >
            <Plus className="w-3 h-3" /> Agregar
          </button>
        </div>
        {data.metricas?.map((m, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 dark:bg-[#16161D]/30 rounded-xl border border-gray-100 dark:border-[#2A2A35]">
            <input placeholder="Métrica" value={m.nombre}
              onChange={e => { const n = data.metricas!.map((x, i) => i === idx ? { ...x, nombre: e.target.value } : x); setData({ ...data, metricas: n }); }}
              className="col-span-1 px-3 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-sm" />
            <input type="number" placeholder="Cliente" value={m.actual}
              onChange={e => { const n = data.metricas!.map((x, i) => i === idx ? { ...x, actual: Number(e.target.value) } : x); setData({ ...data, metricas: n }); }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-sm text-gray-500" />
            <input type="number" placeholder="Competidor" value={m.competidor}
              onChange={e => { const n = data.metricas!.map((x, i) => i === idx ? { ...x, competidor: Number(e.target.value) } : x); setData({ ...data, metricas: n }); }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-sm text-red-400" />
            <input type="number" placeholder="Propuesta" value={m.propuesta}
              onChange={e => { const n = data.metricas!.map((x, i) => i === idx ? { ...x, propuesta: Number(e.target.value) } : x); setData({ ...data, metricas: n }); }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-sm font-bold text-[#7C5CBF]" />
            <div className="flex gap-1">
              <input placeholder="/100" value={m.unidad}
                onChange={e => { const n = data.metricas!.map((x, i) => i === idx ? { ...x, unidad: e.target.value } : x); setData({ ...data, metricas: n }); }}
                className="flex-1 px-2 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-xs" />
              <button onClick={() => setData({ ...data, metricas: data.metricas?.filter((_, i) => i !== idx) })}
                className="p-2 text-red-400 hover:bg-red-50 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStepTitle(step: number) {
  const titles = ["Selección de Tipo", "Información Básica", "Análisis del Problema", "Métricas de Performance", "Solución y Ventajas", "Recursos y Links", "Confirmación"];
  return titles[step];
}

function isStepValid(step: number, formData: Partial<Propuesta>) {
  if (step === 0) return !!formData.tipo;
  if (step === 1) return !!formData.titulo && !!formData.slug;
  if (step === 2) return !!formData.problema && !!formData.competidor_nombre;
  return true;
}

function renderStep(
  step: number, 
  data: Partial<Propuesta>, 
  setData: any, 
  genSlug: any,
  Help: any
) {
  switch(step) {
    case 0:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPOS_PROPUESTA.map((t) => (
            <button
              key={t.id}
              disabled={!t.active}
              onClick={() => setData({ ...data, tipo: t.id as any })}
              className={`p-6 rounded-3xl border-2 text-left transition-all relative group ${
                data.tipo === t.id 
                  ? 'border-[#7C5CBF] bg-[#F3EEFF] dark:bg-[#1C1630]' 
                  : t.active ? 'border-gray-100 dark:border-[#2A2A35] hover:border-[#7C5CBF]/50' : 'opacity-50 grayscale cursor-not-allowed'
              }`}
            >
              {!t.active && (
                <span className="absolute top-4 right-4 bg-gray-200 dark:bg-[#2A2A35] text-[10px] font-bold px-2 py-1 rounded-full text-gray-500 uppercase tracking-widest">Próximamente</span>
              )}
              {data.tipo === t.id && (
                <div className="absolute top-4 right-4 bg-[#7C5CBF] p-1 rounded-full text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              <t.icon className={`w-10 h-10 mb-4 ${data.tipo === t.id ? 'text-[#7C5CBF]' : 'text-gray-400'}`} />
              <h3 className="text-lg font-bold mb-1 dark:text-white">{t.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.desc}</p>
            </button>
          ))}
        </div>
      );

    case 1:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Título del Proyecto *</label>
              <input 
                type="text"
                autoFocus
                value={data.titulo}
                onChange={(e) => setData({ ...data, titulo: e.target.value, slug: genSlug(e.target.value) })}
                className="w-full px-5 py-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-4 focus:ring-[#7C5CBF]/10 outline-none transition-all text-lg font-medium placeholder:text-gray-400/40"
                placeholder="Ej: Optimización Digital Grúas Hardy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">URL Amigable (Slug)</label>
              <div className="flex items-center px-5 py-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-gray-50 dark:bg-[#16161D]/50 focus-within:ring-4 focus-within:ring-[#7C5CBF]/10 transition-all">
                <span className="text-gray-400/50 text-sm flex-shrink-0 select-none">4cats.cl/propuesta/</span>
                <input 
                  type="text"
                  value={data.slug}
                  onChange={(e) => setData({ ...data, slug: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-sm font-mono dark:text-white ml-0.5"
                  placeholder="ej-mi-propuesta"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Subtítulo o Bajada</label>
              <input 
                type="text"
                value={data.subtitulo}
                onChange={(e) => setData({ ...data, subtitulo: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-4 focus:ring-[#7C5CBF]/10 outline-none transition-all placeholder:text-gray-400/40"
                placeholder="Ej: Estrategia de crecimiento orgánico y performance técnica"
              />
            </div>
          </div>
          <Help title="¿Qué va acá?">
            <p>El título debe describir el proyecto del cliente de forma aspiracional.</p>
            <p className="bg-white/50 dark:bg-black/20 p-2 rounded-lg italic">"Optimización Digital Grúas Hardy"</p>
            <p>El slug es la URL que verá el cliente. Tratá de que sea corto y sin caracteres raros.</p>
          </Help>
        </div>
      );

    case 2:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">¿Cuál es el dolor del cliente? *</label>
              <textarea 
                rows={4}
                value={data.problema}
                onChange={(e) => setData({ ...data, problema: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-4 focus:ring-[#7C5CBF]/10 outline-none transition-all resize-none placeholder:text-gray-400/40"
                placeholder="Ej: El sitio actual no convierte, la carga es lenta en móviles y la competencia está captando todo el tráfico orgánico de Google."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre del Competidor *</label>
                <input 
                  type="text"
                  value={data.competidor_nombre}
                  onChange={(e) => setData({ ...data, competidor_nombre: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-4 focus:ring-[#7C5CBF]/10 outline-none transition-all placeholder:text-gray-400/40"
                  placeholder="Ej: Grúas Temuco"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">URL del Competidor</label>
                <input 
                  type="url"
                  value={data.competidor_url}
                  onChange={(e) => setData({ ...data, competidor_url: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent focus:ring-4 focus:ring-[#7C5CBF]/10 outline-none transition-all placeholder:text-gray-400/40"
                  placeholder="https://competidor.cl"
                />
              </div>
            </div>
            {data.competidor_url && (
              <a 
                href={`https://pagespeed.web.dev/?url=${data.competidor_url}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-[#7C5CBF] font-bold hover:underline"
              >
                Abrir PageSpeed del competidor <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <Help title="🔍 Cómo encontrar al competidor">
            <p>Buscá en Google el servicio principal del cliente (ej: 'grúas Temuco').</p>
            <p>El primero en los resultados orgánicos (los que no dicen "Patrocinado") es el competidor a analizar.</p>
            <p>Ese es nuestro punto de referencia para superarlos técnicamente.</p>
          </Help>
        </div>
      );

    case 3:
      return <BenchmarkingStep data={data} setData={setData} Help={Help} />;

    case 4:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Layout className="text-[#7C5CBF]" /> Definición de la Solución
              </h3>
              <div className="space-y-4">
                <input 
                  type="text"
                  value={data.solucion_titulo}
                  onChange={(e) => setData({ ...data, solucion_titulo: e.target.value })}
                  placeholder="Título de la solución (ej: Ecosistema Digital de Alta Conversión)"
                  className="w-full px-5 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent outline-none focus:ring-4 focus:ring-[#7C5CBF]/10 font-bold placeholder:text-gray-400/40"
                />
                <textarea 
                  rows={3}
                  value={data.solucion_descripcion}
                  onChange={(e) => setData({ ...data, solucion_descripcion: e.target.value })}
                  placeholder="Descripción breve..."
                  className="w-full px-5 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-transparent outline-none focus:ring-4 focus:ring-[#7C5CBF]/10 resize-none placeholder:text-gray-400/40"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Star className="text-[#7C5CBF]" /> Ventajas Diferenciales
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setData({ ...data, ventajas: [...VENTAJAS_PREDEFINIDAS] })}
                    className="bg-[#7C5CBF]/10 text-[#7C5CBF] px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-[#7C5CBF]/20 transition-all flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 fill-current" /> Cargar predefinidas
                  </button>
                  <button 
                    onClick={() => setData({ ...data, ventajas: [...(data.ventajas || []), { icono: "✨", titulo: "", descripcion: "" }] })}
                    className="text-[#7C5CBF] font-bold text-xs hover:bg-[#F3EEFF] px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Agregar manual
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {data.ventajas?.map((v, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-gray-50 dark:bg-[#16161D]/30 rounded-2xl border border-gray-100 dark:border-[#2A2A35]">
                    <input 
                      value={v.icono}
                      onChange={(e) => {
                        const newV = [...data.ventajas!];
                        newV[idx].icono = e.target.value;
                        setData({ ...data, ventajas: newV });
                      }}
                      className="w-12 h-12 text-2xl flex items-center justify-center bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] rounded-xl text-center"
                    />
                    <div className="flex-1 space-y-2">
                      <input 
                        placeholder="Título ventaja"
                        value={v.titulo}
                        onChange={(e) => {
                          const newV = [...data.ventajas!];
                          newV[idx].titulo = e.target.value;
                          setData({ ...data, ventajas: newV });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-sm font-bold placeholder:text-gray-400/40"
                      />
                      <input 
                        placeholder="Descripción corta"
                        value={v.descripcion}
                        onChange={(e) => {
                          const newV = [...data.ventajas!];
                          newV[idx].descripcion = e.target.value;
                          setData({ ...data, ventajas: newV });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-xs placeholder:text-gray-400/40"
                      />
                    </div>
                    <button 
                      onClick={() => setData({ ...data, ventajas: data.ventajas?.filter((_, i) => i !== idx) })}
                      className="self-start p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Help title="💡 Las 4 ventajas clásicas">
            <p>Para proyectos web, estas 4 ventajas siempre aplican:</p>
            <ul className="space-y-2">
              {VENTAJAS_PREDEFINIDAS.map((v, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="text-base">{v.icono}</span>
                  <strong>{v.titulo}:</strong> {v.descripcion}
                </li>
              ))}
            </ul>
            <p className="mt-4 pt-4 border-t border-[#7C5CBF]/20 font-bold text-xs">Usa el botón "Cargar predefinidas" para ahorrar tiempo.</p>
          </Help>
        </div>
      );

    case 5:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <LinkIcon className="text-[#7C5CBF]" /> Recursos Externos
              </h3>
              <button 
                onClick={() => setData({ ...data, links: [...(data.links || []), { label: "", url: "", tipo: "cliente" }] })}
                className="text-[#7C5CBF] font-bold text-sm flex items-center gap-1 hover:bg-[#F3EEFF] px-3 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Agregar link
              </button>
            </div>

            <div className="space-y-3">
              {data.links?.map((l, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-[#16161D]/30 rounded-2xl border border-gray-100 dark:border-[#2A2A35]">
                  <input 
                    placeholder="Etiqueta (ej: Ver actual)"
                    value={l.label}
                    onChange={(e) => {
                      const newL = [...data.links!];
                      newL[idx].label = e.target.value;
                      setData({ ...data, links: newL });
                    }}
                    className="md:col-span-1 px-3 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-sm placeholder:text-gray-400/40"
                  />
                  <input 
                    type="url" placeholder="https://..."
                    value={l.url}
                    onChange={(e) => {
                      const newL = [...data.links!];
                      newL[idx].url = e.target.value;
                      setData({ ...data, links: newL });
                    }}
                    className="md:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-sm placeholder:text-gray-400/40"
                  />
                  <div className="flex gap-2">
                    <select 
                      value={l.tipo}
                      onChange={(e) => {
                        const newL = [...data.links!];
                        newL[idx].tipo = e.target.value as any;
                        setData({ ...data, links: newL });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#2A2A35] text-xs appearance-none"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="competidor">Competidor</option>
                      <option value="prototipo">Prototipo</option>
                      <option value="reporte">Reporte</option>
                    </select>
                    <button 
                      onClick={() => setData({ ...data, links: data.links?.filter((_, i) => i !== idx) })}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Help title="🔗 Qué links incluir">
            <p>Es vital que el cliente pueda navegar a las pruebas de lo que decimos.</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Cliente:</strong> Su sitio actual.</li>
              <li><strong>Competidor:</strong> El sitio que analizamos.</li>
              <li><strong>Prototipo:</strong> URL de Netlify/Vercel.</li>
              <li><strong>Reporte:</strong> Link directo a PageSpeed.</li>
            </ul>
          </Help>
        </div>
      );

    case 6:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-50 dark:bg-[#16161D]/30 p-8 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-[#2A2A35]">
              <h3 className="text-2xl font-black mb-6 dark:text-white">Resumen de Propuesta</h3>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tipo de Proyecto</p>
                  <p className="text-lg font-bold text-[#7C5CBF] uppercase">{data.tipo}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Título</p>
                  <p className="font-bold dark:text-white">{data.titulo}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">URL (Slug)</p>
                  <p className="font-mono text-sm text-gray-500">4cats.cl/propuesta/{data.slug}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contenido Cargado</p>
                  <p className="text-sm font-medium dark:text-gray-300">
                    {data.metricas?.length} métricas | {data.ventajas?.length} ventajas | {data.links?.length} links
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#2A2A35] space-y-4">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Estado Inicial de la Propuesta</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setData({ ...data, estado: 'borrador' })}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${data.estado === 'borrador' ? 'border-[#7C5CBF] bg-[#F3EEFF] text-[#7C5CBF]' : 'border-gray-200 dark:border-[#2A2A35] text-gray-400'}`}
                  >
                    Borrador
                  </button>
                  <button 
                    onClick={() => setData({ ...data, estado: 'enviada' })}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${data.estado === 'enviada' ? 'border-[#7C5CBF] bg-[#F3EEFF] text-[#7C5CBF]' : 'border-gray-200 dark:border-[#2A2A35] text-gray-400'}`}
                  >
                    Lista para enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Help title="🚀 ¡Casi listo!">
            <p>Revisá que el título sea pegajoso y que el slug no tenga errores.</p>
            <p>Si marcás como <strong>"Lista para enviar"</strong>, se asume que el contenido ya está validado técnicamente.</p>
            <p>Una vez guardada, podrás ver la vista previa real y descargar el PDF si es necesario.</p>
          </Help>
        </div>
      );

    default:
      return null;
  }
}
