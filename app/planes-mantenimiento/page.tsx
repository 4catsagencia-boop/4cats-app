"use client";

import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import LucyCat from "../components/cats/LucyCat";
import RoxanneCat from "../components/cats/RoxanneCat";
import LaylaCat from "../components/cats/LaylaCat";
import BillieCat from "../components/cats/BillieCat";
import Link from "next/link";
import { useLang } from "../context/LanguageContext";
import { t } from "../translations";

/* ─── CSS Animations ─── */
const css = `
  /* Keyframes */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(48px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeLeft {
    from { opacity:0; transform:translateX(-56px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes fadeRight {
    from { opacity:0; transform:translateX(56px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.86); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes scaleInFeatured {
    from { opacity:0; transform:scale(0.86) translateY(0px); }
    to   { opacity:1; transform:scale(1.05) translateY(0px); }
  }
  @keyframes floatCat {
    0%,100% { transform:translateY(0px) rotate(-1deg); }
    50%      { transform:translateY(-18px) rotate(1deg); }
  }
  @keyframes floatFeatured {
    0%,100% { transform:scale(1.05) translateY(0px); }
    50%      { transform:scale(1.05) translateY(-10px); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow:0 0 0 0 rgba(245,158,11,0.45); }
    50%     { box-shadow:0 0 32px 8px rgba(245,158,11,0.2); }
  }
  @keyframes pulseRing {
    0%  { box-shadow:0 0 0 0 rgba(124,92,191,0.55); }
    70% { box-shadow:0 0 0 14px rgba(124,92,191,0); }
    100%{ box-shadow:0 0 0 0 rgba(124,92,191,0); }
  }
  @keyframes shimmerBg {
    from { background-position:-200% center; }
    to   { background-position: 200% center; }
  }
  @keyframes glowDot {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:0.5; transform:scale(1.6); }
  }
  @keyframes rowIn {
    from { opacity:0; transform:translateX(-20px); }
    to   { opacity:1; transform:translateX(0); }
  }

  /* Hidden state before reveal */
  [data-anim] { opacity:0; }
  [data-anim].visible {
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22,1,0.36,1);
    animation-duration: 0.75s;
  }
  [data-anim="up"].visible       { animation-name:fadeUp; }
  [data-anim="left"].visible     { animation-name:fadeLeft; }
  [data-anim="right"].visible    { animation-name:fadeRight; }
  [data-anim="scale"].visible    { animation-name:scaleIn; }
  [data-anim="featured"].visible { animation-name:scaleInFeatured; }

  /* Stagger delays */
  .d100 { animation-delay:.10s; }
  .d200 { animation-delay:.20s; }
  .d300 { animation-delay:.30s; }
  .d400 { animation-delay:.40s; }
  .d500 { animation-delay:.50s; }
  .d600 { animation-delay:.60s; }

  /* Lucy hero float */
  .float-cat { animation: floatCat 5s ease-in-out infinite; }

  /* Featured card float */
  .float-featured {
    animation: floatFeatured 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite;
  }

  /* Card hover lift */
  .lift {
    transition: transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s ease;
    will-change: transform;
  }
  .lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 56px -8px rgba(124,92,191,0.18);
  }

  /* Dark card hover */
  .lift-dark {
    transition: transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s ease;
  }
  .lift-dark:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 56px -8px rgba(0,0,0,0.35);
  }

  /* Button glow */
  .btn-glow {
    transition: transform .22s ease, box-shadow .3s ease, background .2s ease;
    will-change: transform;
  }
  .btn-glow:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 14px 36px -4px rgba(124,92,191,0.45);
  }
  .btn-glow:active { transform:scale(.97); }

  .btn-outline {
    transition: transform .22s ease, box-shadow .3s ease, background .2s ease;
  }
  .btn-outline:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px -4px rgba(0,0,0,0.12);
    background: #FAFAFA;
  }

  .btn-amber {
    transition: transform .22s ease, box-shadow .3s ease, background .2s ease;
  }
  .btn-amber:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 14px 36px -4px rgba(245,158,11,0.45);
  }
  .btn-amber:active { transform:scale(.97); }

  /* Table row hover */
  tr.tr-hover {
    transition: background .2s ease;
  }
  tr.tr-hover:hover { background:#F3EEFF30; }

  /* Report mockup pulse */
  .report-mock {
    animation: pulseGlow 3s ease-in-out infinite;
  }

  /* Pulse ring on section number */
  .pulse-num { animation: pulseRing 2.8s ease-out infinite; }

  /* Table row stagger */
  .row-in {
    opacity:0;
    animation: rowIn .5s cubic-bezier(.22,1,.36,1) both;
  }
`;

