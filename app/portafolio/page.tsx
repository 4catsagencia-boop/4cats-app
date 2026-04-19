"use client"

import Link from "next/link"
import Navbar from "../components/Navbar"
import { FadeUp } from "../components/FadeUp"
import { useLang } from "../context/LanguageContext"
import LucyCat from "../components/cats/LucyCat"
import BillieCat from "../components/cats/BillieCat"
import LaylaCat from "../components/cats/LaylaCat"
import RoxanneCat from "../components/cats/RoxanneCat"

type Metric = { label: string; before: string; after: string; delta: string; positive: boolean }

interface CaseStudy {
  id: number
  industry: string
  industryColor: string
  title: string
  subtitle: string
  challenge: string
  solution: string
  stack: string[]
  metrics: Metric[]
  roi: string
  roiLabel: string
  duration: string
  verified?: boolean
  inProgress?: boolean
  url?: string
}

const casesEs: CaseStudy[] = [
  {
    id: 0, verified: true, url: "plusgrafica.cl",
    industry: "Rotulación & Señalética", industryColor: "#F97316",
    title: "Plus Gráfica · Temuco",
    subtitle: "De WordPress roto sin catálogo a presencia digital que vende",
    challenge: "Plus Gráfica operaba con un sitio WordPress que fallaba constantemente: lento, sin catálogo de productos y con una experiencia que hacía perder clientes antes de que llegaran a cotizar. Sus trabajos de letrero y rotulación no tenían vitrina digital.",
    solution: "Nuevo sitio en React con catálogo visual completo de servicios: letreros luminosos, rotulación vehicular, señalética industrial y letras volumétricas. CTA directo a WhatsApp, carga ultrarrápida en Vercel y SEO optimizado para Temuco.",
    stack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    metrics: [
      { label: "Tiempo de carga del sitio", before: "~6s (WP roto)", after: "< 1s", delta: "−83%", positive: true },
      { label: "Catálogo de servicios online", before: "Ninguno", after: "Completo", delta: "nuevo", positive: true },
      { label: "Puntuación PageSpeed", before: "~38/100", after: "92+/100", delta: "+142%", positive: true },
      { label: "Canal de contacto digital", before: "Formulario roto", after: "WhatsApp directo", delta: "activo", positive: true },
    ],
    roi: "Canal digital activado",
    roiLabel: "De cero presencia efectiva a vitrina disponible 24/7 para clientes de Temuco y La Araucanía",
    duration: "Proyecto activo",
  },
  {
    id: 3, inProgress: true, verified: false, url: "gruashardy.cl",
    industry: "Izaje & Transporte Industrial", industryColor: "#F59E0B",
    title: "Hardy Grúas · La Araucanía",
    subtitle: "De WordPress genérico a plataforma de servicios industriales 24/7",
    challenge: "Hardy Grúas opera con un sitio WordPress estático con un único canal de contacto: teléfono. Sin formulario de cotización, sin descripción técnica de capacidades, sin galería con contexto y con textos genéricos que no diferencian su servicio en la región.",
    solution: "Propuesta en desarrollo: sitio Next.js con catálogo técnico de servicios, formulario de solicitud de cotización por tipo de trabajo, galería con fichas de proyectos y cobertura geográfica visible. CTA directo a WhatsApp y llamada con disponibilidad 24/7.",
    stack: ["Next.js 16", "Supabase", "TypeScript", "Tailwind CSS", "Vercel"],
    metrics: [
      { label: "Tiempo de carga estimado actual", before: "~6s (WordPress)", after: "< 1s", delta: "objetivo", positive: true },
      { label: "Canales de contacto digital", before: "Solo teléfono", after: "Teléfono + WhatsApp + Formulario", delta: "×3", positive: true },
      { label: "Formulario de cotización online", before: "No existe", after: "Por tipo de servicio", delta: "nuevo", positive: true },
      { label: "Puntuación PageSpeed estimada", before: "~40/100", after: "95+/100", delta: "objetivo", positive: true },
    ],
    roi: "En desarrollo",
    roiLabel: "Documentado el 16 de abril 2026 — resultados al cierre del proyecto",
    duration: "En desarrollo",
  },
]

