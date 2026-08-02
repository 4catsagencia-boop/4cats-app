import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { PageViewEvent } from "../../components/AnalyticsEvents";
import { ProjectFooter } from "../components/ProjectFooter";

export const metadata: Metadata = {
  title: "Caso Plus Gráfica | 4cats",
  description:
    "Caso real de 4CATS: Plus Gráfica transformó su presencia digital en un sistema de captación con landing comercial, catálogo web y flujo de cotización.",
};

const metrics = [
  { label: "Landing comercial", before: "Web informativa sin recorrido claro", after: "Propuesta de valor, servicios y CTA" },
  { label: "Catálogo web", before: "Productos sin estructura comercial", after: "Categorías, fichas y alternativas" },
  { label: "Cotización", before: "Preguntas repetitivas por canal manual", after: "Interés dirigido a solicitud comercial" },
  { label: "Operabilidad", before: "Sitio inestable", after: "Deploy versionado en Vercel" },
];

const landingDeliverables = [
  "Propuesta de valor clara para entender rápidamente qué hace Plus Gráfica.",
  "Servicios principales presentados como oferta comercial, no como listado suelto.",
  "Casos y evidencia visual para generar confianza antes del contacto.",
  "Accesos directos a cotización, WhatsApp y solicitud comercial.",
];

const catalogDeliverables = [
  "Productos organizados por categorías para facilitar exploración y comparación.",
  "Fichas con medidas, materiales y características relevantes para decidir.",
  "Productos con precio visible y productos sujetos a cotización según complejidad.",
  "Acceso rápido a WhatsApp o solicitud comercial desde el interés del usuario.",
];

const flow = [
  "Cliente busca una solución",
  "Entra a la landing",
  "Entiende qué hace Plus Gráfica",
  "Explora el catálogo",
  "Selecciona producto o servicio",
  "Solicita cotización",
];

