import Link from "next/link";
import Navbar from "../components/Navbar";
import RoxanneCat from "../components/cats/RoxanneCat";
import LaylaCat from "../components/cats/LaylaCat";
import LucyCat from "../components/cats/LucyCat";
import { fetchPlanesPublicados } from "@/lib/supabase/public-queries";
import type { Plan } from "@/utils/supabase";

export const metadata = {
  title: "Planes | 4cats",
  description: "El plan correcto para el momento de tu empresa.",
};


const fallbackPlans: Plan[] = [
  {
    id: "fallback-vitrina-digital",
    nombre: "Vitrina Digital",
    precio: 690000,
    destacado: false,
    publicado: true,
    descripcion: "Web profesional para empezar a captar confianza y consultas.",
    caracteristicas: ["Landing page optimizada", "Formulario funcional", "Diseño responsive", "Base SEO", "Entrega de código"],
  },
  {
    id: "fallback-motor-leads",
    nombre: "Motor de Leads",
    precio: 1290000,
    destacado: true,
    publicado: true,
    descripcion: "Web conectada a captación, seguimiento y oportunidades comerciales.",
    caracteristicas: ["Captura de leads", "Base de datos", "Seguimiento comercial", "Integración WhatsApp", "Analíticas base"],
  },
  {
    id: "fallback-partner-tecnologico",
    nombre: "Partner Tecnológico",
    precio: 0,
    destacado: false,
    publicado: true,
    descripcion: "Software, automatización e IA para procesos críticos.",
    caracteristicas: ["Sistema a medida", "Automatizaciones", "Panel administrativo", "Integraciones", "Soporte directo"],
  },
];
const catConfigs = [
  { color: "#9370db", Cat: LaylaCat },
  { color: "#D4788A", Cat: RoxanneCat },
  { color: "#f5a855", Cat: LucyCat },
];

