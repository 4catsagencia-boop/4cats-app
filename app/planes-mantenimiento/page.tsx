"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import LucyCat from "../components/cats/LucyCat";
import RoxanneCat from "../components/cats/RoxanneCat";
import LaylaCat from "../components/cats/LaylaCat";
import BillieCat from "../components/cats/BillieCat";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import { t } from "../translations";
import { fetchPlanesMantenimientoPublicados, type PlanMantenimiento } from "../../utils/supabase";
import { FadeUp } from "../components/FadeUp";

/* ─── animations ─── */
const css = `
  @keyframes floatCat {
    0%,100% { transform:translateY(0px) rotate(-1deg); }
    50%      { transform:translateY(-16px) rotate(1deg); }
  }
  @keyframes floatFeatured {
    0%,100% { transform:translateY(0px); }
    50%      { transform:translateY(-10px); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow:0 0 0 0 rgba(124,92,191,0.4); }
    50%     { box-shadow:0 0 40px 8px rgba(124,92,191,0.15); }
  }
  @keyframes rowIn {
    from { opacity:0; transform:translateX(-16px); }
    to   { opacity:1; transform:translateX(0); }
  }
  .float-cat     { animation: floatCat 5s ease-in-out infinite; }
  .float-feat    { animation: floatFeatured 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite; }
  .row-in        { opacity:0; animation: rowIn .5s cubic-bezier(.22,1,.36,1) both; }
  .lift          { transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease; }
  .lift:hover    { transform: translateY(-6px); box-shadow: 0 20px 50px -8px rgba(124,92,191,0.2); }
  .btn-glow      { transition: transform .2s ease, box-shadow .3s ease; }
  .btn-glow:hover{ transform: translateY(-3px) scale(1.03); box-shadow: 0 12px 32px -4px rgba(124,92,191,0.5); }
  .btn-glow:active { transform:scale(.97); }
  tr.tr-hover    { transition: background .2s ease; }
  tr.tr-hover:hover { background: rgba(124,92,191,0.06); }
`;

