import Navbar from "../components/Navbar";
import LaylaCat from "../components/cats/LaylaCat";
import AuditoriaForm from "./AuditoriaForm";

export const metadata = {
  title: "Auditoría Gratuita | 4cats",
  description: "Descubre qué está frenando tus ventas online con nuestra auditoría técnica y comercial.",
};

export default function CotizarPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#06030F] overflow-x-hidden">
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse, #9370db, transparent)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.06] pointer-events-none" style={{ background: "radial-gradient(ellipse, #D4788A, transparent)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 grid md:grid-cols-[1fr_440px] gap-16 items-start">

        {/* Left: intro */}
        <div className="pt-4">
          <div className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#C4B5FD] bg-black/[0.03] dark:bg-white/[0.07] px-5 py-2.5 rounded-full border border-black/[0.12] dark:border-white/[0.12] mb-10">
            Diagnóstico
          </div>

          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 blur-[50px] scale-[1.5] opacity-30 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, #9370db40, transparent)" }} />
            <LaylaCat className="w-[140px] h-[168px] relative z-10" />
          </div>

          <p className="flex items-center gap-3 text-[#9370db] font-bold tracking-[0.2em] uppercase text-xs mb-5">
            <span className="w-10 h-px bg-[#9370db]/40" />
            Layla te recibe
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#18181B] dark:text-white tracking-tight leading-[0.95] mb-5">
            Descubre qué está<br />
            <span className="bg-gradient-to-r from-[#9370db] to-[#C4B5FD] bg-clip-text text-transparent">frenando tus ventas.</span>
          </h1>
          <p className="text-[#18181B]/60 dark:text-white/40 text-lg leading-relaxed mb-12">
            No necesitas otra web, necesitas un sistema que funcione. Cuéntanos sobre tu negocio y te entregaremos un análisis claro con oportunidades de mejora inmediatas, gratis.
          </p>

          <div className="flex flex-col gap-5">
            {[
              { label: "luis.saez@4cats.cl", icon: "M2 6l8 5 8-5M2 6v10a1 1 0 001 1h14a1 1 0 001-1V6M2 6a1 1 0 011-1h14a1 1 0 011 1" },
              { label: "+56 9 3481 9569", icon: "M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.05 3.16a1 1 0 01-.23 1.02L7.91 9.09a11.05 11.05 0 005 5l1.23-1.14a1 1 0 011.02-.23l3.16 1.05a1 1 0 01.68.95V17a2 2 0 01-2 2C7.16 19 1 12.84 1 5a2 2 0 012-2z" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.10] dark:border-white/[0.10] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-[#7C5CBF]">
                    <path d={item.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[#18181B]/70 dark:text-white/60 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form (Client Component) */}
        <div>
          <AuditoriaForm />
        </div>
      </div>
    </main>
  );
}