const casesEn: CaseStudy[] = [
  {
    id: 0, verified: true, url: "plusgrafica.cl",
    industry: "Signage & Branding", industryColor: "#F97316",
    title: "Plus Gráfica · Temuco",
    subtitle: "From broken WordPress with no catalog to a digital presence that sells",
    challenge: "Plus Gráfica was running a WordPress site that constantly failed: slow, with no product catalog and an experience that lost customers before they even had a chance to quote. Their signage and vehicle wrapping work had no digital showcase.",
    solution: "New React site with a complete visual service catalog: illuminated signs, vehicle wrapping, industrial signage, and 3D lettering. Direct WhatsApp CTA, ultra-fast loading on Vercel, and SEO optimized for Temuco.",
    stack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    metrics: [
      { label: "Site load time", before: "~6s (broken WP)", after: "< 1s", delta: "−83%", positive: true },
      { label: "Online service catalog", before: "None", after: "Complete", delta: "new", positive: true },
      { label: "PageSpeed score", before: "~38/100", after: "92+/100", delta: "+142%", positive: true },
      { label: "Digital contact channel", before: "Broken form", after: "Direct WhatsApp", delta: "active", positive: true },
    ],
    roi: "Digital channel activated",
    roiLabel: "From zero effective presence to a 24/7 showcase for clients across Temuco and La Araucanía",
    duration: "Active project",
  },
  {
    id: 4, inProgress: true, verified: false, url: "gruashardy.cl",
    industry: "Crane & Industrial Transport", industryColor: "#F59E0B",
    title: "Hardy Grúas · La Araucanía",
    subtitle: "From generic WordPress to a 24/7 industrial services platform",
    challenge: "Hardy Grúas runs a static WordPress site with a single contact channel: phone. No quote form, no technical specs, no gallery with context — and generic copy that doesn't differentiate their industrial crane service in the region.",
    solution: "Proposal in progress: Next.js site with a technical service catalog, quote request form by job type, project gallery with case sheets, and visible geographic coverage. Direct WhatsApp and call CTA with 24/7 availability.",
    stack: ["Next.js 16", "Supabase", "TypeScript", "Tailwind CSS", "Vercel"],
    metrics: [
      { label: "Estimated current load time", before: "~6s (WordPress)", after: "< 1s", delta: "target", positive: true },
      { label: "Digital contact channels", before: "Phone only", after: "Phone + WhatsApp + Form", delta: "×3", positive: true },
      { label: "Online quote form", before: "Doesn't exist", after: "By service type", delta: "new", positive: true },
      { label: "Estimated PageSpeed score", before: "~40/100", after: "95+/100", delta: "target", positive: true },
    ],
    roi: "In progress",
    roiLabel: "Documented April 16, 2026 — results reported at project close",
    duration: "In progress",
  },
]

function MetricRow({ metric }: { metric: Metric }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
      <span className="text-xs text-white/40 flex-1 pr-4">{metric.label}</span>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-white/20 line-through">{metric.before}</span>
        <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-xs font-bold text-white">{metric.after}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: metric.positive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: metric.positive ? "#4ade80" : "#f87171" }}
        >
          {metric.delta}
        </span>
      </div>
    </div>
  )
}

function CaseCard({ c, lang }: { c: CaseStudy; lang: "es" | "en" }) {
  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:translate-y-[-4px]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: c.verified ? `2px solid ${c.industryColor}60` : c.inProgress ? "2px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: c.verified ? `0 0 40px -15px ${c.industryColor}40` : "none",
      }}
    >
      {/* Banner */}
      {c.verified && (
        <div className="px-6 py-2.5 flex items-center justify-between" style={{ background: c.industryColor }}>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === "es" ? "Caso real verificado" : "Verified real case"}
            </span>
          </div>
          {c.url && (
            <a href={`https://${c.url}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white/80 hover:text-white flex items-center gap-1 transition-colors">
              {c.url}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
      {c.inProgress && (
        <div className="bg-[#6366F1] px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === "es" ? "Proyecto en desarrollo" : "Project in progress"}
            </span>
          </div>
          {c.url && (
            <a href={`https://${c.url}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white/80 hover:text-white transition-colors">
              {lang === "es" ? "Sitio actual" : "Current site"} ↗
            </a>
          )}
        </div>
      )}

      {/* Header */}
      <div className="p-8 pb-6 border-b border-white/[0.06]">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full" style={{ background: `${c.industryColor}18`, color: c.industryColor }}>
            {c.industry}
          </span>
          <span className="text-xs text-white/30 bg-white/[0.06] px-3 py-1 rounded-full">{c.duration}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
        <p className="text-sm font-medium text-[#C4B5FD]">{c.subtitle}</p>
      </div>

      {/* Challenge + Solution */}
      <div className="px-8 py-6 grid gap-4 border-b border-white/[0.06]">
        <div>
          <p className="text-xs font-semibold text-red-400/80 uppercase tracking-wider mb-2">{lang === "es" ? "El problema" : "The problem"}</p>
          <p className="text-sm text-white/45 leading-relaxed">{c.challenge}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-2">{lang === "es" ? "La solución 4cats" : "The 4cats solution"}</p>
          <p className="text-sm text-white/45 leading-relaxed">{c.solution}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-8 py-6 border-b border-white/[0.06] flex-1">
        <p className="text-xs font-semibold text-white/25 uppercase tracking-wider mb-3">
          {c.inProgress ? (lang === "es" ? "Métricas objetivo" : "Target metrics") : (lang === "es" ? "Resultados medibles" : "Measurable results")}
        </p>
        {c.metrics.map((m, i) => <MetricRow key={i} metric={m} />)}
      </div>

      {/* ROI */}
      {c.inProgress ? (
        <div className="px-8 py-6 bg-[#6366F1]/10">
          <p className="text-xs font-semibold text-[#818CF8] uppercase tracking-wider mb-1">{lang === "es" ? "Resultados proyectados" : "Projected results"}</p>
          <p className="text-lg font-bold text-white mb-1">{lang === "es" ? "Pendiente al cierre del proyecto" : "Pending at project close"}</p>
          <p className="text-xs text-white/35">{c.roiLabel}</p>
        </div>
      ) : (
        <div className="px-8 py-6" style={{ background: "linear-gradient(135deg, rgba(124,92,191,0.12) 0%, rgba(99,102,241,0.08) 100%)" }}>
          <p className="text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider mb-1">{lang === "es" ? "Impacto" : "Impact"}</p>
          <p className="text-3xl font-black text-white mb-1">{c.roi}</p>
          <p className="text-xs text-white/35">{c.roiLabel}</p>
        </div>
      )}

      {/* Stack */}
      <div className="px-8 py-5 border-t border-white/[0.06] flex flex-wrap gap-2">
        {c.stack.map(s => (
          <span key={s} className="text-xs font-medium bg-white/[0.06] text-white/50 px-3 py-1 rounded-full border border-white/[0.08]">{s}</span>
        ))}
      </div>
    </div>
  )
}

