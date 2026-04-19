"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import RoxanneCat from "../components/cats/RoxanneCat";
import LaylaCat from "../components/cats/LaylaCat";
import LucyCat from "../components/cats/LucyCat";
import { fetchPlanesPublicados, type Plan } from "@/utils/supabase";
import { useLang } from "../context/LanguageContext";
import { t } from "../translations";
import { FadeUp } from "../components/FadeUp";

const catConfigs = [
  { color: "#9370db", Cat: LaylaCat },
  { color: "#D4788A", Cat: RoxanneCat },
  { color: "#f5a855", Cat: LucyCat },
]

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
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

function PlanCard({ plan, idx, lang }: { plan: Plan; idx: number; lang: "es" | "en" }) {
  const [hovered, setHovered] = useState(false)
  const cfg = catConfigs[idx % 3]
  const CatComponent = cfg.Cat

  return (
    <FadeUp delay={idx * 120}>
      <div
        className="relative flex flex-col rounded-3xl overflow-hidden h-full"
        style={{
          border: plan.destacado ? `2px solid ${cfg.color}` : "1px solid rgba(255,255,255,0.08)",
          background: plan.destacado ? "linear-gradient(135deg, #100B20 0%, #1C1235 100%)" : "rgba(255,255,255,0.03)",
          boxShadow: hovered ? `0 0 80px -20px ${cfg.color}50` : plan.destacado ? `0 0 50px -20px ${cfg.color}35` : "none",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {plan.destacado && (
          <div className="absolute top-4 right-4 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full z-10" style={{ background: cfg.color, color: "#fff" }}>
            {lang === "es" ? "Más popular" : "Most popular"}
          </div>
        )}

        <div className="flex justify-center pt-10 pb-4 relative overflow-hidden" style={{ background: `radial-gradient(ellipse at center top, ${cfg.color}18 0%, transparent 70%)` }}>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[60px] pointer-events-none" style={{ background: cfg.color, opacity: hovered ? 0.4 : 0.2, transition: "opacity 0.3s" }} />
          <CatComponent className="w-[130px] h-[156px] relative z-10" />
        </div>

        <div className="flex flex-col flex-1 p-8">
          <h3 className="text-2xl font-black text-white mb-3">{plan.nombre}</h3>
          {plan.descripcion && (
            <p className="text-sm text-white/50 mb-8 leading-relaxed">{plan.descripcion}</p>
          )}

          <ul className="space-y-3 flex-1 mb-8">
            {(plan.caracteristicas || []).map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5" style={{ color: cfg.color }}><CheckIcon /></span>
                <span className="text-sm text-white/70">{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href={`/cotizar?plan=${encodeURIComponent(plan.nombre)}`}
            className="btn-squish flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200"
            style={plan.destacado
              ? { background: cfg.color, color: "#fff", boxShadow: `0 4px 20px -4px ${cfg.color}80` }
              : { border: `1.5px solid ${cfg.color}50`, color: cfg.color }
            }
          >
            <PawIcon />
            {lang === "es" ? "Solicitar propuesta" : "Request proposal"}
          </Link>
        </div>
      </div>
    </FadeUp>
  )
}

export default function PlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();
  const tr = t[lang].planes;
  const es = lang === "es"

  useEffect(() => {
    fetchPlanesPublicados()
      .then(d => setPlans(d || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-[#06030F] pt-32 pb-24 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(ellipse, #D4788A, transparent)" }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse, #7C5CBF, transparent)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px" }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <FadeUp>
            <div className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#C4B5FD] bg-white/[0.07] px-5 py-2.5 rounded-full border border-white/[0.12] mb-10">
              {tr.badge}
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 blur-[60px] scale-[1.6] opacity-35 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, #D4788A40, transparent)" }} />
              <RoxanneCat className="w-[160px] h-[192px] relative z-10 mx-auto" />
            </div>
          </FadeUp>

          <FadeUp delay={160}>
            <p className="flex items-center justify-center gap-3 text-[#D4788A] font-bold tracking-[0.2em] uppercase text-xs mb-6">
              <span className="w-10 h-px bg-[#D4788A]/40" />
              {es ? "Roxanne habla" : "Roxanne speaks"}
              <span className="w-10 h-px bg-[#D4788A]/40" />
            </p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[0.95] mb-6">
              {es ? "El plan correcto\npara " : "The right plan\nfor "}
              <span className="bg-gradient-to-r from-[#9B8EB2] via-[#C4B5FD] to-[#D4788A] bg-clip-text text-transparent">
                {es ? "tu momento." : "your moment."}
              </span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
              {tr.subtitle}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section className="bg-[#0A0710] py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-3xl border border-white/[0.06] bg-white/[0.02] h-[480px] animate-pulse" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-white/10">
              <p className="text-xl font-bold text-white mb-2">{tr.soon}</p>
              <p className="text-white/40 text-sm">{tr.soonDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <PlanCard key={plan.id} plan={plan} idx={idx} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#06030F] py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {tr.footerTitle}
            </h2>
            <p className="text-white/40 text-lg mb-10">{tr.footerDesc}</p>
            <Link
              href="/cotizar"
              className="btn-squish inline-flex items-center gap-2 px-10 py-4 bg-[#7C5CBF] text-white font-bold rounded-2xl hover:bg-[#6B4DAE] transition-colors"
              style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.65)" }}
            >
              <PawIcon />
              {tr.footerBtn}
            </Link>
          </FadeUp>
        </div>
      </section>
    </main>
  )
}
