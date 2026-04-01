"use client"

import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { FadeUp } from "../components/FadeUp"
import { useLang } from "../context/LanguageContext"

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
  url?: string
}

const casesEs: CaseStudy[] = [
  {
    id: 0,
    verified: true,
    url: "plusgrafica.cl",
    industry: "Rotulación & Señalética",
    industryColor: "#F97316",
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
    id: 1,
    industry: "Salud & Bienestar",
    industryColor: "#10B981",
    title: "Clínica Veterinaria · Temuco",
    subtitle: "De WhatsApp caótico a agenda digital inteligente",
    challenge: "El equipo perdía más de 15 horas semanales coordinando citas por WhatsApp y teléfono. El 30% de los turnos quedaban sin confirmar, generando espacios vacíos que no se podían rellenar a tiempo.",
    solution: "Desarrollamos un sistema de agendamiento online con Next.js y Supabase: reservas en tiempo real, confirmaciones automáticas y panel admin para el equipo. Lanzado en 18 días.",
    stack: ["Next.js 15", "Supabase", "TypeScript", "Vercel"],
    metrics: [
      { label: "Horas semanales en coordinación", before: "15 hrs", after: "3 hrs", delta: "−80%", positive: true },
      { label: "Tasa de confirmación de citas", before: "70%", after: "97%", delta: "+38%", positive: true },
      { label: "Reservas online mensuales", before: "0", after: "120+", delta: "nuevo canal", positive: true },
      { label: "Tiempo de carga del sitio", before: "4.2s", after: "0.8s", delta: "−81%", positive: true },
    ],
    roi: "$8.400.000",
    roiLabel: "CLP ahorrados al año en horas operativas",
    duration: "18 días",
  },
  {
    id: 2,
    industry: "Construcción & Inmobiliaria",
    industryColor: "#F59E0B",
    title: "Empresa Constructora · La Araucanía",
    subtitle: "Cotizaciones en Excel a propuestas en 4 horas",
    challenge: "El proceso de cotización tomaba entre 2 y 3 días: el cliente pedía presupuesto, el equipo preparaba un Excel, lo mandaba por correo y esperaba. El 60% de los leads fríos nunca respondían.",
    solution: "Portal de cotización automático con formulario inteligente, cálculo de presupuesto instantáneo y PDF generado en segundos. Panel admin para seguimiento de leads y estados.",
    stack: ["Next.js 15", "Supabase", "TypeScript", "jsPDF", "Vercel"],
    metrics: [
      { label: "Tiempo por cotización", before: "3 días", after: "4 horas", delta: "−94%", positive: true },
      { label: "Conversión de leads entrantes", before: "18%", after: "41%", delta: "+128%", positive: true },
      { label: "Cotizaciones mensuales enviadas", before: "8", after: "23", delta: "+187%", positive: true },
      { label: "Puntuación PageSpeed", before: "52/100", after: "98/100", delta: "+88%", positive: true },
    ],
    roi: "$14.200.000",
    roiLabel: "CLP en nuevos contratos atribuidos al portal (primer trimestre)",
    duration: "22 días",
  },
  {
    id: 3,
    industry: "Retail & E-commerce",
    industryColor: "#8B5CF6",
    title: "Distribuidora de Equipamiento · Sur de Chile",
    subtitle: "Catálogo físico a tienda digital con 180% más ventas",
    challenge: "El negocio dependía 100% del canal presencial y llamadas telefónicas. Sin catálogo digital, los vendedores perdían tiempo en consultas de stock y precios que cambiaban semanalmente.",
    solution: "E-commerce completo con catálogo dinámico administrado desde Supabase, filtros por categoría, carrito y gestión de stock en tiempo real. Un vendedor actualiza precios en 5 minutos.",
    stack: ["Next.js 15", "Supabase", "React 19", "Tailwind CSS", "Vercel"],
    metrics: [
      { label: "Ventas totales mensuales", before: "$2.800.000", after: "$7.840.000", delta: "+180%", positive: true },
      { label: "% ventas canal online", before: "0%", after: "43%", delta: "nuevo canal", positive: true },
      { label: "Tiempo actualización catálogo", before: "2 días", after: "5 minutos", delta: "−99%", positive: true },
      { label: "Velocidad de carga (móvil)", before: "6.1s", after: "1.1s", delta: "−82%", positive: true },
    ],
    roi: "$60.480.000",
    roiLabel: "CLP adicionales generados en el primer año",
    duration: "30 días",
  },
]

