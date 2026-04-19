"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import LucyCat from "./components/cats/LucyCat"
import BillieCat from "./components/cats/BillieCat"
import LaylaCat from "./components/cats/LaylaCat"
import RoxanneCat from "./components/cats/RoxanneCat"
import { useAnimatedCounter } from "./hooks/useAnimatedCounter"
import { useLang } from "./context/LanguageContext"
import { t } from "./translations"
import Navbar from "./components/Navbar"
import { FadeUp } from "./components/FadeUp"

function PawIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
      <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
      <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
      <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function BentoStatCell({
  label, target, suffix = "", colSpan = 1, bg, textColor = "text-white", labelColor = "text-white/60", active, duration = 1600,
}: {
  label: string; target: number; suffix?: string; colSpan?: number; bg: string;
  textColor?: string; labelColor?: string; active: boolean; duration?: number;
}) {
  const count = useAnimatedCounter(target, active, duration)
  return (
    <div className={`bento-cell rounded-3xl p-8 flex flex-col justify-between min-h-[160px] ${colSpan === 2 ? "col-span-2" : ""} ${bg}`}>
      <p className={`text-xs font-semibold tracking-widest uppercase ${labelColor}`}>{label}</p>
      <p className={`text-5xl md:text-6xl font-black leading-none mt-4 ${textColor}`}>{count}{suffix}</p>
    </div>
  )
}

