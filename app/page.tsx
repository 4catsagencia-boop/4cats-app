"use client"

import Link from "next/link"
import { useState, useRef, useEffect, type MouseEvent } from "react"
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
      {/* Almohadilla central */}
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      {/* Dedo izquierdo exterior */}
      <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
      {/* Dedo izquierdo interior */}
      <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
      {/* Dedo derecho interior */}
      <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
      {/* Dedo derecho exterior */}
      <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
    </svg>
  )
}

const catComponents = {
  lucy: LucyCat,
  billie: BillieCat,
  layla: LaylaCat,
  roxanne: RoxanneCat,
} as const

const catMeta = {
  lucy:    { color: "#f5a855", song: "Lucy in the Sky" },
  billie:  { color: "#9B8EB2", song: "Billie Jean" },
  layla:   { color: "#9370db", song: "Layla" },
  roxanne: { color: "#D4788A", song: "Roxanne" },
} as const

type CatKey = keyof typeof catComponents

function CatCard({ catKey, index, greeting }: { catKey: CatKey; index: number; greeting: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const { lang } = useLang()
  const tr = t[lang].home
  const Component = catComponents[catKey]
  const meta = catMeta[catKey]
  const catTr = tr.cats[catKey]

  return (
    <div
      className="relative group"
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative bg-white rounded-3xl p-8 transition-all duration-300 overflow-hidden"
        style={{
          boxShadow: isHovered
            ? `0 20px 40px -12px ${meta.color}40, 0 8px 16px -8px rgba(0,0,0,0.1)`
            : "0 4px 20px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(${meta.color} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${meta.color}20 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
        <div className="relative flex justify-center mb-6">
          <Component isHovered={isHovered} className="w-[130px] h-[156px]" />
        </div>
        <div className="relative text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-300" style={{ color: meta.color }}>
            {meta.song}
          </p>
          <h3 className="text-2xl font-bold text-[#18181B] mb-1">{catKey.charAt(0).toUpperCase() + catKey.slice(1)}</h3>
          <p className="text-sm font-medium text-[#7C5CBF] mb-3">{catTr.role}</p>
          <p className="text-sm text-[#52525B] leading-relaxed">{catTr.desc}</p>
        </div>
        <div
          className="absolute -top-2 right-4 bg-white rounded-xl px-3 py-2 shadow-lg transition-all duration-300 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
            border: `2px solid ${meta.color}30`,
          }}
        >
          <p className="text-xs font-medium text-[#52525B]">{greeting} {catKey.charAt(0).toUpperCase() + catKey.slice(1)}</p>
          <div
            className="absolute -bottom-2 right-6 w-3 h-3 bg-white rotate-45"
            style={{ borderRight: `2px solid ${meta.color}30`, borderBottom: `2px solid ${meta.color}30` }}
          />
        </div>
      </div>
    </div>
  )
}

const catKeys: CatKey[] = ["lucy", "billie", "layla", "roxanne"]

/* ── Kinetic H1: cursor parallax ── */
function KineticH1({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function onMove(e: MouseEvent<HTMLHeadingElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setTilt({ x, y })
  }

  const words = text.split("\n").flatMap((line, li, arr) => {
    const ws = line.split(" ").map((w, wi, wArr) => ({
      word: w,
      key: `${li}-${wi}`,
      space: wi < wArr.length - 1,
      br: false,
    }))
    if (li < arr.length - 1) ws.push({ word: "", key: `br-${li}`, space: false, br: true })
    return ws
  })

  const wordCount = words.filter(w => !w.br).length

  return (
    <h1
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1200px) rotateX(${-tilt.y * 2.5}deg) rotateY(${tilt.x * 2.5}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.6s ease" : "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        cursor: "default",
      }}
    >
      {words.map((item, globalIdx) =>
        item.br ? (
          <br key={item.key} />
        ) : (
          <span
            key={item.key}
            className="inline-block"
            style={
              mounted
                ? {
                    animation: `fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) ${globalIdx * 55}ms both`,
                  }
                : { opacity: 1 }
            }
          >
            {item.word}
            {item.space && "\u00A0"}
          </span>
        )
      )}
    </h1>
  )
}