function getPlanDisplayName(nombre: string) {
  const normalized = nombre.toLowerCase();
  if (normalized.includes("layla") || normalized.includes("presencia") || normalized.includes("vitrina")) return "Vitrina Digital";
  if (normalized.includes("roxanne") || normalized.includes("motor") || normalized.includes("lead")) return "Motor de Leads";
  if (normalized.includes("lucy") || normalized.includes("partner")) return "Partner Tecnológico";
  return nombre;
}
function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
      <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
      <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
      <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PlanCard({ plan, idx }: { plan: Plan; idx: number }) {
  const cfg = catConfigs[idx % 3];
  const CatComponent = cfg.Cat;
  const displayName = getPlanDisplayName(plan.nombre);

  return (
    <div
      className={`group relative flex flex-col rounded-3xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1.5 ${
        plan.destacado
          ? "bg-gradient-to-br from-[#F3EEFF] to-[#FAFAFA] dark:from-[#100B20] dark:to-[#1C1235]"
          : "bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08]"
      }`}
      style={{
        "--cfg-color": cfg.color,
        "--cfg-color-50": `${cfg.color}50`,
        "--cfg-color-35": `${cfg.color}35`,
        ...(plan.destacado ? { border: `2px solid ${cfg.color}`, boxShadow: `0 0 50px -20px ${cfg.color}35` } : {}),
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 rounded-3xl transition-shadow duration-300 pointer-events-none group-hover:shadow-[0_0_80px_-20px_var(--cfg-color-50)]" />
      
      {plan.destacado && (
        <div className="absolute top-4 right-4 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full z-10" style={{ background: cfg.color, color: "#fff" }}>
          Más popular
        </div>
      )}

      <div className="flex justify-center pt-10 pb-4 relative overflow-hidden" style={{ background: `radial-gradient(ellipse at center top, ${cfg.color}18 0%, transparent 70%)` }}>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-20 transition-opacity duration-300 group-hover:opacity-40" style={{ background: cfg.color }} />
        <CatComponent className="w-[130px] h-[156px] relative z-10 transition-transform duration-300 group-hover:scale-105" />
      </div>

      <div className="flex flex-col flex-1 p-8 relative z-10">
        <h3 className="text-2xl font-black text-[#18181B] dark:text-white mb-3">{displayName}</h3>
        {plan.descripcion && (
          <p className="text-sm text-[#18181B]/60 dark:text-white/50 mb-6 leading-relaxed">
            {displayName === "Vitrina Digital" ? "Para empresas que necesitan empezar a generar confianza online. Web profesional + contacto + posicionamiento base." :
             displayName === "Motor de Leads" ? "Para empresas que ya venden y quieren recibir más oportunidades. Web + captación + base de datos + seguimiento." :
             displayName === "Partner Tecnológico" ? "Para empresas donde los procesos manuales ya están frenando el crecimiento. Software + automatización + IA + integración." :
             plan.descripcion}
          </p>
        )}

        <div className="mb-6">
          <p className="text-xl font-bold text-[#18181B] dark:text-white">
            {plan.precio && plan.precio > 0 ? `Desde $${plan.precio.toLocaleString("es-CL")} + IVA` : "Consultar valor"}
          </p>
          <p className="text-xs text-[#18181B]/50 dark:text-white/40 mt-1">El valor final depende del alcance.</p>
        </div>

        <ul className="space-y-3 flex-1 mb-8">
          {(plan.caracteristicas || []).map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: cfg.color }}><CheckIcon /></span>
              <span className="text-sm text-[#18181B]/80 dark:text-white/70">{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/cotizar?plan=${encodeURIComponent(displayName)}`}
          className="btn-squish flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 group-hover:-translate-y-1"
          style={plan.destacado
            ? { background: cfg.color, color: "#fff", boxShadow: `0 4px 20px -4px ${cfg.color}80` }
            : { border: `1.5px solid ${cfg.color}50`, color: cfg.color }
          }
        >
          <PawIcon />
          Solicitar auditoría gratuita
        </Link>
      </div>
    </div>
  );
}

export default async function PlanesPage() {
  const fetchedPlans = (await fetchPlanesPublicados()) || [];
  const plans = fetchedPlans.length > 0 ? fetchedPlans : fallbackPlans;

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-white dark:bg-[#06030F] pt-32 pb-24 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(ellipse, #D4788A, transparent)" }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse, #7C5CBF, transparent)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px" }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#C4B5FD] bg-black/[0.03] dark:bg-white/[0.07] px-5 py-2.5 rounded-full border border-black/[0.12] dark:border-white/[0.12] mb-10">
            Escala de Valor
          </div>

          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 blur-[60px] scale-[1.6] opacity-35 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, #D4788A40, transparent)" }} />
            <RoxanneCat className="w-[160px] h-[192px] relative z-10 mx-auto" />
          </div>

          <p className="flex items-center justify-center gap-3 text-[#D4788A] font-bold tracking-[0.2em] uppercase text-xs mb-6">
            <span className="w-10 h-px bg-[#D4788A]/40" />
            Roxanne habla
            <span className="w-10 h-px bg-[#D4788A]/40" />
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#18181B] dark:text-white leading-[0.95] mb-6">
            El plan correcto<br />para{" "}
            <span className="bg-gradient-to-r from-[#9B8EB2] via-[#C4B5FD] to-[#D4788A] bg-clip-text text-transparent">
              tu momento.
            </span>
          </h1>
          <p className="text-[#18181B]/60 dark:text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
            Te acompañamos desde tu primera vitrina hasta convertirte en un motor automatizado de ventas.
          </p>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section className="bg-[#F4F4F6] dark:bg-[#0A0710] py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          {plans.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-black/10 dark:border-white/10">
              <p className="text-xl font-bold text-[#18181B] dark:text-white mb-2">Planes en construcción</p>
              <p className="text-[#18181B]/60 dark:text-white/40 text-sm">Vuelve pronto para ver nuestras novedades.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <PlanCard key={plan.id} plan={plan} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white dark:bg-[#06030F] py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#18181B] dark:text-white leading-tight mb-4">
            Descubre qué está frenando tus ventas online
          </h2>
          <p className="text-[#18181B]/60 dark:text-white/40 text-lg mb-10">
            Analizamos tu web, captación y proceso comercial y te enviamos 5 oportunidades concretas de mejora.
          </p>
          <Link
            href="/cotizar"
            className="btn-squish inline-flex items-center gap-2 px-10 py-4 bg-[#7C5CBF] text-white font-bold rounded-2xl hover:bg-[#6B4DAE] transition-colors"
            style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.65)" }}
          >
            <PawIcon />
            Solicitar auditoría gratuita
          </Link>
        </div>
      </section>
    </main>
  );
}