const visualEvidence = [
  { title: "Hero de la landing", desc: "Comunica la oferta principal y orienta al visitante hacia una acción comercial." },
  { title: "Sección de servicios", desc: "Ordena las líneas de trabajo para que el cliente identifique rápido lo que necesita." },
  { title: "Vista general del catálogo", desc: "Convierte productos dispersos en alternativas comparables y navegables." },
  { title: "Categoría de productos", desc: "Reduce preguntas repetitivas mostrando familias, usos y opciones disponibles." },
  { title: "Ficha individual", desc: "Expone medidas, materiales, características y condición de precio o cotización." },
  { title: "Flujo hacia cotización", desc: "Lleva el interés desde la exploración hasta WhatsApp o solicitud comercial." },
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

export default function PlusGraficaCasePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-[#06030F]">
      <PageViewEvent name="case_study_view" properties={{ case: "plus_grafica" }} />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.16),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(124,92,191,0.14),transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div>
            <Link href="/portafolio" className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF] hover:text-[#6B4DAE]">
              Portafolio
            </Link>
            <p className="mt-8 text-xs font-semibold tracking-[0.22em] uppercase text-[#F97316]">
              CASO REAL · Landing comercial + catálogo web
            </p>
            <h1 className="mt-5 text-5xl md:text-6xl font-black tracking-tight leading-[0.95] text-[#18181B] dark:text-white">
              Landing comercial y catálogo web para convertir visitas en solicitudes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#18181B]/65 dark:text-white/50">
              Transformamos la presencia digital de Plus Gráfica en un sistema de captación compuesto por una landing comercial y un catálogo web conectado al proceso de cotización.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/cotizar?source=case_plus_grafica"
                className="btn-squish inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7C5CBF] px-8 py-4 text-sm font-bold text-white hover:bg-[#6B4DAE] transition-colors"
                style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.65)" }}
              >
                <PawIcon />
                Solicitar auditoría gratuita
              </Link>
              <a
                href="https://plusgrafica.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-squish inline-flex items-center justify-center rounded-2xl border border-black/[0.12] dark:border-white/[0.18] px-8 py-4 text-sm font-bold text-[#18181B] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.07] transition-colors"
              >
                Ver sitio publicado
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] rounded-[2rem] border border-black/[0.08] dark:border-white/[0.10] bg-[#F4F4F6] dark:bg-white/[0.04] overflow-hidden">
            <div className="absolute inset-x-6 top-6 h-8 rounded-t-2xl border border-black/[0.08] dark:border-white/[0.10] bg-white/80 dark:bg-[#0A0710]/80 flex items-center gap-2 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="absolute inset-x-6 top-14 bottom-6 rounded-b-2xl border-x border-b border-black/[0.08] dark:border-white/[0.10] bg-white dark:bg-[#06030F] p-6">
              <div className="grid h-full grid-rows-[auto_1fr_auto] gap-5">
                <div>
                  <p className="text-xs font-black tracking-widest uppercase text-[#F97316]">Plus Gráfica</p>
                  <h2 className="mt-2 text-3xl font-black text-[#18181B] dark:text-white">Landing + catálogo + cotización</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Landing comercial", "Servicios", "Catálogo web", "Ficha de producto"].map((item) => (
                    <div key={item} className="rounded-2xl bg-[#F4F4F6] dark:bg-white/[0.06] p-4 flex flex-col justify-end">
                      <div className="mb-4 h-16 rounded-xl bg-gradient-to-br from-[#F97316]/30 to-[#7C5CBF]/20" />
                      <p className="text-xs font-bold text-[#18181B] dark:text-white">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-[#25D366] px-5 py-4 text-sm font-black text-white text-center">
                  Solicitar cotización
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/[0.06] dark:border-white/[0.06] bg-[#F4F4F6] dark:bg-[#0A0710] py-20">
        <div className="max-w-6xl mx-auto px-6 grid gap-6 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#18181B]/45 dark:text-white/35">{metric.label}</p>
              <p className="mt-5 text-sm text-[#18181B]/45 dark:text-white/35 line-through">{metric.before}</p>
              <p className="mt-2 text-lg font-black text-[#18181B] dark:text-white">{metric.after}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF]">Problema inicial</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">La web no tenía un recorrido comercial claro.</h2>
          </div>
          <div className="grid gap-6 text-base leading-relaxed text-[#18181B]/65 dark:text-white/50">
            <p>
              El sitio anterior informaba, pero no guiaba al visitante desde el problema hasta una acción concreta. Los servicios y productos necesitaban ordenarse para reducir preguntas repetitivas y convertir interés en solicitudes.
            </p>
            <p>
              La solución fue construir dos piezas del mismo sistema: una landing que comunica y genera confianza, y un catálogo web que organiza alternativas y conecta con el proceso de cotización.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F4F4F6] dark:bg-[#0A0710] py-24 border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F97316]">Solución implementada</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#18181B] dark:text-white">Landing comercial + catálogo web.</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-8">
              <h3 className="text-2xl font-black text-[#18181B] dark:text-white">Landing comercial</h3>
              <ul className="mt-6 space-y-4">
                {landingDeliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#18181B]/70 dark:text-white/55">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#F97316] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-8">
              <h3 className="text-2xl font-black text-[#18181B] dark:text-white">Catálogo web</h3>
              <ul className="mt-6 space-y-4">
                {catalogDeliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#18181B]/70 dark:text-white/55">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#7C5CBF] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF]">Flujo comercial</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#18181B] dark:text-white">De búsqueda a solicitud de cotización.</h2>
          <div className="mt-10 grid gap-3 md:grid-cols-6">
            {flow.map((step, index) => (
              <div key={step} className="rounded-2xl border border-[#7C5CBF]/20 bg-[#7C5CBF]/10 p-5">
                <p className="text-xs font-black text-[#7C5CBF]">0{index + 1}</p>
                <p className="mt-3 text-sm font-black text-[#18181B] dark:text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F4F6] dark:bg-[#0A0710] py-24 border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F97316]">Representación visual del flujo</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">Las piezas del sistema, separadas por función.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#18181B]/55 dark:text-white/40">Estas vistas representan las partes del sistema comercial implementado. No se presentan como capturas literales del sitio publicado.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visualEvidence.map((item) => (
              <div key={item.title} className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-6">
                <div className="h-40 rounded-2xl bg-gradient-to-br from-[#F97316]/20 to-[#7C5CBF]/15 p-5">
                  <div className="h-6 w-36 rounded-full bg-white/70 dark:bg-white/15" />
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-xl bg-white/70 dark:bg-white/15" />
                    <div className="h-16 rounded-xl bg-white/50 dark:bg-white/10" />
                    <div className="h-16 rounded-xl bg-white/50 dark:bg-white/10" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-black text-[#18181B] dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#18181B]/60 dark:text-white/45">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#F4F4F6] dark:bg-white/[0.04] p-8">
            <p className="text-xs font-black uppercase tracking-widest text-[#18181B]/45 dark:text-white/35">ANTES</p>
            <p className="mt-4 text-2xl font-black text-[#18181B] dark:text-white">Web informativa sin recorrido comercial claro.</p>
          </div>
          <div className="rounded-2xl border border-[#7C5CBF]/30 bg-[#7C5CBF]/10 p-8">
            <p className="text-xs font-black uppercase tracking-widest text-[#7C5CBF]">DESPUÉS</p>
            <p className="mt-4 text-2xl font-black text-[#18181B] dark:text-white">Landing + catálogo + flujo de cotización.</p>
          </div>
        </div>
      </section>

      <ProjectFooter source="case_plus_grafica_bottom" />
    </main>
  );
}