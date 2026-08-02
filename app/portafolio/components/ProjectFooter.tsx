import Link from "next/link";
import BillieCat from "../../components/cats/BillieCat";
import LaylaCat from "../../components/cats/LaylaCat";
import RoxanneCat from "../../components/cats/RoxanneCat";
import LucyCat from "../../components/cats/LucyCat";

const cats = [
  { name: "Billie", role: "Diseño y experiencia", Cat: BillieCat, color: "#9B8EB2" },
  { name: "Layla", role: "Software y arquitectura", Cat: LaylaCat, color: "#9370db" },
  { name: "Roxanne", role: "Automatización y conversión", Cat: RoxanneCat, color: "#D4788A" },
  { name: "Lucy", role: "Datos y estrategia", Cat: LucyCat, color: "#f5a855" },
];

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
      <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
      <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
      <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
    </svg>
  );
}

export function ProjectFooter({ source }: { source: string }) {
  return (
    <>
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[1fr_0.9fr] items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C5CBF]">Proyecto desarrollado por 4CATS</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#18181B] dark:text-white">Una puerta de entrada a sistemas similares.</h2>
            <p className="mt-6 text-base leading-relaxed text-[#18181B]/65 dark:text-white/50">
              4CATS es un estudio tecnológico de Temuco dirigido por Luis Sáez, enfocado en construir sistemas digitales para ventas, operaciónes y automatización.
            </p>
          </div>
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#F4F4F6] dark:bg-white/[0.04] p-6">
            <div className="grid grid-cols-2 gap-4">
              {cats.map(({ name, role, Cat, color }) => (
                <div key={name} className="rounded-xl bg-white dark:bg-[#06030F] p-4">
                  <Cat className="h-20 w-20 mx-auto" />
                  <p className="mt-3 text-sm font-black text-[#18181B] dark:text-white">{name}</p>
                  <p className="text-xs font-semibold" style={{ color }}>{role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#18181B] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">¿Necesitas construir algo parecido?</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/55">
            Podemos analizar tu flujo, ordenar el alcance y diseñar un sistema adaptado a tu operación antes de escalarlo.
          </p>
          <Link
            href={`/cotizar?source=${source}`}
            className="btn-squish mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7C5CBF] px-10 py-4 text-sm font-bold text-white hover:bg-[#6B4DAE] transition-colors"
            style={{ boxShadow: "0 4px 28px -4px rgba(124,92,191,0.65)" }}
          >
            <PawIcon />
            Solicitar auditoría gratuita
          </Link>
        </div>
      </section>
    </>
  );
}

export function ProductMockup({ title, eyebrow, items }: { title: string; eyebrow: string; items: string[] }) {
  return (
    <div className="relative min-h-[420px] rounded-[2rem] border border-black/[0.08] dark:border-white/[0.10] bg-[#F4F4F6] dark:bg-white/[0.04] overflow-hidden">
      <div className="absolute inset-x-6 top-6 h-8 rounded-t-2xl border border-black/[0.08] dark:border-white/[0.10] bg-white/80 dark:bg-[#0A0710]/80 flex items-center gap-2 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      </div>
      <div className="absolute inset-x-6 top-14 bottom-6 rounded-b-2xl border-x border-b border-black/[0.08] dark:border-white/[0.10] bg-white dark:bg-[#06030F] p-6">
        <p className="text-xs font-black tracking-widest uppercase text-[#7C5CBF]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black text-[#18181B] dark:text-white">{title}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item} className="rounded-2xl bg-[#F4F4F6] dark:bg-white/[0.06] p-4">
              <div className="mb-4 h-14 rounded-xl bg-gradient-to-br from-[#7C5CBF]/25 to-[#D4788A]/15" />
              <p className="text-xs font-bold text-[#18181B] dark:text-white">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