const casesEn: CaseStudy[] = [
  {
    id: 0,
    verified: true,
    url: "plusgrafica.cl",
    industry: "Signage & Branding",
    industryColor: "#F97316",
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
    id: 1,
    industry: "Health & Wellness",
    industryColor: "#10B981",
    title: "Veterinary Clinic · Temuco",
    subtitle: "From chaotic WhatsApp to intelligent digital scheduling",
    challenge: "The team was losing over 15 hours per week coordinating appointments via WhatsApp and phone. 30% of appointments went unconfirmed, creating empty slots that couldn't be filled in time.",
    solution: "We built an online scheduling system with Next.js and Supabase: real-time bookings, automatic confirmations, and an admin dashboard for the team. Launched in 18 days.",
    stack: ["Next.js 15", "Supabase", "TypeScript", "Vercel"],
    metrics: [
      { label: "Weekly coordination hours", before: "15 hrs", after: "3 hrs", delta: "−80%", positive: true },
      { label: "Appointment confirmation rate", before: "70%", after: "97%", delta: "+38%", positive: true },
      { label: "Monthly online bookings", before: "0", after: "120+", delta: "new channel", positive: true },
      { label: "Site load time", before: "4.2s", after: "0.8s", delta: "−81%", positive: true },
    ],
    roi: "$8,400,000",
    roiLabel: "CLP saved per year in operational hours",
    duration: "18 days",
  },
  {
    id: 2,
    industry: "Construction & Real Estate",
    industryColor: "#F59E0B",
    title: "Construction Company · La Araucanía",
    subtitle: "From Excel quotes to proposals in 4 hours",
    challenge: "The quoting process took 2–3 days: the client requested a budget, the team prepared an Excel sheet, emailed it, and waited. 60% of cold leads never responded.",
    solution: "Automated quoting portal with smart form, instant budget calculation, and PDF generated in seconds. Admin dashboard for lead tracking and status management.",
    stack: ["Next.js 15", "Supabase", "TypeScript", "jsPDF", "Vercel"],
    metrics: [
      { label: "Time per quote", before: "3 days", after: "4 hours", delta: "−94%", positive: true },
      { label: "Incoming lead conversion", before: "18%", after: "41%", delta: "+128%", positive: true },
      { label: "Monthly quotes sent", before: "8", after: "23", delta: "+187%", positive: true },
      { label: "PageSpeed score", before: "52/100", after: "98/100", delta: "+88%", positive: true },
    ],
    roi: "$14,200,000",
    roiLabel: "CLP in new contracts attributed to the portal (first quarter)",
    duration: "22 days",
  },
  {
    id: 3,
    industry: "Retail & E-commerce",
    industryColor: "#8B5CF6",
    title: "Equipment Distributor · Southern Chile",
    subtitle: "Physical catalog to digital store with 180% more sales",
    challenge: "The business relied 100% on in-person sales and phone calls. Without a digital catalog, salespeople wasted time answering stock and price queries that changed weekly.",
    solution: "Full e-commerce with dynamic catalog managed from Supabase, category filters, cart, and real-time inventory management. A seller can update prices in 5 minutes.",
    stack: ["Next.js 15", "Supabase", "React 19", "Tailwind CSS", "Vercel"],
    metrics: [
      { label: "Total monthly sales", before: "$2,800,000", after: "$7,840,000", delta: "+180%", positive: true },
      { label: "% online channel sales", before: "0%", after: "43%", delta: "new channel", positive: true },
      { label: "Catalog update time", before: "2 days", after: "5 minutes", delta: "−99%", positive: true },
      { label: "Mobile load speed", before: "6.1s", after: "1.1s", delta: "−82%", positive: true },
    ],
    roi: "$60,480,000",
    roiLabel: "CLP in additional revenue generated in the first year",
    duration: "30 days",
  },
]

