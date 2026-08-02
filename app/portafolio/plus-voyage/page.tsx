import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { PageViewEvent } from "../../components/AnalyticsEvents";
import { ProductMockup, ProjectFooter } from "../components/ProjectFooter";

export const metadata: Metadata = {
  title: "Plus Voyage | Producto digital 4CATS",
  description:
    "Plus Voyage es una demostración funcional de plataforma web para descubrir, comparar y planificar viajes.",
};

const challenges = ["destinos", "fechas", "disponibilidad", "preferencias", "actividades", "navegación móvil"];
const journey = ["Descubrir", "Comparar", "Seleccionar", "Planificar", "Consultar o reservar"];
const technicalProof = [
  "interfaz responsiva",
  "arquitectura por componentes",
  "filtros y búsqueda",
  "gestión de contenido",
  "experiencia visual",
  "preparación para integraciones",
];

const views = [
  { title: "Home", desc: "Presenta el concepto y orienta rápidamente hacia destinos destacados." },
  { title: "Catálogo de destinos", desc: "Permite comparar opciones sin perder claridad visual." },
  { title: "Ficha de destino", desc: "Reúne información, actividades y decisión de contacto en una sola pantalla." },
  { title: "Planificación", desc: "Ordena preferencias y pasos previos a una consulta o reserva." },
  { title: "Vista móvil", desc: "Prioriza lectura, navegacion y accion desde telefono." },
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

export default function PlusVoyagePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-[#06030F]">
      <PageViewEvent name="case_study_view" properties={{ case: "plus_voyage", type: "producto_digital" }} />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.14),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(212,120,138,0.14),transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div>
            <Link href="/portafolio" className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF] hover:text-[#6B4DAE]">
              Portafolio
            </Link>
            <p className="mt-8 text-xs font-semibold tracking-[0.22em] uppercase text-[#14B8A6]">
              PRODUCTO DIGITAL - Plataforma web
            </p>
            <h1 className="mt-5 text-5xl md:text-6xl font-black tracking-tight leading-[0.95] text-[#18181B] dark:text-white">
              Una experiencia digital para descubrir y organizar viajes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#18181B]/65 dark:text-white/50">
              Plus Voyage integra exploración, información y planificación dentro de una experiencia web simple y visual.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="#proyecto" className="btn-squish inline-flex items-center justify-center rounded-2xl bg-[#14B8A6] px-8 py-4 text-sm font-bold text-white hover:bg-[#0F9F90] transition-colors">
                Explorar el proyecto
              </a>
              <Link href="/cotizar?source=case_plus_voyage" className="btn-squish inline-flex items-center justify-center gap-2 rounded-2xl border border-black/[0.12] dark:border-white/[0.18] px-8 py-4 text-sm font-bold text-[#18181B] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.07] transition-colors">
                <PawIcon />
                Quiero desarrollar una plataforma
              </Link>
            </div>
          </div>
          <ProductMockup eyebrow="Plus Voyage" title="Exploración y planificación" items={["Home", "Destinos", "Ficha", "Reserva"]} />
        </div>
      </section>

      <section className="border-y border-black/[0.06] dark:border-white/[0.06] bg-[#F4F4F6] dark:bg-[#0A0710] py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#14B8A6]">Desafio</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">
              Una plataforma de viajes necesita simplificar muchas decisiónes.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {challenges.map((challenge) => (
              <div key={challenge} className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-5 text-sm font-semibold text-[#18181B]/70 dark:text-white/55">
                {challenge}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proyecto" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#14B8A6]">Solución</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#18181B] dark:text-white">
            Un recorrido claro desde la exploración hasta la consulta.
          </h2>
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {journey.map((step, index) => (
              <div key={step} className="rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-5">
                <p className="text-xs font-black text-[#14B8A6]">0{index + 1}</p>
                <p className="mt-3 text-sm font-black text-[#18181B] dark:text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F4F6] dark:bg-[#0A0710] py-24 border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#14B8A6]">Que demuestra técnicamente</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">Producto navegable, visual y preparado para crecer.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {technicalProof.map((item) => (
              <div key={item} className="rounded-2xl bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] p-5 text-sm font-semibold text-[#18181B]/70 dark:text-white/55">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#14B8A6]">Evidencia visual</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">Una historia de producto, no solo pantallas sueltas.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {views.map((view) => (
              <div key={view.title} className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-[#F4F4F6] dark:bg-white/[0.04] p-6">
                <div className="h-44 rounded-2xl bg-gradient-to-br from-[#14B8A6]/20 to-[#D4788A]/15 p-5">
                  <div className="h-20 rounded-2xl bg-white/70 dark:bg-white/15" />
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-10 rounded-xl bg-white/65 dark:bg-white/15" />
                    <div className="h-10 rounded-xl bg-white/45 dark:bg-white/10" />
                    <div className="h-10 rounded-xl bg-white/45 dark:bg-white/10" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-black text-[#18181B] dark:text-white">{view.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#18181B]/60 dark:text-white/45">{view.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F4F6] dark:bg-[#0A0710] py-24 border-y border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#14B8A6]">Resultado</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">
            Plus Voyage es una demostración funcional de como 4CATS transforma una idea de plataforma en un producto digital navegable, escalable y orientado al usuario.
          </h2>
        </div>
      </section>

      <ProjectFooter source="case_plus_voyage_bottom" />
    </main>
  );
}
