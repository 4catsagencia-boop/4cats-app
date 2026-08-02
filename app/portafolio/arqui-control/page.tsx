import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { PageViewEvent } from "../../components/AnalyticsEvents";
import { ProductMockup, ProjectFooter } from "../components/ProjectFooter";

export const metadata: Metadata = {
  title: "Arqui Control | Producto digital 4CATS",
  description:
    "Arqui Control centraliza proyectos, documentos, avances, tareas y decisiónes para estudios de arquitectura.",
};

const painPoints = [
  "documentos repartidos",
  "avances difíciles de visualizar",
  "tareas sin seguimiento",
  "información duplicada",
  "decisiónes que quedan en WhatsApp o correo",
];

const modules = ["Proyectos", "Etapas", "Tareas", "Documentos", "Seguimiento", "Aprendizaje"];

const views = [
  {
    title: "Dashboard",
    desc: "Permite identificar rápidamente atrasos, tareas pendientes y próximas decisiónes.",
    points: ["Resumen por proyecto", "Indicadores de avance", "Alertas operativas"],
  },
  {
    title: "Vista de proyecto",
    desc: "Reúne información clave para que el equipo no trabaje con versiones dispersas.",
    points: ["Estado actual", "Responsables", "Últimos movimientos"],
  },
  {
    title: "Seguimiento de etapas",
    desc: "Ordena el avance por fases y ayuda a detectar bloqueos antes de que escalen.",
    points: ["Etapas activas", "Tareas asociadas", "Próximos hitos"],
  },
  {
    title: "Documentos y tareas",
    desc: "Conecta archivos, pendientes y decisiónes dentro del mismo flujo de trabajo.",
    points: ["Repositorio", "Checklist", "Historial"],
  },
];

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
      <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
      <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
      <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
    </svg>
  );
}

export default function ArquiControlPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-[#06030F]">
      <PageViewEvent name="case_study_view" properties={{ case: "arqui_control", type: "producto_digital" }} />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(124,92,191,0.16),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(34,197,94,0.10),transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div>
            <Link href="/portafolio" className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF] hover:text-[#6B4DAE]">
              Portafolio
            </Link>
            <p className="mt-8 text-xs font-semibold tracking-[0.22em] uppercase text-[#7C5CBF]">
              PRODUCTO DIGITAL - Software de gestión
            </p>
            <h1 className="mt-5 text-5xl md:text-6xl font-black tracking-tight leading-[0.95] text-[#18181B] dark:text-white">
              Gestión de proyectos de arquitectura en un solo sistema.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#18181B]/65 dark:text-white/50">
              Arqui Control centraliza proyectos, documentos, avances, tareas y decisiónes para reducir la dispersión de información en estudios de arquitectura.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="#funciona" className="btn-squish inline-flex items-center justify-center rounded-2xl bg-[#7C5CBF] px-8 py-4 text-sm font-bold text-white hover:bg-[#6B4DAE] transition-colors">
                Ver cómo funciona
              </a>
              <Link href="/cotizar?source=case_arqui_control" className="btn-squish inline-flex items-center justify-center gap-2 rounded-2xl border border-black/[0.12] dark:border-white/[0.18] px-8 py-4 text-sm font-bold text-[#18181B] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.07] transition-colors">
                <PawIcon />
                Necesito un sistema similar
              </Link>
            </div>
          </div>
          <ProductMockup eyebrow="Arqui Control" title="Proyectos, etapas y seguimiento" items={["Dashboard", "Proyecto", "Etapas", "Documentos"]} />
        </div>
      </section>

      <section className="border-y border-black/[0.06] dark:border-white/[0.06] bg-[#F4F4F6] dark:bg-[#0A0710] py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">Problema</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">
              Gestiónar proyectos con archivos y mensajes separados genera errores.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {painPoints.map((point) => (
              <div key={point} className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-5 text-sm font-semibold text-[#18181B]/70 dark:text-white/55">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="funciona" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF]">Solución</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#18181B] dark:text-white">
            Un sistema diseñado alrededor del flujo real del proyecto.
          </h2>
          <div className="mt-10 grid gap-3 md:grid-cols-6">
            {modules.map((module, index) => (
              <div key={module} className="rounded-2xl border border-[#7C5CBF]/20 bg-[#7C5CBF]/10 p-5">
                <p className="text-xs font-black text-[#7C5CBF]">0{index + 1}</p>
                <p className="mt-3 text-sm font-black text-[#18181B] dark:text-white">{module}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F4F6] dark:bg-[#0A0710] py-24 border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF]">Evidencia visual</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">Vistas del sistema y decisión que mejora cada una.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {views.map((view) => (
              <div key={view.title} className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-6">
                <div className="h-44 rounded-2xl bg-gradient-to-br from-[#7C5CBF]/20 to-[#22C55E]/10 p-5">
                  <div className="h-6 w-32 rounded-full bg-white/70 dark:bg-white/15" />
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="h-20 rounded-xl bg-white/70 dark:bg-white/15" />
                    <div className="h-20 rounded-xl bg-white/50 dark:bg-white/10" />
                    <div className="h-20 rounded-xl bg-white/50 dark:bg-white/10" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-black text-[#18181B] dark:text-white">{view.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#18181B]/60 dark:text-white/45">{view.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {view.points.map((point) => (
                    <span key={point} className="rounded-full bg-black/[0.04] dark:bg-white/[0.08] px-3 py-1 text-xs font-semibold text-[#18181B]/60 dark:text-white/45">{point}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF]">Resultado</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">
            Arqui Control demuestra cómo un proceso profesional puede transformarse en una herramienta digital centralizada, trazable y preparada para crecer.
          </h2>
        </div>
      </section>

      <ProjectFooter source="case_arqui_control_bottom" />
    </main>
  );
}
