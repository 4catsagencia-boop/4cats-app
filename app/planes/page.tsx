"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { fetchPlanesPublicados } from "@/utils/supabase";

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
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-14 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#888] mb-4">
          Precios
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[#111] mb-4">
          El plan correcto para tu negocio
        </h1>
        <p className="text-[#666] text-base max-w-xl mx-auto leading-relaxed">
          Sin sorpresas. Sin letras chicas. Elige el plan que mejor se adapte
          a tu etapa y escala cuando lo necesites.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="py-20 text-center text-[#888]">Cargando planes...</div>
        ) : plans.length === 0 ? (
          <div className="py-20 text-center text-[#888] border border-dashed border-[#e5e5e5] rounded-xl">
            <p className="text-lg font-medium text-[#111]">Próximamente</p>
            <p className="text-sm mt-1">Estamos actualizando nuestros planes para ti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5] rounded-xl overflow-hidden">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col p-8 ${
                  plan.destacado ? "bg-[#111] text-white" : "bg-white text-[#111]"
                }`}
              >
                {plan.destacado && (
                  <span className="inline-block text-[10px] font-semibold tracking-widest uppercase bg-white text-[#111] rounded-full px-2.5 py-0.5 mb-5 self-start">
                    Más popular
                  </span>
                )}
                <p
                  className={`text-xs font-semibold tracking-widest uppercase mb-2 ${
                    plan.destacado ? "text-[#aaa]" : "text-[#888]"
                  }`}
                >
                  {plan.nombre}
                </p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-semibold tracking-tight">
                    {formatCLP(plan.precio)}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed mb-7 ${
                    plan.destacado ? "text-[#bbb]" : "text-[#666]"
                  }`}
                >
                  {plan.descripcion}
                </p>

                <ul className="flex flex-col gap-2.5 mb-8">
                  {plan.caracteristicas.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className={`mt-0.5 shrink-0 ${
                          plan.destacado ? "text-white" : "text-[#111]"
                        }`}
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className={plan.destacado ? "text-[#ddd]" : "text-[#444]"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link
                    href={`/cotizar?plan=${encodeURIComponent(plan.nombre)}`}
                    className={`block text-center text-sm font-medium py-2.5 rounded-md transition-colors ${
                      plan.destacado
                        ? "bg-white text-[#111] hover:bg-[#f0f0f0]"
                        : "border border-[#e5e5e5] text-[#111] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    Empezar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#111] mb-1">
              ¿Tienes dudas sobre cuál elegir?
            </h3>
            <p className="text-sm text-[#666]">
              Cuéntanos tu caso y te recomendamos el plan ideal sin compromiso.
            </p>
          </div>
          <Link
            href="/cotizar"
            className="shrink-0 text-sm font-medium bg-[#111] text-white px-5 py-2.5 rounded-md hover:bg-[#333] transition-colors"
          >
            Solicitar cotización
          </Link>
        </div>
      </section>
    </div>
  );
}