const formatCLP = (precio: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(precio);

const catConfigs = [
  { color: "#9370db", Cat: LaylaCat },
  { color: "#D4788A", Cat: RoxanneCat },
  { color: "#f5a855", Cat: LucyCat },
] as const;

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(28px)";
      (el as HTMLElement).style.transition = `opacity .65s cubic-bezier(.22,1,.36,1) ${(el as HTMLElement).dataset.delay ?? "0"}ms, transform .65s cubic-bezier(.22,1,.36,1) ${(el as HTMLElement).dataset.delay ?? "0"}ms`;
      obs.observe(el);
    });
    root.querySelectorAll("tr.tr-hover").forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${0.05 + i * 0.07}s`;
    });
    return () => obs.disconnect();
  }, []);
  return ref;
}

function CheckItem({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <svg className="mt-1 shrink-0 text-[#7C5CBF]" width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-white/40 mt-0.5">{desc}</p>
      </div>
    </li>
  );
}

function PriceCard({ plan, idx, buttonText, planMonthly }: {
  plan: PlanMantenimiento; idx: number; buttonText: string; planMonthly: string;
}) {
  const [hovered, setHovered] = useState(false);
  const cfg = catConfigs[idx % 3];
  const CatComp = cfg.Cat;

  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden h-full ${plan.destacado ? "float-feat" : "lift"}`}
      style={{
        border: plan.destacado ? `2px solid ${cfg.color}` : "1px solid rgba(255,255,255,0.08)",
        background: plan.destacado
          ? "linear-gradient(135deg, #100B20 0%, #1C1235 100%)"
          : "rgba(255,255,255,0.03)",
        boxShadow: hovered ? `0 0 80px -20px ${cfg.color}50` : plan.destacado ? `0 0 50px -20px ${cfg.color}35` : "none",
        transform: !plan.destacado && hovered ? "translateY(-6px)" : undefined,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {plan.destacado && (
        <div
          className="absolute top-4 right-4 z-10 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
          style={{ background: cfg.color, color: "#fff" }}
        >
          Recomendado
        </div>
      )}

      {/* Cat illustration — contained, no overflow */}
      <div
        className="flex justify-center pt-10 pb-4 relative"
        style={{ background: `radial-gradient(ellipse at center top, ${cfg.color}18 0%, transparent 70%)` }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[50px] pointer-events-none"
          style={{ background: cfg.color, opacity: hovered ? 0.35 : 0.18, transition: "opacity .3s" }}
        />
        <CatComp className="w-[120px] h-[144px] relative z-10" />
      </div>

      <div className="flex flex-col flex-1 p-8">
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-2" style={{ color: cfg.color }}>
          {plan.nombre}
        </p>

        <ul className="space-y-3 flex-1 mb-8">
          {plan.caracteristicas.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="mt-0.5 shrink-0 w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2.5} style={{ color: cfg.color }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 10L8 14L16 6" />
              </svg>
              <span className="text-sm text-white/65">{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/cotizar?plan=Mantenimiento ${plan.nombre}`}
          className="btn-squish flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl font-bold text-sm"
          style={plan.destacado
            ? { background: cfg.color, color: "#fff", boxShadow: `0 4px 24px -4px ${cfg.color}80` }
            : { border: `1.5px solid ${cfg.color}50`, color: cfg.color }
          }
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

function TableRow({ label, val1, val2, highlight = false, delay }: {
  label: string; val1: string; val2: string; highlight?: boolean; delay: number;
}) {
  return (
    <tr className="tr-hover row-in" style={{ animationDelay: `${delay * 0.07}s`, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <td className="p-4 text-white/45 text-sm">{label}</td>
      <td className="p-4 text-white/20 text-sm">{val1}</td>
      <td className={`p-4 font-bold text-sm ${highlight ? "text-[#C4B5FD]" : "text-white"}`}>{val2}</td>
    </tr>
  );
}

export default function MantenimientoPage() {
  const ref = useReveal();
  const { lang } = useLang();
  const tr = t[lang].mant;
  const es = lang === "es";
  const [planes, setPlanes] = useState<PlanMantenimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanesMantenimientoPublicados().then(setPlanes).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#06030F]" ref={ref}>
      <style>{css}</style>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-[#06030F] pt-32 pb-28 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full blur-[200px] opacity-[0.13] pointer-events-none" style={{ background: "radial-gradient(ellipse, #7C5CBF, transparent)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse, #f5a855, transparent)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px" }} />

        <div className="relative max-w-5xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
          <div className="flex flex-col gap-6">
            <div data-reveal data-delay="0">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#C4B5FD] bg-white/[0.07] px-5 py-2.5 rounded-full border border-white/[0.12]">
                {tr.badge}
              </span>
            </div>
            <h1 data-reveal data-delay="80" className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[0.95]">
              {tr.h1} <br />
              <span className="bg-gradient-to-r from-[#7C5CBF] to-[#C4B5FD] bg-clip-text text-transparent">{tr.h1accent}</span>
            </h1>
            <p data-reveal data-delay="160" className="text-white/40 text-lg leading-relaxed">{tr.subtitle}</p>
            <div data-reveal data-delay="240" className="flex flex-col gap-4 pt-2">
              <div className="flex flex-wrap gap-4">
                <Link href="#planes" className="btn-glow px-6 py-3 bg-[#7C5CBF] text-white font-bold rounded-2xl" style={{ boxShadow: "0 4px 24px -4px rgba(124,92,191,0.6)" }}>
                  {tr.cta1}
                </Link>
                <Link href="/cotizar" className="px-6 py-3 border border-white/[0.18] text-white font-bold rounded-2xl hover:bg-white/[0.07] transition-colors">
                  {tr.cta2}
                </Link>
              </div>
              <p className="text-[10px] text-white/25 italic">{tr.promoNote}</p>
            </div>
          </div>
          <div data-reveal data-delay="180" className="flex justify-center relative">
            <div className="absolute inset-0 blur-[80px] scale-125 opacity-25 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #f5a85540, transparent)" }} />
            <div className="float-cat relative z-10">
              <LucyCat className="w-56 h-56 md:w-72 md:h-72 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── DOS CAMINOS ── */}
      <section className="bg-[#0A0710] py-28 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20" data-reveal>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">{tr.libertadTitle}</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">{tr.libertadDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Autogestión card */}
            <div data-reveal data-delay="0" className="lift rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 blur-[30px] opacity-30 rounded-full" style={{ background: "#9370db" }} />
                  <LaylaCat className="w-[64px] h-[76px] relative z-10" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[0.2em] uppercase text-[#9370db] mb-1">
                    {es ? "Tú lo gestionás" : "You manage it"}
                  </p>
                  <h3 className="text-lg font-black text-white">{tr.autoTitle}</h3>
                </div>
              </div>
              <ul className="space-y-4">
                {tr.autoItems.map((item, i) => (
                  <CheckItem key={i} title={item.title} desc={item.desc} />
                ))}
              </ul>
            </div>

            {/* Responsabilidad 4cats card */}
            <div data-reveal data-delay="120" className="lift rounded-3xl p-8" style={{ background: "linear-gradient(135deg, #100B20 0%, #1C1235 100%)", border: "1px solid rgba(124,92,191,0.3)" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 blur-[30px] opacity-30 rounded-full" style={{ background: "#9B8EB2" }} />
                  <BillieCat className="w-[64px] h-[76px] relative z-10" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[0.2em] uppercase text-[#C4B5FD] mb-1">
                    {es ? "Nosotras lo gestionamos" : "We manage it"}
                  </p>
                  <h3 className="text-lg font-black text-white">{tr.respTitle}</h3>
                </div>
              </div>
              <ul className="space-y-4">
                {tr.respItems.map((item, i) => (
                  <CheckItem key={i} title={item.title} desc={item.desc} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── REPORTE / VALOR AGREGADO ── */}
      <section className="bg-[#06030F] py-28 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Analytics mockup */}
          <div data-reveal data-delay="0" className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-[#7C5CBF]/8 blur-3xl rounded-full scale-110 -z-10" />
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}>
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#7C5CBF] flex items-center justify-center text-[10px] text-white font-bold">4C</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Monthly Analytics</span>
                </div>
                <span className="text-[9px] font-medium text-white/25">MAR 2026</span>
              </div>

              <div className="p-6 space-y-5">
                {/* KPI row */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Visits", val: "12,480", delta: "↑ 14%" },
                    { label: "Conv. Rate",   val: "3.2%",   delta: "↑ 0.8%" },
                  ].map((kpi, i) => (
                    <div key={i} className="p-4 rounded-2xl" style={{ background: "rgba(124,92,191,0.12)", border: "1px solid rgba(124,92,191,0.2)" }}>
                      <p className="text-[9px] font-bold text-[#C4B5FD] uppercase tracking-tight mb-1">{kpi.label}</p>
                      <div className="flex items-end gap-1.5">
                        <span className="text-xl font-black text-white">{kpi.val}</span>
                        <span className="text-[9px] font-bold text-emerald-400 mb-0.5">{kpi.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-4">Conversion by Channel</p>
                  <div className="flex items-end justify-between h-20 gap-2">
                    {[40, 70, 45, 90, 60, 30].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-sm transition-all duration-500 hover:opacity-100 opacity-70"
                          style={{ height: `${h}%`, background: `linear-gradient(to top, #7C5CBF, #C4B5FD)` }}
                        />
                        <span className="text-[7px] font-bold text-white/25">{["IG","FB","WA","GG","EM","OT"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI insight */}
                <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "rgba(124,92,191,0.08)", border: "1px solid rgba(124,92,191,0.15)" }}>
                  <div className="w-6 h-6 shrink-0 rounded-full bg-[#7C5CBF] flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 rounded-full bg-white/10 w-full" />
                    <div className="h-2 rounded-full bg-white/10 w-3/4" />
                    <div className="h-2 rounded-full bg-white/10 w-1/2" />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-5 flex items-center justify-center">
                <div className="px-4 py-2 rounded-full flex items-center gap-2" style={{ background: "rgba(124,92,191,0.2)", border: "1px solid rgba(124,92,191,0.3)" }}>
                  <svg className="w-3 h-3 text-[#C4B5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-[9px] font-bold text-[#C4B5FD]">{tr.reportPreview}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div data-reveal data-delay="100" className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {tr.reportTitle}<br />
              <span className="bg-gradient-to-r from-[#7C5CBF] to-[#C4B5FD] bg-clip-text text-transparent">{tr.reportAccent}</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed">{tr.reportDesc}</p>
            <div className="p-5 rounded-2xl border-l-4 border-[#7C5CBF]" style={{ background: "rgba(124,92,191,0.08)" }}>
              <p className="text-sm italic text-white/50 leading-relaxed">{tr.reportQuote}</p>
              <p className="text-[10px] font-black mt-3 text-[#C4B5FD] uppercase tracking-wider">{tr.reportQuoteBy}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section id="planes" className="bg-[#0A0710] py-28 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16" data-reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-3">{es ? "Mantenimiento" : "Maintenance"}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">{tr.planesTitle}</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">{tr.planesDesc}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-3xl border border-white/[0.06] bg-white/[0.02] h-[520px] animate-pulse" />
              ))}
            </div>
          ) : planes.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-white/10">
              <p className="text-xl font-bold text-white mb-2">{es ? "Próximamente..." : "Coming soon..."}</p>
              <p className="text-white/30 text-sm">{es ? "Estamos configurando los nuevos planes." : "We're setting up the new plans."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {planes.map((p, i) => (
                <FadeUp key={p.id} delay={i * 120}>
                  <PriceCard
                    plan={p}
                    idx={i}
                    buttonText={p.destacado ? (es ? "Comenzar ahora" : "Start now") : (es ? "Elegir este plan" : "Select plan")}
                    planMonthly={tr.planMonthly}
                  />
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TABLA COMPARATIVA ── */}
      <section id="comparativa" className="bg-[#06030F] py-28 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12" data-reveal>
            <h2 className="text-3xl font-black text-white tracking-tight">{tr.comparativaTitle}</h2>
          </div>

          <div data-reveal data-delay="80">
            <div className="md:hidden flex items-center justify-end gap-1 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3 animate-pulse">
              <span>{es ? "Deslizá para ver más" : "Scroll to see more"}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
              </svg>
            </div>
            <div className="overflow-x-auto rounded-3xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <table className="w-full text-left min-w-[560px]">
                <thead style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <tr>
                    <th className="p-4 font-bold text-white text-sm w-1/2">{tr.tableCol1}</th>
                    <th className="p-4 font-medium text-white/30 text-sm w-1/4">{tr.tableCol2}</th>
                    <th className="p-4 font-bold text-[#C4B5FD] text-sm w-1/4">{tr.tableCol3}</th>
                  </tr>
                </thead>
                <tbody>
                  {tr.tableRows.map((row, i) => (
                    <TableRow key={i} label={row.label} val1={row.v1} val2={row.v2} highlight={row.hi ?? false} delay={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-[#0A0710] py-28 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <div
            data-reveal
            className="relative rounded-[40px] p-12 text-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0F0920 0%, #1A1035 100%)", border: "1px solid rgba(124,92,191,0.3)", boxShadow: "0 0 80px -30px rgba(124,92,191,0.3)" }}
          >
            {/* Roxanne decorative */}
            <div className="absolute bottom-0 right-8 opacity-25 pointer-events-none">
              <RoxanneCat className="w-40 h-40" />
            </div>
            <div className="absolute bottom-0 left-8 opacity-15 pointer-events-none scale-x-[-1]">
              <LaylaCat className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <p className="text-xs font-black tracking-[0.2em] uppercase text-[#C4B5FD]/60 mb-4">
                {es ? "¿Lista para empezar?" : "Ready to start?"}
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{tr.ctaTitle}</h3>
              <p className="text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">{tr.ctaDesc}</p>
              <Link
                href="https://wa.me/56934819569"
                className="btn-glow inline-flex items-center gap-2 px-10 py-4 bg-[#7C5CBF] text-white font-bold rounded-2xl"
                style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.7)" }}
              >
                {tr.ctaBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/[0.06] text-center bg-[#06030F]">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">{tr.footer}</p>
      </footer>
    </main>
  );
}