function PlanCard({
  index, renderCat, catColor, title, subtitle, badge, features, cta, featured = false,
}: {
  index: number; renderCat: (hovered: boolean) => React.ReactNode; catColor: string; title: string; subtitle: string;
  badge?: string; features: string[]; cta: string; featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <FadeUp delay={index * 120}>
      <div
        className="relative flex flex-col rounded-3xl overflow-hidden h-full transition-all duration-300 cursor-default"
        style={{
          border: featured ? `2px solid ${catColor}` : "1px solid rgba(255,255,255,0.08)",
          background: featured ? "linear-gradient(135deg, #100B20 0%, #1C1235 100%)" : "rgba(255,255,255,0.03)",
          boxShadow: hovered
            ? `0 0 80px -20px ${catColor}50`
            : featured ? `0 0 50px -20px ${catColor}35` : "none",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {badge && (
          <div
            className="absolute top-4 right-4 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full z-10"
            style={{ background: catColor, color: "#fff" }}
          >
            {badge}
          </div>
        )}

        {/* Cat illustration area */}
        <div
          className="flex justify-center pt-10 pb-4 relative overflow-hidden"
          style={{ background: `radial-gradient(ellipse at center top, ${catColor}18 0%, transparent 70%)` }}
        >
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[60px] opacity-25 pointer-events-none transition-opacity duration-300"
            style={{ background: catColor, opacity: hovered ? 0.4 : 0.2 }}
          />
          {renderCat(hovered)}
        </div>

        <div className="flex flex-col flex-1 p-8">
          <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
          <p className="text-sm text-white/60 mb-8 leading-relaxed italic">{subtitle}</p>

          <ul className="space-y-3 flex-1 mb-8">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5" style={{ color: catColor }}>
                  <CheckIcon />
                </span>
                <span className="text-sm text-white/80">{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/cotizar"
            className="btn-squish flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 hover:shadow-lg"
            style={
              featured
                ? { background: catColor, color: "#fff", boxShadow: `0 4px 20px -4px ${catColor}80` }
                : { border: `1.5px solid ${catColor}50`, color: catColor }
            }
          >
            <PawIcon className="w-4 h-4" />
            {cta}
          </Link>
        </div>
      </div>
    </FadeUp>
  )
}

function CatHoverWrapper({ renderCat, name, className = "" }: { renderCat: (hovered: boolean) => React.ReactNode, name?: string, className?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`flex flex-col items-center group ${className}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative">
        {renderCat(hovered)}
      </div>
      {name && (
        <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white/50 whitespace-nowrap">
          {name}
        </span>
      )}
    </div>
  )
}

export default function Home() {
  const { lang } = useLang()
  const tr = t[lang].home

  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const es = lang === "es"

  const daughters = [
    {
      key: "billie",
      renderCat: (h: boolean) => <BillieCat className="w-[160px] h-[192px] relative z-10" />,
      color: "#9B8EB2",
      name: "Billie",
      quote: es ? '"Tu marca merece diseño que haga parar el scroll."' : '"Your brand deserves design that stops the scroll."',
      role: es ? "Diseño & Experiencia" : "Design & Experience",
      desc: es
        ? "Cada píxel tiene un propósito. Billie convierte tu identidad en una experiencia visual que conecta emocionalmente con tus clientes desde el primer segundo."
        : "Every pixel has a purpose. Billie transforms your identity into a visual experience that emotionally connects with your clients from the first second.",
      tags: ["UI/UX", "Branding", "Figma", "Motion"],
    },
    {
      key: "layla",
      renderCat: (h: boolean) => <LaylaCat className="w-[160px] h-[192px] relative z-10" />,
      color: "#9370db",
      name: "Layla",
      quote: es ? '"Código que funciona perfecto aunque nadie lo vea."' : '"Code that works perfectly even when no one sees it."',
      role: es ? "Desarrollo & Arquitectura" : "Development & Architecture",
      desc: es
        ? "Layla construye sobre cimientos sólidos. Next.js, TypeScript, Supabase — tecnología de producción que escala contigo sin vendor lock-in."
        : "Layla builds on solid foundations. Next.js, TypeScript, Supabase — production technology that scales with you without vendor lock-in.",
      tags: ["Next.js", "TypeScript", "Supabase", "API"],
    },
    {
      key: "roxanne",
      renderCat: (h: boolean) => <RoxanneCat className="w-[160px] h-[192px] relative z-10" />,
      color: "#D4788A",
      name: "Roxanne",
      quote: es ? '"Tus visitas ya son clientes. Solo les falta el empuje correcto."' : '"Your visitors are already clients. They just need the right push."',
      role: es ? "Marketing & Conversión" : "Marketing & Conversion",
      desc: es
        ? "Roxanne no cree en el tráfico. Cree en los resultados. Automatizaciones, funnels y estrategia digital que convierte visitas en ventas reales."
        : "Roxanne doesn't believe in traffic. She believes in results. Automations, funnels and digital strategy that converts visits into real sales.",
      tags: ["SEO", "Funnels", "Analytics", "IA"],
    },
  ]

  const plans = [
    {
      catColor: "#9370db",
      renderCat: (h: boolean) => (
        <div className="relative flex items-end justify-center">
          <BillieCat className="w-[70px] h-[84px] opacity-40 -mr-4 mb-1" />
          <LaylaCat className="w-[110px] h-[132px] relative z-10" />
        </div>
      ),
      title: es ? "Vitrina Digital" : "Digital Showcase",
      subtitle: es ? "Billie diseña y Layla construye: la base sólida que tu marca necesita para empezar con el pie derecho." : "Billie designs and Layla builds: the solid foundation your brand needs to start on the right foot.",
      features: es
        ? ["Diseño UI/UX exclusivo por Billie", "Landing page optimizada por Layla", "Diseño responsive (móvil + desktop)", "Formulario de contacto funcional", "95+ en PageSpeed garantizado", "Entrega en 18 días hábiles"]
        : ["Exclusive UI/UX design by Billie", "Optimized landing page by Layla", "Responsive design (mobile + desktop)", "Functional contact form", "95+ PageSpeed guaranteed", "Delivery in 18 business days"],
      cta: es ? "Quiero mi vitrina" : "I want my showcase",
      featured: false,
    },
    {
      catColor: "#D4788A",
      renderCat: (h: boolean) => <RoxanneCat className="w-[130px] h-[156px] relative z-10" />,
      title: es ? "Motor de Leads" : "Lead Engine",
      badge: es ? "Más elegido" : "Most chosen",
      subtitle: es ? "Roxanne dice: una web bonita no alcanza. Necesitás una máquina de captar clientes que no pare de vender." : "Roxanne says: a pretty website isn't enough. You need a client-capturing machine that never stops selling.",
      features: es
        ? ["Sistema de captación con base de datos real", "Panel de gestión de leads en tiempo real", "Automatizaciones de seguimiento por mail", "Analíticas y reportes mensuales claros", "Integración con WhatsApp y Email", "Diseño de marca + identidad visual completa", "Soporte 30 días post-entrega"]
        : ["Lead capture system with real database", "Real-time lead management panel", "Email follow-up automations", "Clear monthly analytics and reports", "WhatsApp and Email integration", "Full brand design + visual identity", "30-day post-delivery support"],
      cta: es ? "Quiero captar más clientes" : "I want more clients",
      featured: true,
    },
    {
      catColor: "#f5a855",
      renderCat: (h: boolean) => <LucyCat className="w-[130px] h-[156px] relative z-10" />,
      title: es ? "Partner Tecnológico" : "Technology Partner",
      subtitle: es ? "Lucy dice: cuando estés listo para liderar tu industria, yo te acompaño en cada paso del camino." : "Lucy says: when you're ready to lead your industry, I'll be with you every step of the way.",
      features: es
        ? ["Sistema a medida con arquitectura escalable", "Integración de IA en tus procesos internos", "Panel de administración personalizado", "Automatización avanzada de operaciones", "Mantenimiento y evolución continua", "Acceso prioritario al equipo completo", "Estrategia digital de largo plazo"]
        : ["Custom system with scalable architecture", "AI integration in your internal processes", "Custom administration panel", "Advanced operations automation", "Continuous maintenance and evolution", "Priority access to the full team", "Long-term digital strategy"],
      cta: es ? "Hablar con Lucy" : "Talk to Lucy",
      featured: false,
    },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ─────────── HERO ─────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#06030F] overflow-hidden">
        {/* Atmospheric blobs */}
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full blur-[200px] opacity-[0.14] pointer-events-none animate-pulse-slow" style={{ background: "radial-gradient(ellipse, #7C5CBF, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/6 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.10] pointer-events-none animate-pulse-slow" style={{ background: "radial-gradient(ellipse, #D4788A, transparent)", animationDelay: "1s" }} />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[180px] opacity-[0.07] pointer-events-none animate-pulse-slow" style={{ background: "radial-gradient(ellipse, #f5a855, transparent)", animationDelay: "2s" }} />

        {/* Grain noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-24">
          {/* Badge */}
          <FadeUp delay={0}>
            <div className="mb-10 text-xs font-semibold tracking-widest uppercase text-[#C4B5FD] bg-white/[0.07] px-5 py-2.5 rounded-full border border-white/[0.12]">
              {tr.badge}
            </div>
          </FadeUp>

          {/* Lucy + daughters constellation */}
          <FadeUp delay={100}>
            <div className="relative flex items-end justify-center mb-10 h-[280px]">
              <CatHoverWrapper 
                name="Billie"
                className="opacity-70 hover:opacity-100 transition-opacity duration-500 z-0 -mr-6 mb-2 cursor-pointer" 
                renderCat={(h) => <BillieCat className="w-[84px] h-[100px]" />} 
              />
              <CatHoverWrapper 
                name="Layla"
                className="opacity-55 hover:opacity-100 transition-opacity duration-500 z-0 -mr-4 mb-8 cursor-pointer" 
                renderCat={(h) => <LaylaCat className="w-[66px] h-[80px]" />} 
              />

              {/* Lucy — center, large */}
              <CatHoverWrapper 
                name="Lucy"
                className="relative z-10 mx-2 cursor-pointer mb-0" 
                renderCat={(h) => (
                <>
                  <div className="absolute inset-0 blur-[70px] scale-[1.6] opacity-45 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, #f5a85535, transparent)" }} />
                  <LucyCat className="w-[200px] h-[240px] relative drop-shadow-2xl" />
                </>
              )} />

              <CatHoverWrapper 
                name="Roxanne"
                className="opacity-55 hover:opacity-100 transition-opacity duration-500 z-0 -ml-4 mb-8 cursor-pointer" 
                renderCat={(h) => <RoxanneCat className="w-[66px] h-[80px]" />} 
              />
            </div>
          </FadeUp>

          {/* Lucy label */}
          <FadeUp delay={180}>
            <p className="flex items-center gap-3 text-[#f5a855] font-bold tracking-[0.2em] uppercase text-xs mb-6">
              <span className="w-10 h-px bg-[#f5a855]/40" />
              {es ? "Lucy habla" : "Lucy speaks"}
              <span className="w-10 h-px bg-[#f5a855]/40" />
            </p>
          </FadeUp>

          {/* Main headline */}
          <FadeUp delay={260}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.92] mb-8 max-w-5xl">
              <span className="text-white">{es ? "Construimos el" : "We build the"}</span>
              <br />
              <span className="bg-gradient-to-r from-[#9B8EB2] via-[#C4B5FD] to-[#D4788A] bg-clip-text text-transparent">
                {es ? "futuro digital" : "digital future"}
              </span>
              <br />
              <span className="text-white">{es ? "de tu empresa." : "of your business."}</span>
            </h1>
          </FadeUp>

          <FadeUp delay={360}>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-12 font-medium">
              {es
                ? "Soy Lucy. Junto a mis hijas Billie, Layla y Roxanne hemos construido más de 50 proyectos que generan resultados reales para empresas del sur de Chile."
                : "I'm Lucy. Together with my daughters Billie, Layla and Roxanne we've built over 50 projects that generate real results for businesses in southern Chile."}
            </p>
          </FadeUp>

          <FadeUp delay={440}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/planes"
                className="btn-squish inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7C5CBF] text-white font-bold rounded-2xl hover:bg-[#6B4DAE] transition-colors"
                style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.65)" }}
              >
                <PawIcon className="w-4 h-4" />
                {tr.cta1}
              </Link>
              <Link
                href="/cotizar"
                className="btn-squish inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/[0.18] text-white font-bold rounded-2xl hover:bg-white/[0.07] transition-colors"
              >
                <PawIcon className="w-4 h-4 text-[#7C5CBF]" />
                {tr.cta2}
              </Link>
            </div>
          </FadeUp>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-white/40" />
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">{es ? "Conocé el equipo" : "Meet the team"}</p>
        </div>
      </section>

      {/* ─────────── LAS HIJAS ─────────── */}
      <section className="bg-[#0A0710] py-32 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
                {es ? "El equipo" : "The team"}
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {es ? "Las hijas de Lucy" : "Lucy's daughters"}
              </h2>
              <p className="text-white/50 text-lg mt-5 max-w-xl mx-auto leading-relaxed">
                {es
                  ? "Cada una experta en su área. Juntas, cubren todo lo que tu empresa necesita para crecer."
                  : "Each an expert in their area. Together, they cover everything your business needs to grow."}
              </p>
            </div>
          </FadeUp>

          <div>
            {daughters.map((d, idx) => (
              <FadeUp key={d.key} delay={idx * 80}>
                <div
                  className={`flex flex-col gap-10 py-16 ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center ${idx < daughters.length - 1 ? "border-b border-white/[0.06]" : ""}`}
                >
                  <CatHoverWrapper className="relative flex-shrink-0 flex items-center justify-center w-[200px] h-[220px]" renderCat={(h) => (
                    <>
                      <div
                        className="absolute inset-0 rounded-full blur-[70px] opacity-30 pointer-events-none"
                        style={{ background: d.color }}
                      />
                      {d.renderCat(h)}
                    </>
                  )} />

                  {/* Content */}
                  <div className={`flex-1 ${idx % 2 === 1 ? "md:text-right" : ""}`}>
                    <p className="text-xs font-black tracking-[0.2em] uppercase mb-4" style={{ color: d.color }}>
                      {d.role}
                    </p>
                    <blockquote className="text-2xl md:text-3xl font-black text-white leading-tight mb-5 italic">
                      {d.quote}
                      <span className="block mt-4 text-lg not-italic font-bold opacity-80" style={{ color: d.color }}>
                        — {d.name}
                      </span>
                    </blockquote>
                    <p className="text-white/60 text-base leading-relaxed mb-7 max-w-lg">
                      {d.desc}
                    </p>
                    <div className={`flex flex-wrap gap-2 ${idx % 2 === 1 ? "md:justify-end" : ""}`}>
                      {d.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-bold px-3 py-1.5 rounded-full"
                          style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── PLANES ─────────── */}
      <section className="relative py-32 bg-[#06030F] overflow-hidden border-t border-white/[0.06]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[220px] opacity-[0.07] pointer-events-none animate-pulse-slow" style={{ background: "radial-gradient(ellipse, #7C5CBF, transparent)" }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
                {es ? "Lucy te guía" : "Lucy guides you"}
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                {es ? "¿Cuál es el siguiente nivel\npara tu empresa?" : "What's the next level\nfor your business?"}
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
                {es
                  ? "No existe el plan universal. Existe el plan correcto para tu momento. Cada hija está lista para acompañarte."
                  : "There's no universal plan. There's the right plan for your moment. Each daughter is ready to guide you."}
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <PlanCard key={idx} index={idx} {...plan} />
            ))}
          </div>

          <FadeUp>
            <p className="text-center text-white/50 text-sm mt-12">
              {es ? "¿No sabés cuál elegir? " : "Not sure which to choose? "}
              <Link href="/cotizar" className="text-[#C4B5FD] hover:text-white underline underline-offset-4 transition-colors font-semibold">
                {es ? "Contanos tu caso y te asesoramos gratis." : "Tell us your case and we'll advise you for free."}
              </Link>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─────────── STATS ─────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <FadeUp>
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BentoStatCell label={tr.stat1} target={50} suffix="+" colSpan={2} bg="bg-[#0F0F12] dark:bg-[#1E1E26]" textColor="text-white text-7xl" labelColor="text-[#7C5CBF]" active={statsVisible} duration={1400} />
            <BentoStatCell label={tr.stat2} target={98} suffix="%" bg="bg-[#7C5CBF]" textColor="text-white" labelColor="text-[#E5D8FF]/70" active={statsVisible} duration={1600} />
            <BentoStatCell label={tr.stat3} target={3} suffix={es ? " años" : " yrs"} bg="bg-[#F3EEFF] dark:bg-[#1C1630]" textColor="text-[#18181B] dark:text-[#F4F4F6]" labelColor="text-[#7C5CBF]" active={statsVisible} duration={800} />
            <BentoStatCell label="PageSpeed" target={95} suffix="+" bg="bg-[#F3EEFF] dark:bg-[#1C1630]" textColor="text-[#18181B] dark:text-[#F4F4F6] text-4xl" labelColor="text-[#7C5CBF]" active={statsVisible} duration={1200} />
            <div className="bento-cell col-span-2 bg-gradient-to-r from-[#7C5CBF] to-[#9B72F0] rounded-3xl p-8 flex flex-col justify-between min-h-[140px]">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/70">
                {es ? "Carga garantizada" : "Guaranteed load"}
              </p>
              <p className="text-5xl font-black text-white leading-none mt-4">{"< 2s"}</p>
            </div>
            <BentoStatCell label={es ? "Entrega MVP" : "MVP delivery"} target={18} suffix="d" bg="bg-[#0F0F12] dark:bg-[#1E1E26]" textColor="text-white text-4xl" labelColor="text-[#7C5CBF]" active={statsVisible} duration={900} />
          </div>
        </FadeUp>
      </section>

      {/* ─────────── STACK ─────────── */}
      <section className="relative py-24 overflow-hidden">
        <style>{`
          @keyframes twinkle {
            0%,100% { opacity: var(--star-max); transform: scale(1); }
            50%      { opacity: var(--star-min); transform: scale(0.6); }
          }
        `}</style>
        <div className="absolute inset-0 bg-[#06030F]" />
        {Array.from({ length: 120 }, (_, i) => {
          const size = i % 7 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1
          const max = i % 5 === 0 ? 1 : i % 3 === 0 ? 0.7 : 0.45
          const min = max * 0.2
          const dur = 2 + (i % 8) * 0.7
          const delay = (i * 0.37) % 6
          return (
            <div key={i} className="absolute rounded-full bg-white pointer-events-none" style={{ width: size, height: size, left: `${(i * 137.5) % 100}%`, top: `${(i * 97.3) % 100}%`, "--star-max": max, "--star-min": min, animation: `twinkle ${dur}s ${delay}s ease-in-out infinite` } as React.CSSProperties} />
          )
        })}
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[300px] rounded-full blur-[120px] opacity-20 pointer-events-none animate-pulse-slow" style={{ background: "radial-gradient(ellipse, #7C5CBF, transparent)" }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[280px] rounded-full blur-[100px] opacity-15 pointer-events-none animate-pulse-slow" style={{ background: "radial-gradient(ellipse, #4B2D8F, transparent)", animationDelay: "2s" }} />

        <div className="relative max-w-5xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#C4B5FD] bg-white/10 px-4 py-2 rounded-full inline-block mb-4">
              {tr.stackBadge}
            </p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">{tr.stackTitle}</h2>
            <p className="text-[#E5D8FF]/80 text-base max-w-xl mx-auto leading-relaxed">{tr.stackDesc}</p>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tr.stackItems.map((item, idx) => (
              <FadeUp key={idx} delay={idx * 80}>
                <div className="bento-cell glass-card rounded-3xl p-6 cursor-default h-full relative group hover:bg-white/[0.12] transition-colors">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 font-black text-xs tracking-tight transition-transform group-hover:scale-110" style={{ backgroundColor: "rgba(124,92,191,0.25)", color: "#E5D8FF", border: "1px solid rgba(196,181,253,0.2)" }}>
                    {item.name.split(" ")[0].slice(0, 2).toUpperCase()}
                  </div>
                  <p className="font-bold text-white text-sm mb-1">{item.name}</p>
                  <p className="text-xs text-[#E5D8FF]/70 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <p className="text-center text-xs text-white/50 mt-8 font-medium">
            {es ? "Código abierto · Sin vendor lock-in · Tu propiedad intelectual" : "Open source · No vendor lock-in · Your intellectual property"}
          </p>
        </div>
      </section>

      {/* ─────────── CTA FINAL ─────────── */}
      <section className="bg-[#0A0710] py-32 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeUp>
            <CatHoverWrapper className="relative inline-block mb-10 cursor-pointer" renderCat={(h) => (
              <>
                <div className="absolute inset-0 blur-[80px] scale-[1.8] opacity-35 pointer-events-none rounded-full animate-pulse-slow" style={{ background: "radial-gradient(circle, #f5a85540, transparent)" }} />
                <LucyCat className="w-[140px] h-[168px] relative z-10 mx-auto" />
              </>
            )} />
          </FadeUp>

          <FadeUp delay={100}>
            <p className="flex items-center justify-center gap-3 text-[#f5a855] font-bold tracking-[0.2em] uppercase text-xs mb-7">
              <span className="w-10 h-px bg-[#f5a855]/40" />
              {es ? "Lucy, en persona" : "Lucy, in person"}
              <span className="w-10 h-px bg-[#f5a855]/40" />
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
              {es ? "Tu empresa merece " : "Your business deserves "}
              <span className="bg-gradient-to-r from-[#7C5CBF] to-[#D4788A] bg-clip-text text-transparent">
                {es ? "el mejor equipo." : "the best team."}
              </span>
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              {es
                ? "Cuéntanos tu proyecto. Mis hijas y yo te preparamos una propuesta en menos de 24 horas."
                : "Tell us about your project. My daughters and I will prepare a proposal in less than 24 hours."}
            </p>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cotizar"
                className="btn-squish inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#7C5CBF] text-white font-bold rounded-2xl hover:bg-[#6B4DAE] transition-colors text-base"
                style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.65)" }}
              >
                <PawIcon className="w-5 h-5" />
                {tr.ctaBtn}
              </Link>
              <Link
                href="/planes"
                className="btn-squish inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/[0.18] text-white font-bold rounded-2xl hover:bg-white/[0.07] transition-colors text-base"
              >
                {es ? "Ver todos los planes" : "See all plans"}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  )
}
