"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { fetchPlanesPublicados } from "@/utils/supabase";
import RoxanneCat from "../components/cats/RoxanneCat";

interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  caracteristicas: string[];
  destacado: boolean;
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

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await fetchPlanesPublicados();
        setPlans(data || []);
      } catch (error) {
        console.error("Error loading plans:", error);
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
              Precios
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#18181B] mb-4">
              El plan correcto para tu negocio
            </h1>
            <p className="text-[#52525B] text-base max-w-xl leading-relaxed">
              Sin sorpresas. Sin letras chicas. Elige el plan que mejor se adapte
              a tu etapa y escala cuando lo necesites.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <RoxanneCat className="w-32 h-32" />
            <p className="text-sm text-[#7C5CBF] italic font-medium">
              Roxanne dice: elige ya, no hay tiempo que perder 🐾
            </p>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="py-20 text-center text-[#A1A1AA]">Cargando planes...</div>
        ) : plans.length === 0 ? (
          <div className="py-20 text-center text-[#52525B] border border-dashed border-[#E4E4E7] rounded-3xl bg-[#FAFAFA]">
            <p className="text-xl font-bold text-[#18181B]">Próximamente</p>
            <p className="text-sm mt-2">Estamos actualizando nuestros planes para ti.</p>
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
                    Más popular
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
                  {plan.caracteristicas.map((feat, i) => (
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
                    Empezar ahora
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
              ¿Tienes dudas sobre cuál elegir?
            </h3>
            <p className="text-[#52525B]">
              Cuéntanos tu caso y te recomendamos el plan ideal sin compromiso.
            </p>
          </div>
          <Link
            href="/cotizar"
            className="shrink-0 px-8 py-3 bg-[#7C5CBF] text-white font-bold rounded-xl hover:bg-[#6B4DAE] transition-all shadow-lg shadow-[#7C5CBF]/20"
          >
            Solicitar asesoría
          </Link>
        </div>
      </section>
    </div>
  );
}