function MetricRow({ metric }: { metric: Metric }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F4F4F5] last:border-0">
      <span className="text-xs text-[#71717A] flex-1 pr-4">{metric.label}</span>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-[#A1A1AA] line-through">{metric.before}</span>
        <svg className="w-3 h-3 text-[#D4D4D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-xs font-bold text-[#18181B]">{metric.after}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: metric.positive ? "#DCFCE7" : "#FEE2E2", color: metric.positive ? "#16A34A" : "#DC2626" }}
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
      className="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
      style={{ border: c.verified ? "2px solid #F97316" : "1px solid #E4E4E7" }}
    >
      {/* Verified banner */}
      {c.verified && (
        <div className="bg-[#F97316] px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === "es" ? "Caso real verificado" : "Verified real case"}
            </span>
          </div>
          {c.url && (
            <a
              href={`https://${c.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-white/90 hover:text-white flex items-center gap-1 transition-colors"
            >
              {c.url}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
      {/* Header */}
      <div className="p-8 pb-6 border-b border-[#F4F4F5]">
        <div className="flex items-start justify-between mb-4">
          <span
            className="text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full"
            style={{ background: `${c.industryColor}18`, color: c.industryColor }}
          >
            {c.industry}
          </span>
          <span className="text-xs text-[#A1A1AA] bg-[#F4F4F5] px-3 py-1 rounded-full">
            {lang === "es" ? c.duration : c.duration}
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#18181B] mb-2 leading-tight">{c.title}</h3>
        <p className="text-sm font-medium text-[#7C5CBF]">{c.subtitle}</p>
      </div>

      {/* Challenge + Solution */}
      <div className="px-8 py-6 grid grid-cols-1 gap-4 border-b border-[#F4F4F5]">
        <div>
          <p className="text-xs font-semibold text-[#EF4444] uppercase tracking-wider mb-2">
            {lang === "es" ? "El problema" : "The problem"}
          </p>
          <p className="text-sm text-[#52525B] leading-relaxed">{c.challenge}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#10B981] uppercase tracking-wider mb-2">
            {lang === "es" ? "La solución 4cats" : "The 4cats solution"}
          </p>
          <p className="text-sm text-[#52525B] leading-relaxed">{c.solution}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-8 py-6 border-b border-[#F4F4F5] flex-1">
        <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">
          {lang === "es" ? "Resultados medibles" : "Measurable results"}
        </p>
        {c.metrics.map((m, i) => <MetricRow key={i} metric={m} />)}
      </div>

      {/* ROI callout */}
      <div className="px-8 py-6 bg-gradient-to-r from-[#F3EEFF] to-[#EEF2FF]">
        <p className="text-xs font-semibold text-[#7C5CBF] uppercase tracking-wider mb-1">
          {lang === "es" ? "Impacto financiero" : "Financial impact"}
        </p>
        <p className="text-3xl font-black text-[#18181B] mb-1">{c.roi}</p>
        <p className="text-xs text-[#52525B]">{c.roiLabel}</p>
      </div>

      {/* Stack pills */}
      <div className="px-8 py-5 border-t border-[#F4F4F5] flex flex-wrap gap-2">
        {c.stack.map((s) => (
          <span key={s} className="text-xs font-medium bg-[#F4F4F5] text-[#52525B] px-3 py-1 rounded-full">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function PortafolioPage() {
  const { lang } = useLang()
  const cases = lang === "es" ? casesEs : casesEn

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">
        <FadeUp delay={0}>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#7C5CBF] bg-[#F3EEFF] dark:bg-[#1C1630] px-4 py-2 rounded-full inline-block mb-6">
            {lang === "es" ? "Casos de éxito reales · ROI medido" : "Real success stories · Measured ROI"}
          </p>
        </FadeUp>
        <FadeUp delay={100}>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#18181B] dark:text-[#F4F4F6] leading-[1.1] mb-6">
            {lang === "es" ? <>Resultados que<br />se miden en pesos</> : <>Results measured<br />in real numbers</>}
          </h1>
        </FadeUp>
        <FadeUp delay={220}>
          <p className="text-[#52525B] dark:text-[#9090A8] text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === "es"
              ? "No vendemos promesas. Vendemos eficiencia financiera. Proyectos reales, con métricas reales, construidos con React y Supabase para empresas chilenas."
              : "We don't sell promises. We sell financial efficiency. Real projects, with real metrics, built with React and Supabase for Chilean businesses."}
          </p>
        </FadeUp>
      </section>

      {/* CASOS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <FadeUp key={c.id} delay={i * 130}>
              <CaseCard c={c} lang={lang} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* STATS RÁPIDAS */}
      <section className="bg-[#18181B] py-16 text-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "< 2s", label: lang === "es" ? "Tiempo de carga garantizado" : "Guaranteed load time" },
            { val: "95+", label: lang === "es" ? "PageSpeed en cada entrega" : "PageSpeed on every delivery" },
            { val: "18d",  label: lang === "es" ? "Entrega promedio MVP" : "Average MVP delivery" },
            { val: "100%", label: lang === "es" ? "Código propiedad del cliente" : "Client-owned codebase" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-4xl font-black text-[#7C5CBF] mb-2">{s.val}</p>
              <p className="text-xs text-[#A1A1AA] font-medium leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-[#18181B] mb-4">
          {lang === "es" ? "¿Tu negocio necesita este tipo de transformación?" : "Does your business need this kind of transformation?"}
        </h2>
        <p className="text-[#52525B] text-lg mb-10 max-w-xl mx-auto">
          {lang === "es"
            ? "Cuéntanos tu caso. En menos de 24 horas te preparamos una propuesta con métricas proyectadas para tu industria."
            : "Tell us your case. In less than 24 hours we'll prepare a proposal with projected metrics for your industry."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cotizar"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-md hover:bg-[#6B4DAE] transition-all"
            style={{ boxShadow: "0 4px 14px -4px rgba(124, 92, 191, 0.5)" }}
          >
            {lang === "es" ? "Solicitar propuesta gratuita" : "Request free proposal"}
          </Link>
          <Link
            href="/planes"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#E4E4E7] text-[#18181B] font-semibold rounded-md hover:bg-[#FAFAFA] transition-all"
          >
            {lang === "es" ? "Ver planes y precios" : "View plans & pricing"}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