const formatCLP = (precio: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(precio);

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    root.querySelectorAll("[data-anim]").forEach((el) => obs.observe(el));

    // Stagger table rows
    root.querySelectorAll("tr.tr-hover").forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${0.05 + i * 0.08}s`;
    });

    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function MantenimientoPage() {
  const ref = useReveal();
  const { lang } = useLang();
  const tr = t[lang].mant;

  return (
    <main className="min-h-screen bg-white" ref={ref}>
      <style>{css}</style>
      <Navbar />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-6">
          <p data-anim="left" className="text-xs font-bold tracking-widest uppercase text-[#7C5CBF] bg-[#F3EEFF] px-3 py-1 rounded-full w-fit">
            {tr.badge}
          </p>
          <h1 data-anim="left" className="d100 text-5xl font-bold tracking-tight text-[#18181B] leading-tight">
            {tr.h1} <br />
            tu <span className="text-[#7C5CBF]">{tr.h1accent}</span>
          </h1>
          <p data-anim="left" className="d200 text-[#52525B] text-lg leading-relaxed">
            {tr.subtitle}
          </p>
          <div data-anim="left" className="d300 flex flex-col gap-4 pt-2">
            <div className="flex gap-4">
              <Link href="#planes" className="btn-glow px-6 py-3 bg-[#7C5CBF] text-white font-bold rounded-xl shadow-lg shadow-[#7C5CBF]/25">
                {tr.cta1}
              </Link>
              <Link href="/cotizar" className="btn-outline px-6 py-3 border border-[#E4E4E7] text-[#18181B] font-bold rounded-xl">
                {tr.cta2}
              </Link>
            </div>
            <p className="text-[10px] text-[#A1A1AA] font-medium italic ml-1">
              {tr.promoNote}
            </p>
          </div>
        </div>
        <div data-anim="right" className="d200 flex justify-center relative">
          <div className="bg-[#F3EEFF] w-64 h-64 rounded-full absolute -z-10 blur-3xl opacity-40 animate-pulse" />
          <div className="float-cat">
            <LucyCat className="w-64 h-64 md:w-80 md:h-80 drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* AUTOGESTIÓN VS RESPONSABILIDAD */}
      <section className="bg-[#FAFAFA] py-24 border-y border-[#E4E4E7]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 data-anim="up" className="text-3xl font-bold text-[#18181B] tracking-tight">{tr.libertadTitle}</h2>
            <p data-anim="up" className="d100 text-[#52525B] mt-2">{tr.libertadDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div data-anim="left" className="lift bg-white p-8 rounded-3xl border border-[#E4E4E7] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <LaylaCat className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {tr.autoTitle}
              </h3>
              <ul className="space-y-4">
                {tr.autoItems.map((item, i) => (
                  <CheckItem key={i} title={item.title} desc={item.desc} />
                ))}
              </ul>
            </div>

            <div data-anim="right" className="lift-dark bg-[#18181B] p-8 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <BillieCat className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#7C5CBF] rounded-full animate-pulse" />
                {tr.respTitle}
              </h3>
              <ul className="space-y-4">
                {tr.respItems.map((item, i) => (
                  <CheckItem key={i} white title={item.title} desc={item.desc} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VALOR AGREGADO */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div data-anim="left" className="order-2 md:order-1">
            <div className="report-mock bg-[#F3EEFF] p-8 rounded-[40px] border border-[#E5D8FF] relative shadow-inner">
              <div className="space-y-4">
                <div className="h-4 bg-white/60 rounded-full w-3/4" />
                <div className="h-4 bg-white/60 rounded-full w-1/2" />
                <div className="h-32 bg-white/40 rounded-2xl w-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#7C5CBF] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#7C5CBF]">{tr.reportPreview}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 data-anim="right" className="text-3xl font-bold text-[#18181B]">{tr.reportTitle} <br /><span className="text-[#7C5CBF]">{tr.reportAccent}</span></h2>
            <p data-anim="right" className="d100 text-[#52525B] text-lg">
              {tr.reportDesc}
            </p>
            <div data-anim="right" className="d200 lift bg-[#FAFAFA] p-4 rounded-xl border-l-4 border-[#7C5CBF]">
              <p className="text-sm italic text-[#52525B]">{tr.reportQuote}</p>
              <p className="text-[10px] font-bold mt-2 text-[#7C5CBF] uppercase tracking-tighter">{tr.reportQuoteBy}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="bg-[#FAFAFA] py-24 border-t border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 data-anim="up" className="text-4xl font-bold text-[#18181B]">{tr.planesTitle}</h2>
            <p data-anim="up" className="d100 text-[#52525B] mt-2">{tr.planesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div data-anim="scale" className="d100">
              <PriceCard
                title={tr.plans[0].title}
                price={tr.plans[0].price}
                features={[...tr.plans[0].features]}
                buttonText={tr.plans[0].btn}
                planMonthly={tr.planMonthly}
                color="bg-[#52525B]"
              />
            </div>
            <div data-anim="featured" className="d200">
              <PriceCard
                recommended
                title={tr.plans[1].title}
                price={tr.plans[1].price}
                features={[...tr.plans[1].features]}
                buttonText={tr.plans[1].btn}
                planMonthly={tr.planMonthly}
                color="bg-[#F59E0B]"
              />
            </div>
            <div data-anim="scale" className="d300">
              <PriceCard
                title={tr.plans[2].title}
                price={tr.plans[2].price}
                features={[...tr.plans[2].features]}
                buttonText={tr.plans[2].btn}
                planMonthly={tr.planMonthly}
                color="bg-[#7C5CBF]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TABLA COMPARATIVA */}
      <section id="comparativa" className="py-24 max-w-4xl mx-auto px-6">
        <h2 data-anim="up" className="text-2xl font-bold text-[#18181B] mb-10 text-center">{tr.comparativaTitle}</h2>
        <div data-anim="scale" className="d100 overflow-hidden rounded-3xl border border-[#E4E4E7] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAFA] border-b border-[#E4E4E7]">
              <tr>
                <th className="p-4 font-bold text-[#18181B]">{tr.tableCol1}</th>
                <th className="p-4 font-medium text-[#A1A1AA]">{tr.tableCol2}</th>
                <th className="p-4 font-bold text-[#7C5CBF]">{tr.tableCol3}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {tr.tableRows.map((row, i) => (
                <TableRow
                  key={i}
                  label={row.label}
                  val1={row.v1}
                  val2={row.v2}
                  highlight={row.hi ?? false}
                  delay={i}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div data-anim="scale" className="lift-dark bg-[#18181B] rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-20 translate-y-1/4">
            <RoxanneCat className="w-48 h-48" />
          </div>
          <h3 data-anim="up" className="d100 text-3xl font-bold text-white mb-6">{tr.ctaTitle}</h3>
          <p data-anim="up" className="d200 text-[#A1A1AA] mb-10 max-w-lg mx-auto">
            {tr.ctaDesc}
          </p>
          <div data-anim="up" className="d300">
            <Link
              href="https://wa.me/56934819569"
              className="btn-glow inline-block px-8 py-4 bg-[#7C5CBF] text-white font-bold rounded-xl shadow-lg shadow-[#7C5CBF]/30"
            >
              {tr.ctaBtn}
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-[#E4E4E7] text-center">
        <p className="text-[10px] text-[#A1A1AA] uppercase tracking-[0.4em] font-bold">{tr.footer}</p>
      </footer>
    </main>
  );
}

function CheckItem({ title, desc, white = false }: { title: string; desc: string; white?: boolean }) {
  return (
    <li className="flex gap-3">
      <svg className="mt-1 shrink-0 text-[#7C5CBF]" width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <p className={`text-sm font-bold ${white ? "text-white" : "text-[#18181B]"}`}>{title}</p>
        <p className={`text-xs ${white ? "text-[#A1A1AA]" : "text-[#52525B]"}`}>{desc}</p>
      </div>
    </li>
  );
}

function PriceCard({ title, price, features, buttonText, planMonthly, color, recommended = false }: {
  title: string; price: number; features: string[];
  buttonText: string; planMonthly: string; color: string; recommended?: boolean;
}) {
  return (
    <div className={`bg-white rounded-3xl border ${
      recommended
        ? "border-2 border-[#F59E0B] float-featured z-10 relative"
        : "border-[#E4E4E7] lift"
    } flex flex-col h-full`}>
      <div className={`${color} p-6 text-center rounded-t-[22px] relative`}>
        {recommended && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#F59E0B] text-[10px] font-bold px-3 py-1 rounded-full border border-[#F59E0B] uppercase tracking-widest">
            Recomendado
          </div>
        )}
        <h3 className="text-white font-bold uppercase tracking-widest text-xs">{title}</h3>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-8 text-center">
          <span className="text-4xl font-bold text-[#18181B]">{formatCLP(price)}</span>
          <p className="text-[10px] text-[#A1A1AA] mt-1 uppercase tracking-widest">{planMonthly}</p>
        </div>
        <ul className="space-y-4 mb-10 flex-grow">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <svg className="mt-0.5 shrink-0 text-[#7C5CBF]" width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[#52525B]">{f}</span>
            </li>
          ))}
        </ul>
        <Link
          href={`/cotizar?plan=Mantenimiento ${title}`}
          className={`block text-center py-4 rounded-xl font-bold text-sm ${
            recommended
              ? "btn-amber bg-[#F59E0B] text-white"
              : "btn-outline border-2 border-[#52525B] text-[#52525B]"
          }`}
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
    <tr className="tr-hover row-in" style={{ animationDelay: `${delay * 0.08}s` }}>
      <td className="p-4 text-[#52525B]">{label}</td>
      <td className="p-4 text-[#A1A1AA]">{val1}</td>
      <td className={`p-4 font-bold ${highlight ? "text-[#7C5CBF]" : "text-[#18181B]"}`}>{val2}</td>
    </tr>
  );
}