/* ── Bento stat cell con contador animado ── */
function BentoStatCell({
  label,
  target,
  suffix = "",
  prefix = "",
  colSpan = 1,
  bg,
  textColor = "text-white",
  labelColor = "text-white/60",
  active,
  duration = 1600,
}: {
  label: string
  target: number
  suffix?: string
  prefix?: string
  colSpan?: number
  bg: string
  textColor?: string
  labelColor?: string
  active: boolean
  duration?: number
}) {
  const count = useAnimatedCounter(target, active, duration)
  return (
    <div
      className={`bento-cell rounded-3xl p-8 flex flex-col justify-between min-h-[160px] ${colSpan === 2 ? "col-span-2" : ""} ${bg}`}
    >
      <p className={`text-xs font-semibold tracking-widest uppercase ${labelColor}`}>{label}</p>
      <p className={`text-5xl md:text-6xl font-black leading-none mt-4 ${textColor}`}>
        {prefix}{count}{suffix}
      </p>
    </div>
  )
}

export default function Home() {
  const { lang } = useLang()
  const tr = t[lang].home

  /* ── Stats inView para contadores ── */
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect() } },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F0F12] transition-colors">
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="text-center mb-8">
          <FadeUp delay={0}>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#7C5CBF] bg-[#F3EEFF] dark:bg-[#1C1630] px-4 py-2 rounded-full inline-block mb-6">
              {tr.badge}
            </p>
          </FadeUp>

          <KineticH1
            text={tr.h1}
            className="text-5xl md:text-6xl font-bold tracking-tight text-[#18181B] dark:text-[#F4F4F6] leading-[1.1] mb-6"
          />

          <FadeUp delay={300}>
            <p className="text-[#52525B] dark:text-[#9090A8] text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              {tr.subtitle}
            </p>
          </FadeUp>

          <FadeUp delay={420}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/planes" className="btn-squish inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-xl hover:bg-[#6B4DAE] transition-colors shadow-lg shadow-[#7C5CBF]/25">
                <PawIcon className="w-4 h-4" />
                {tr.cta1}
              </Link>
              <Link href="/cotizar" className="btn-squish inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#E4E4E7] dark:border-[#2A2A35] text-[#18181B] dark:text-[#F4F4F6] font-semibold rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#1E1E26] transition-colors">
                <PawIcon className="w-4 h-4 text-[#7C5CBF]" />
                {tr.cta2}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* GATAS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {catKeys.map((catKey, index) => (
            <CatCard key={catKey} catKey={catKey} index={index} greeting={tr.catGreeting} />
          ))}
        </div>
      </section>

      {/* POR QUE 4CATS */}
      <section className="bg-[#FAFAFA] dark:bg-[#141418] py-24 border-y border-[#E4E4E7] dark:border-[#2A2A35] transition-colors">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold text-[#18181B] dark:text-[#F4F4F6] tracking-tight mb-16">{tr.whyTitle}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {tr.why.map((item, idx) => (
              <FadeUp key={idx} delay={idx * 120}>
                <div className="bento-cell h-full bg-white dark:bg-[#1E1E26] p-8 rounded-3xl border border-[#E4E4E7] dark:border-[#2A2A35] hover:border-[#7C5CBF]/40 dark:hover:border-[#7C5CBF]/40 shadow-sm hover:shadow-lg hover:shadow-[#7C5CBF]/10 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3EEFF] dark:bg-[#1C1630] flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {idx === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {idx === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                      {idx === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F6] mb-3">{item.title}</h3>
                  <p className="text-[#52525B] dark:text-[#9090A8] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* STACK — glassmorphism sobre gradiente */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4B2D8F] via-[#7C5CBF] to-[#2D1B69] dark:from-[#1A0F35] dark:via-[#2E1A5C] dark:to-[#0D0820]" />
        {/* Mesh noise overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#C4B5FD] bg-white/10 px-4 py-2 rounded-full inline-block mb-4">
              {tr.stackBadge}
            </p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">{tr.stackTitle}</h2>
            <p className="text-[#C4B5FD] text-base max-w-xl mx-auto leading-relaxed">{tr.stackDesc}</p>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tr.stackItems.map((item, idx) => (
              <FadeUp key={idx} delay={idx * 80}>
                <div className="bento-cell glass-card rounded-3xl p-6 cursor-default h-full">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 font-black text-xs tracking-tight"
                    style={{ backgroundColor: "rgba(124, 92, 191, 0.25)", color: "#E5D8FF", border: "1px solid rgba(196, 181, 253, 0.2)" }}
                  >
                    {item.name.split(" ")[0].slice(0, 2).toUpperCase()}
                  </div>
                  <p className="font-bold text-white text-sm mb-1">{item.name}</p>
                  <p className="text-xs text-[#C4B5FD]/80 leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <p className="text-center text-xs text-white/40 mt-8">
            {lang === "es"
              ? "Código abierto · Sin vendor lock-in · Tu propiedad intelectual"
              : "Open source · No vendor lock-in · Your intellectual property"}
          </p>
        </div>
      </section>

      {/* STATS — Bento Grid con contadores animados */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <FadeUp>
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BentoStatCell
              label={tr.stat1}
              target={50}
              suffix="+"
              colSpan={2}
              bg="bg-[#0F0F12] dark:bg-[#1E1E26]"
              textColor="text-white text-7xl"
              labelColor="text-[#7C5CBF]"
              active={statsVisible}
              duration={1400}
            />
            <BentoStatCell
              label={tr.stat2}
              target={98}
              suffix="%"
              bg="bg-[#7C5CBF]"
              textColor="text-white"
              labelColor="text-[#E5D8FF]/70"
              active={statsVisible}
              duration={1600}
            />
            <BentoStatCell
              label={tr.stat3}
              target={3}
              suffix={lang === "es" ? " años" : " yrs"}
              bg="bg-[#F3EEFF] dark:bg-[#1C1630]"
              textColor="text-[#18181B] dark:text-[#F4F4F6]"
              labelColor="text-[#7C5CBF]"
              active={statsVisible}
              duration={800}
            />
            <BentoStatCell
              label="PageSpeed"
              target={95}
              suffix="+"
              bg="bg-[#F3EEFF] dark:bg-[#1C1630]"
              textColor="text-[#18181B] dark:text-[#F4F4F6] text-4xl"
              labelColor="text-[#7C5CBF]"
              active={statsVisible}
              duration={1200}
            />
            <div className="bento-cell col-span-2 bg-gradient-to-r from-[#7C5CBF] to-[#9B72F0] rounded-3xl p-8 flex flex-col justify-between min-h-[140px]">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/70">
                {lang === "es" ? "Carga garantizada" : "Guaranteed load"}
              </p>
              <p className="text-5xl font-black text-white leading-none mt-4">{"< 2s"}</p>
            </div>
            <BentoStatCell
              label={lang === "es" ? "Entrega MVP" : "MVP delivery"}
              target={18}
              suffix="d"
              bg="bg-[#0F0F12] dark:bg-[#1E1E26]"
              textColor="text-white text-4xl"
              labelColor="text-[#7C5CBF]"
              active={statsVisible}
              duration={900}
            />
          </div>
        </FadeUp>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[#F3EEFF] dark:bg-[#1C1630] p-12 rounded-3xl relative overflow-hidden transition-colors"
          style={{ boxShadow: "0 8px 32px -8px rgba(124, 92, 191, 0.2)" }}
        >
          <div className="z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#18181B] dark:text-[#F4F4F6] mb-4">{tr.ctaTitle}</h2>
            <p className="text-[#52525B] dark:text-[#9090A8] text-lg mb-8 max-w-md">
              {tr.ctaDesc}
            </p>
            <Link
              href="/cotizar"
              className="btn-squish inline-flex items-center gap-2 px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-xl hover:bg-[#6B4DAE] transition-colors"
              style={{ boxShadow: "0 4px 14px -4px rgba(124, 92, 191, 0.5)" }}
            >
              <PawIcon className="w-4 h-4" />
              {tr.ctaBtn}
            </Link>
          </div>
          <div className="flex gap-4 items-end">
            <div className="transform hover:scale-105 transition-transform">
              <LucyCat isHovered={false} />
            </div>
            <div className="transform hover:scale-105 transition-transform -ml-8">
              <BillieCat isHovered={false} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
