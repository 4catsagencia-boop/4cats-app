"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { FadeUp } from "../components/FadeUp";
import { useLang } from "../context/LanguageContext";
import LucyCat from "../components/cats/LucyCat";
import BillieCat from "../components/cats/BillieCat";
import LaylaCat from "../components/cats/LaylaCat";
import RoxanneCat from "../components/cats/RoxanneCat";

type Filter = "todos" | "web" | "software" | "automatizacion" | "producto";

type PortfolioProject = {
  id: string;
  label: string;
  category: Filter;
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  evidence: string[];
  href?: string;
  color: string;
  stack: string[];
};

const filters: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "web", label: "Web" },
  { key: "software", label: "Software" },
  { key: "automatizacion", label: "Automatización" },
  { key: "producto", label: "Producto digital" },
];

const projects: PortfolioProject[] = [
  {
    id: "plus-grafica",
    label: "CASO REAL",
    category: "web",
    categoryLabel: "Landing comercial + catálogo web",
    title: "Plus Gráfica",
    subtitle: "Caso real - Landing comercial y catálogo web",
    description: "Rediseño de la presencia digital y construcción de un catálogo orientado a transformar visitas en solicitudes de cotización.",
    evidence: ["Landing comercial", "Catálogo web", "Flujo de cotización", "WhatsApp"],
    href: "/portafolio/plus-grafica",
    color: "#F97316",
    stack: ["React", "Vite", "Tailwind", "Vercel"],
  },
  {
    id: "plus-control",
    label: "SISTEMA COMERCIAL EN USO",
    category: "automatizacion",
    categoryLabel: "Gestión de ventas, producción y aprendizaje",
    title: "Plus Control",
    subtitle: "Sistema interno - Operación comercial",
    description: "Sistema comercial en uso para gestionar ventas, producción y aprendizaje dentro de una operación digital trazable.",
    evidence: ["Ventas", "Producción", "Aprendizaje", "Panel operativo"],
    color: "#7C5CBF",
    stack: ["Next.js", "Supabase", "Server Actions", "Vercel"],
  },
  {
    id: "arqui-control",
    label: "PRODUCTO DIGITAL",
    category: "software",
    categoryLabel: "Software vertical de gestión",
    title: "Arqui Control",
    subtitle: "Software vertical - Gestión para arquitectura",
    description: "Demuestra que una arquitectura de sistema puede adaptarse a otra industria: proyectos, etapas, tareas, documentos y seguimiento.",
    evidence: ["Proyectos", "Etapas", "Tareas", "Documentos"],
    href: "/portafolio/arqui-control",
    color: "#22C55E",
    stack: ["Producto", "Dashboard", "Base de datos", "UX"],
  },
  {
    id: "plus-voyage",
    label: "PRODUCTO DIGITAL",
    category: "producto",
    categoryLabel: "Plataforma de exploración y planificación",
    title: "Plus Voyage",
    subtitle: "Producto digital - Plataforma web",
    description: "Plataforma de exploración y planificación que demuestra diseño de producto, experiencia visual, búsqueda, filtros y flujo adaptable a móvil.",
    evidence: ["Home", "Catálogo", "Ficha", "Planificación"],
    href: "/portafolio/plus-voyage",
    color: "#14B8A6",
    stack: ["UI", "Componentes", "Filtros", "Responsive"],
  },
];

function ProjectCard({ project }: { project: PortfolioProject }) {
  const content = (
    <article
      className="group h-full rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: `0 24px 80px -50px ${project.color}` }}
    >
      <div className="px-6 py-3 flex items-center justify-between gap-4" style={{ background: project.color }}>
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">{project.label}</span>
        <span className="text-[10px] font-bold text-white/80">{project.categoryLabel}</span>
      </div>
      <div className="p-8">
        <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: project.color }}>{project.subtitle}</p>
        <h3 className="text-3xl font-black tracking-tight text-[#18181B] dark:text-white">{project.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-[#18181B]/65 dark:text-white/50">{project.description}</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {project.evidence.map((item) => (
            <div key={item} className="rounded-2xl bg-[#F4F4F6] dark:bg-[#06030F] px-4 py-3 text-xs font-bold text-[#18181B]/70 dark:text-white/55">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span key={item} className="rounded-full bg-black/[0.04] dark:bg-white/[0.08] px-3 py-1 text-xs font-semibold text-[#18181B]/55 dark:text-white/40">{item}</span>
          ))}
        </div>
        {project.href && <p className="mt-8 text-xs font-black text-[#7C5CBF] group-hover:text-[#6B4DAE]">Ver proyecto completo</p>}
      </div>
    </article>
  );

  if (!project.href) return content;
  return <Link href={project.href} className="block h-full">{content}</Link>;
}

export default function PortafolioPage() {
  const { lang } = useLang();
  const es = lang === "es";
  const [active, setActive] = useState<Filter>("todos");
  const visibleProjects = active === "todos" ? projects : projects.filter((project) => project.category === active);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      <section className="relative bg-white dark:bg-[#06030F] pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(124,92,191,0.12),transparent_45%)]" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <FadeUp>
            <div className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#C4B5FD] bg-black/[0.03] dark:bg-white/[0.07] px-5 py-2.5 rounded-full border border-black/[0.12] dark:border-white/[0.12] mb-10">
              {es ? "Evidencia y productos 4CATS" : "4CATS evidence and products"}
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="flex items-end justify-center gap-1 mb-10">
              <div className="opacity-55 -mr-3 mb-2"><BillieCat className="w-[70px] h-[84px]" /></div>
              <div className="relative z-10">
                <div className="absolute inset-0 blur-[50px] scale-150 opacity-30 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #f5a85535, transparent)" }} />
                <LucyCat className="w-[140px] h-[168px] relative drop-shadow-xl" />
              </div>
              <div className="opacity-55 -ml-3 mb-2"><LaylaCat className="w-[70px] h-[84px]" /></div>
              <div className="opacity-45 -ml-4 mb-4"><RoxanneCat className="w-[60px] h-[72px]" /></div>
            </div>
          </FadeUp>

          <FadeUp delay={160}>
            <h1 className="text-5xl md:text-6xl font-black text-[#18181B] dark:text-white tracking-tight leading-[0.95] mb-6">
              Evidencia para confiar, no adornos para impresionar.
            </h1>
            <p className="text-[#18181B]/60 dark:text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">
              Separamos casos reales, sistemas en uso y productos digitales para mostrar amplitud sin fingir métricas ni resultados comerciales donde todavía no existen.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F4F4F6] dark:bg-[#0A0710] py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActive(filter.key)}
                className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${active === filter.key ? "bg-[#7C5CBF] text-white" : "bg-white dark:bg-white/[0.06] text-[#18181B]/55 dark:text-white/45 hover:text-[#18181B] dark:hover:text-white"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visibleProjects.map((project, index) => (
              <FadeUp key={project.id} delay={index * 100}>
                <ProjectCard project={project} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#06030F] py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#18181B] dark:text-white leading-tight mb-4">
            ¿Necesitas construir algo parecido?
          </h2>
          <p className="text-[#18181B]/60 dark:text-white/40 text-lg mb-10">
            Cada proyecto del portafolio es una puerta de entrada distinta: captación, software interno, automatización o producto digital.
          </p>
          <Link href="/cotizar?source=portfolio_index" className="btn-squish inline-flex items-center gap-2 px-10 py-4 bg-[#7C5CBF] text-white font-bold rounded-2xl hover:bg-[#6B4DAE] transition-colors">
            Solicitar auditoría gratuita
          </Link>
        </div>
      </section>
    </main>
  );
}