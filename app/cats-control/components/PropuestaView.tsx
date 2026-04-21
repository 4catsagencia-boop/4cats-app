"use client";

import { motion } from "framer-motion";
import { Propuesta, LinkRecurso } from "@/utils/supabase";
import { BarChart3, Target, ExternalLink, ShieldCheck, FileText, Monitor, Users, Zap } from "lucide-react";

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

interface PropuestaViewProps {
  propuesta: Propuesta;
}

export default function PropuestaView({ propuesta }: PropuestaViewProps) {
  // Agrupamos links por tipo
  const linksByType = propuesta.links.reduce((acc, link) => {
    if (!acc[link.tipo]) acc[link.tipo] = [];
    acc[link.tipo].push(link);
    return acc;
  }, {} as Record<string, LinkRecurso[]>);

  const getLinkIcon = (tipo: string) => {
    switch (tipo) {
      case "prototipo": return <Monitor className="w-4 h-4" />;
      case "cliente": return <Users className="w-4 h-4" />;
      case "competidor": return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "prototipo": return "Prototipos e Implementación";
      case "cliente": return "Recursos del Cliente";
      case "competidor": return "Análisis de Competencia";
      case "reporte": return "Reportes y Auditoría";
      default: return "Otros Recursos";
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-12">
      {/* Banner de Confidencialidad */}
      <div className="bg-[#F4F4F5] dark:bg-[#16161D] border border-[#E4E4E7] dark:border-[#2A2A35] px-6 py-2.5 rounded-2xl flex items-center justify-center gap-3 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-gray-500/80 print:hidden text-center leading-tight">
        <ShieldCheck className="w-4 h-4 text-[#7C5CBF] flex-shrink-0" />
        Documento Confidencial • Propiedad Intelectual de 4cats • Divulgación Prohibida
      </div>

      {/* Header */}
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#F3EEFF] dark:bg-[#1C1630] text-[#7C5CBF] text-xs font-bold uppercase tracking-wider"
        >
          Propuesta Estratégica
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black text-[#18181B] dark:text-white"
        >
          {propuesta.titulo}
        </motion.h1>
        {propuesta.subtitulo && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#71717A] dark:text-[#A1A1AA] max-w-2xl mx-auto"
          >
            {propuesta.subtitulo}
          </motion.p>
        )}
      </header>

      {/* Problema y Solución Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-4 dark:text-white">El Desafío</h2>
          <p className="text-[#52525B] dark:text-[#D4D4D8] leading-relaxed">
            {propuesta.problema}
          </p>
          {propuesta.competidor_nombre && (
            <div className="mt-6 pt-6 border-t border-[#F4F4F5] dark:border-[#1A1A20]">
              <span className="text-xs font-bold uppercase text-[#A1A1AA] block mb-2">Referencia Competidor</span>
              <a 
                href={propuesta.competidor_url ?? '#'} 
                target="_blank" 
                className="text-[#7C5CBF] font-medium flex items-center gap-1 hover:underline"
              >
                {propuesta.competidor_nombre} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-[#7C5CBF] text-white shadow-xl shadow-[#7C5CBF]/20"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-4">{propuesta.solucion_titulo || "Nuestra Solución"}</h2>
          <p className="text-white/90 leading-relaxed">
            {propuesta.solucion_descripcion}
          </p>
        </motion.div>
      </div>

      {/* Impact Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Resumen de Impacto Estratégico</h2>
          <p className="text-gray-500 text-sm">Proyección de resultados basada en optimización técnica y experiencia de usuario.</p>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#0F0F12] shadow-2xl shadow-[#7C5CBF]/5">
          <div className="grid grid-cols-4 bg-gray-50 dark:bg-[#16161D]/80 px-8 py-5 border-b border-[#E4E4E7] dark:border-[#2A2A35]">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dimensión</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Estado Actual</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#7C5CBF] text-center">Propuesta 4cats</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 text-right">Impacto en Negocio</span>
          </div>

          <div className="divide-y divide-[#E4E4E7] dark:divide-[#2A2A35]">
            {[
              { dim: "Conversión", met: "Clics a Llamada (CTR)", actual: "2.1%", prop: "12.5% (est.)", impact: "Más servicios facturados", icon: "📲" },
              { dim: "Visibilidad", met: "SEO Local (Top 3)", actual: "No Visible", prop: "Posicionamiento Activo", impact: "Menos gasto en publicidad", icon: "📍" },
              { dim: "UX", met: "Carga en Móvil", actual: "4.8s", prop: "0.9s", impact: "Retención Inmediata", icon: "⚡" },
              { dim: "Confianza", met: "Seguridad SSL/HTTPS", actual: "Vulnerable", prop: "Grado A+", impact: "Blindaje de Marca", icon: "🛡️" }
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-8 py-6 items-center hover:bg-gray-50/50 dark:hover:bg-[#1C1630]/20 transition-all group">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#7C5CBF] uppercase mb-1">{row.dim}</span>
                  <span className="text-sm font-black dark:text-white flex items-center gap-2">
                    <span className="text-lg">{row.icon}</span> {row.met}
                  </span>
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-900/20">
                    {row.actual}
                  </span>
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-900/20 shadow-sm shadow-emerald-500/10">
                    {row.prop}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase italic">
                    {row.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benchmarking Table */}
      {propuesta.metricas.length > 0 && (() => {
        const mobileMetric = propuesta.metricas.find(m => m.nombre === 'PageSpeed Mobile');
        const actualScore = mobileMetric?.actual ?? 0;
        const propuestaScore = mobileMetric?.propuesta ?? 0;
        const mejora = actualScore > 0 && propuestaScore > 0
          ? Math.round(((propuestaScore - actualScore) / actualScore) * 100)
          : null;

        return (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
              <BarChart3 className="w-6 h-6 text-[#7C5CBF]" />
              Benchmarking de Performance
            </h2>

            <div className="overflow-hidden rounded-3xl border border-[#E4E4E7] dark:border-[#2A2A35] bg-white dark:bg-[#0F0F12]">
              {/* Score Rings */}
              {mobileMetric && (mobileMetric.actual > 0 || mobileMetric.propuesta > 0) && (
                <div className="grid grid-cols-3 divide-x divide-[#E4E4E7] dark:divide-[#2A2A35] bg-gray-50 dark:bg-[#16161D]/50 p-6">
                  <div className="flex flex-col items-center gap-3 px-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado actual</p>
                    <ScoreRing score={mobileMetric.actual} label="PageSpeed Mobile" color="text-gray-400" />
                  </div>
                  <div className="flex flex-col items-center gap-3 px-4">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Competidor</p>
                    <ScoreRing score={mobileMetric.competidor} label="PageSpeed Mobile" color="text-red-400" />
                  </div>
                  <div className="flex flex-col items-center gap-3 px-4">
                    <p className="text-xs font-bold text-[#7C5CBF] uppercase tracking-widest">Propuesta 4cats</p>
                    <ScoreRing score={mobileMetric.propuesta} label="PageSpeed Mobile" color="text-[#7C5CBF]" />
                  </div>
                </div>
              )}

              {/* Insight banner */}
              {mejora !== null && (
                <div className={`px-6 py-3 flex items-center gap-3 text-sm font-bold ${
                  mejora > 0
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                }`}>
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  {mejora > 0
                    ? `Nuestra propuesta mejora el rendimiento actual en un ${mejora}% — velocidad que Google premia.`
                    : `El prototipo alcanza los mismos niveles de performance del sitio actual.`}
                </div>
              )}

              {/* Metrics table */}
              <div className="divide-y divide-[#E4E4E7] dark:divide-[#2A2A35]">
                <div className="grid grid-cols-4 px-4 sm:px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white dark:bg-[#0F0F12]">
                  <span>Métrica</span>
                  <span className="text-center">Actual</span>
                  <span className="text-center text-red-400">Competidor</span>
                  <span className="text-center text-[#7C5CBF]">Propuesta</span>
                </div>
                {propuesta.metricas.map((m, idx) => {
                  const higherBetter = METRIC_HIGHER_IS_BETTER[m.nombre] ?? true;
                  const propuestaColor = scoreColor(m.propuesta, m.actual, higherBetter);
                  const competidorColor = scoreColor(m.competidor, m.actual, higherBetter);
                  const arrow = m.propuesta > 0 && m.actual > 0
                    ? (higherBetter
                        ? (m.propuesta > m.actual ? '↑' : m.propuesta < m.actual ? '↓' : '=')
                        : (m.propuesta < m.actual ? '↑' : m.propuesta > m.actual ? '↓' : '='))
                    : null;
                  return (
                    <div key={idx} className="grid grid-cols-4 px-4 sm:px-6 py-3 items-center bg-white dark:bg-[#0F0F12] hover:bg-gray-50 dark:hover:bg-[#16161D]/30 transition-colors">
                      <span className="text-sm font-medium dark:text-gray-300">{m.nombre}</span>
                      <span className="text-center text-sm text-gray-500 font-mono">{m.actual}{m.unidad}</span>
                      <span className={`text-center text-sm font-mono ${competidorColor || 'text-gray-500'}`}>{m.competidor}{m.unidad}</span>
                      <span className={`text-center text-sm font-bold font-mono ${propuestaColor || 'text-[#7C5CBF]'}`}>
                        {m.propuesta}{m.unidad}
                        {arrow && <span className="ml-1 text-[10px]">{arrow}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        );
      })()}

      {/* Ventajas Cards */}
      {propuesta.ventajas.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center dark:text-white">Ventajas del Nuevo Sistema</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propuesta.ventajas.map((v, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-4">{v.icono}</div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">{v.titulo}</h3>
                <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  {v.descripcion}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Links grouped */}
      {Object.entries(linksByType).length > 0 && (
        <section className="space-y-8 bg-[#F9F9FB] dark:bg-[#16161D]/50 p-8 sm:p-12 rounded-[40px]">
          <h2 className="text-2xl font-bold dark:text-white mb-8">Recursos y Documentación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {Object.entries(linksByType).map(([tipo, links], idx) => (
              <div key={tipo} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA] flex items-center gap-2">
                  {getLinkIcon(tipo)}
                  {getTipoLabel(tipo)}
                </h3>
                <div className="space-y-3">
                  {links.map((link, lidx) => (
                    <a
                      key={lidx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-[#7C5CBF] transition-all"
                    >
                      <span className="font-medium text-sm group-hover:text-[#7C5CBF] transition-colors">{link.label}</span>
                      <ExternalLink className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#7C5CBF] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-12 text-center space-y-6">
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-gray-50 dark:bg-[#16161D]/50 border border-[#E4E4E7] dark:border-[#2A2A35] text-[10px] text-gray-400 leading-relaxed italic">
          <strong>Aviso de Confidencialidad:</strong> Este documento es confidencial y propiedad intelectual de 4cats. Su divulgación a terceros sin autorización previa y por escrito está estrictamente prohibida.
        </div>
        <p className="text-sm text-[#A1A1AA]">
          ¿Listo para dar el siguiente paso? Esta propuesta fue generada por el equipo de 4cats.
        </p>
      </footer>
    </div>
  );
}
