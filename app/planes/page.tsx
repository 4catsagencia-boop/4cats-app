"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { fetchPlanesPublicados, type Plan } from "@/utils/supabase";
import { useLang } from "../context/LanguageContext";
import { t } from "../translations";

function RoxanneSilhouette() {
  const c = "#D4788A"
  return (
    <svg width="120" height="144" viewBox="0 0 108 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="126" rx="27" ry="4" fill={c} opacity="0.2" />
      <path d="M70 98 Q102 90 100 114 Q98 130 70 128 L66 120 Q82 118 82 114 Q82 98 66 98 Z" fill={c} />
      <ellipse cx="47" cy="102" rx="30" ry="23" fill={c} />
      <ellipse cx="47" cy="83" rx="18" ry="12" fill={c} />
      <circle cx="47" cy="66" r="27" fill={c} />
      <path d="M23 52 L15 24 L39 46 Z" fill={c} />
      <path d="M71 52 L79 24 L55 46 Z" fill={c} />
      <ellipse cx="33" cy="121" rx="14" ry="7" fill={c} />
      <ellipse cx="57" cy="121" rx="14" ry="7" fill={c} />
      <circle cx="38" cy="64" r="6.5" fill="white" />
      <circle cx="56" cy="64" r="6.5" fill="white" />
      <circle cx="39" cy="64" r="3.5" fill={c} />
      <circle cx="57" cy="64" r="3.5" fill={c} />
      <circle cx="40" cy="63" r="1.2" fill="white" />
      <circle cx="58" cy="63" r="1.2" fill="white" />
      <path d="M45 72 L47 76 L49 72" fill="white" opacity="0.6" />
      <path d="M47 42 L30 30 L24 42 L30 54 Z" fill="white" opacity="0.9" />
      <path d="M47 42 L64 30 L70 42 L64 54 Z" fill="white" opacity="0.9" />
      <circle cx="47" cy="42" r="6" fill="white" />
    </svg>
  )
}

const formatCLP = (precio: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(precio);
};

export default function PlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();
  const tr = t[lang].planes;

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await fetchPlanesPublicados();
        setPlans(data || []);
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error loading plans:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-14 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#7C5CBF] mb-4">
              {tr.badge}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#18181B] mb-4">
              {tr.h1}
            </h1>
            <p className="text-[#52525B] text-base max-w-xl leading-relaxed">
              {tr.subtitle}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <RoxanneSilhouette />
            <p className="text-sm text-[#7C5CBF] italic font-medium">
              {tr.roxanneSays} 🐾
            </p>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="py-20 text-center text-[#A1A1AA]">{tr.loading}</div>
        ) : plans.length === 0 ? (
          <div className="py-20 text-center text-[#52525B] border border-dashed border-[#E4E4E7] rounded-3xl bg-[#FAFAFA]">
            <p className="text-xl font-bold text-[#18181B]">{tr.soon}</p>
            <p className="text-sm mt-2">{tr.soonDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                  plan.destacado
                    ? "bg-[#7C5CBF] text-white border-[#7C5CBF] shadow-xl shadow-[#7C5CBF]/20 scale-105 z-10"
                    : "bg-white text-[#18181B] border-[#E4E4E7] hover:border-[#7C5CBF]/30"
                }`}
              >
                {plan.destacado && (
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-white text-[#7C5CBF] rounded-full px-3 py-1 mb-6 self-start">
                    {tr.popular}
                  </span>
                )}
                <p
                  className={`text-xs font-bold tracking-widest uppercase mb-2 ${
                    plan.destacado ? "text-[#E5D8FF]" : "text-[#7C5CBF]"
                  }`}
                >
                  {plan.nombre}
                </p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold tracking-tight">
                    {formatCLP(plan.precio)}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed mb-8 ${
                    plan.destacado ? "text-[#F3EEFF]" : "text-[#52525B]"
                  }`}
                >
                  {plan.descripcion}
                </p>

                <div className={`h-px w-full mb-8 ${plan.destacado ? "bg-white/20" : "bg-[#E4E4E7]"}`} />

                <ul className="flex flex-col gap-4 mb-10">
                  {(plan.caracteristicas || []).map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg
                        className={`mt-0.5 shrink-0 ${
                          plan.destacado ? "text-white" : "text-[#7C5CBF]"
                        }`}
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M4 10L8 14L16 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className={plan.destacado ? "text-[#F3EEFF]" : "text-[#52525B]"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link
                    href={`/cotizar?plan=${encodeURIComponent(plan.nombre)}`}
                    className={`block text-center text-sm font-bold py-3 rounded-xl transition-all active:scale-[0.98] ${
                      plan.destacado
                        ? "bg-white text-[#7C5CBF] hover:bg-[#F3EEFF]"
                        : "border-2 border-[#7C5CBF] text-[#7C5CBF] hover:bg-[#F3EEFF]"
                    }`}
                  >
                    {tr.startBtn}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="bg-[#FAFAFA] border-t border-[#E4E4E7]">
        <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-[#18181B] mb-2">
              {tr.footerTitle}
            </h3>
            <p className="text-[#52525B]">
              {tr.footerDesc}
            </p>
          </div>
          <Link
            href="/cotizar"
            className="shrink-0 px-8 py-3 bg-[#7C5CBF] text-white font-bold rounded-xl hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20"
          >
            {tr.footerBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}
