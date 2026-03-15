import Link from "next/link";
import Navbar from "../components/Navbar";

const plans = [
  {
    name: "Emprendedor",
    price: "$299",
    period: "/mes",
    description: "Para negocios que están dando sus primeros pasos digitales.",
    features: [
      "Sitio web de 3 páginas",
      "Dominio incluido",
      "Hosting básico",
      "Soporte por email",
      "1 revisión mensual",
    ],
    cta: "Empezar",
    featured: false,
  },
  {
    name: "Pyme Activa",
    price: "$699",
    period: "/mes",
    description: "El plan más elegido por medianas empresas en crecimiento.",
    features: [
      "Sitio web de hasta 10 páginas",
      "Dominio + hosting premium",
      "SEO básico incluido",
      "Integración con redes sociales",
      "Soporte prioritario",
      "4 revisiones mensuales",
      "Analíticas mensuales",
    ],
    cta: "Elegir Pyme Activa",
    featured: true,
  },
  {
    name: "Corporativo",
    price: "$1,499",
    period: "/mes",
    description: "Solución completa para empresas con necesidades avanzadas.",
    features: [
      "Sitio web sin límite de páginas",
      "Infraestructura dedicada",
      "SEO avanzado + SEM",
      "E-commerce incluido",
      "Gerente de cuenta asignado",
      "Revisiones ilimitadas",
      "Reportes semanales",
    ],
    cta: "Contactar ventas",
    featured: false,
  },
];

const featureRows = [
  { label: "Páginas incluidas", values: ["3 páginas", "Hasta 10 páginas", "Sin límite"] },
  { label: "Dominio", values: ["Incluido", "Incluido", "Incluido"] },
  { label: "Hosting", values: ["Básico", "Premium", "Dedicado"] },
  { label: "SEO", values: ["—", "Básico", "Avanzado + SEM"] },
  { label: "E-commerce", values: ["—", "—", "Incluido"] },
  { label: "Redes sociales", values: ["—", "Integración", "Gestión completa"] },
  { label: "Soporte", values: ["Email", "Prioritario", "Cuenta dedicada"] },
  { label: "Revisiones", values: ["1/mes", "4/mes", "Ilimitadas"] },
  { label: "Reportes", values: ["—", "Mensuales", "Semanales"] },
];

export default function PlanesPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5] rounded-xl overflow-hidden">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-8 ${
                plan.featured ? "bg-[#111] text-white" : "bg-white text-[#111]"
              }`}
            >
              {plan.featured && (
                <span className="inline-block text-[10px] font-semibold tracking-widest uppercase bg-white text-[#111] rounded-full px-2.5 py-0.5 mb-5 self-start">
                  Más popular
                </span>
              )}
              <p
                className={`text-xs font-semibold tracking-widest uppercase mb-2 ${
                  plan.featured ? "text-[#aaa]" : "text-[#888]"
                }`}
              >
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.featured ? "text-[#aaa]" : "text-[#888]"
                  }`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed mb-7 ${
                  plan.featured ? "text-[#bbb]" : "text-[#666]"
                }`}
              >
                {plan.description}
              </p>

              <ul className="flex flex-col gap-2.5 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm">
                    <svg
                      className={`mt-0.5 shrink-0 ${
                        plan.featured ? "text-white" : "text-[#111]"
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
                    <span className={plan.featured ? "text-[#ddd]" : "text-[#444]"}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link
                  href={`/cotizar?plan=${encodeURIComponent(plan.name)}`}
                  className={`block text-center text-sm font-medium py-2.5 rounded-md transition-colors ${
                    plan.featured
                      ? "bg-white text-[#111] hover:bg-[#f0f0f0]"
                      : "border border-[#e5e5e5] text-[#111] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-[#e5e5e5]" />
      </div>

      {/* Comparison table */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-semibold tracking-tight text-[#111] mb-10">
          Comparación detallada
        </h2>

        <div className="w-full">
          {/* Table header */}
          <div className="grid grid-cols-4 border-b border-[#e5e5e5] pb-3 mb-0">
            <div className="text-xs font-semibold text-[#888] uppercase tracking-wider" />
            {plans.map((plan) => (
              <div key={plan.name} className="text-center">
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    plan.featured ? "text-[#111]" : "text-[#888]"
                  }`}
                >
                  {plan.name}
                </p>
              </div>
            ))}
          </div>

          {/* Table rows */}
          {featureRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-4 py-3.5 border-b border-[#e5e5e5] ${
                i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
              }`}
            >
              <div className="text-sm text-[#444] font-medium">{row.label}</div>
              {row.values.map((val, vi) => (
                <div key={vi} className="text-center text-sm text-[#555]">
                  {val}
                </div>
              ))}
            </div>
          ))}
        </div>
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