export default function PortafolioPage() {
  const { lang } = useLang()
  const cases = lang === "es" ? casesEs : casesEn
  const es = lang === "es"

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-[#06030F] pt-32 pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.10] pointer-events-none" style={{ background: "radial-gradient(ellipse, #F97316, transparent)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse, #7C5CBF, transparent)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px" }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <FadeUp>
            <div className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#C4B5FD] bg-white/[0.07] px-5 py-2.5 rounded-full border border-white/[0.12] mb-10">
              {es ? "Casos de éxito reales · ROI medido" : "Real success stories · Measured ROI"}
            </div>
          </FadeUp>

          {/* 4 cats constellation */}
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
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
              {es ? "Resultados que " : "Results measured "}
              <span className="bg-gradient-to-r from-[#F97316] via-[#F59E0B] to-[#D4788A] bg-clip-text text-transparent">
                {es ? "se miden en pesos." : "in real numbers."}
              </span>
            </h1>
            <p className="text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">
              {es
                ? "No vendemos promesas. Vendemos eficiencia financiera. Proyectos reales, con métricas reales, construidos con React y Supabase para empresas chilenas."
                : "We don't sell promises. We sell financial efficiency. Real projects, with real metrics, built with React and Supabase for Chilean businesses."}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── CASOS ── */}
      <section className="bg-[#0A0710] py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cases.map((c, i) => (
              <FadeUp key={c.id} delay={i * 130}>
                <CaseCard c={c} lang={lang} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="bg-[#06030F] py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "< 2s", label: es ? "Tiempo de carga garantizado" : "Guaranteed load time" },
            { val: "95+", label: es ? "PageSpeed en cada entrega" : "PageSpeed on every delivery" },
            { val: "18d", label: es ? "Entrega promedio MVP" : "Average MVP delivery" },
            { val: "100%", label: es ? "Código propiedad del cliente" : "Client-owned codebase" },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div>
                <p className="text-4xl font-black mb-2" style={{ color: "#7C5CBF" }}>{s.val}</p>
                <p className="text-xs text-white/30 font-medium leading-snug">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0A0710] py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {es ? "¿Tu negocio necesita " : "Does your business need "}
              <span className="bg-gradient-to-r from-[#7C5CBF] to-[#D4788A] bg-clip-text text-transparent">
                {es ? "esta transformación?" : "this transformation?"}
              </span>
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto">
              {es
                ? "Cuéntanos tu caso. En menos de 24 horas te preparamos una propuesta con métricas proyectadas para tu industria."
                : "Tell us your case. In less than 24 hours we'll prepare a proposal with projected metrics for your industry."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cotizar" className="btn-squish inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#7C5CBF] text-white font-bold rounded-2xl hover:bg-[#6B4DAE] transition-colors" style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.65)" }}>
                {es ? "Solicitar propuesta gratuita" : "Request free proposal"}
              </Link>
              <Link href="/planes" className="btn-squish inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/[0.18] text-white font-bold rounded-2xl hover:bg-white/[0.06] transition-colors">
                {es ? "Ver planes" : "View plans"}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  )
}
