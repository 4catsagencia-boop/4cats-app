import Link from "next/link";
import Navbar from "./components/Navbar";
import LucyCat from "./components/cats/LucyCat";
import BillieCat from "./components/cats/BillieCat";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-6 order-2 md:order-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#7C5CBF] bg-[#F3EEFF] px-3 py-1 rounded-full w-fit">
            Agencia digital · Chile
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-[#18181B] leading-[1.1]">
            Tu negocio merece una estrategia con actitud
          </h1>
          <p className="text-[#52525B] text-lg leading-relaxed max-w-lg">
            Somos 4cats. Diseñamos, desarrollamos y posicionamos presencias
            digitales que convierten. Sin humo. Con resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/planes"
              className="px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-md hover:bg-[#6B4DAE] transition-all text-center"
            >
              Ver planes
            </Link>
            <Link
              href="/cotizar"
              className="px-8 py-3 border border-[#E4E4E7] text-[#18181B] font-semibold rounded-md hover:bg-[#FAFAFA] transition-all text-center"
            >
              Cotizar gratis
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center order-1 md:order-2">
          <LucyCat className="w-64 h-64 md:w-80 md:h-80 drop-shadow-sm" />
          <p className="text-xs text-[#A1A1AA] mt-4 font-medium uppercase tracking-widest">
            Lucy · Fundadora
          </p>
        </div>
      </section>

      {/* WHY 4CATS SECTION */}
      <section className="bg-[#FAFAFA] py-24 border-y border-[#E4E4E7]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#18181B] tracking-tight mb-16">
            Lo que nos hace distintos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl border border-[#E4E4E7] hover:border-[#7C5CBF]/30 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#18181B] mb-3">Estrategia antes que código</h3>
              <p className="text-[#52525B] text-sm leading-relaxed">
                Entendemos tu negocio antes de escribir una línea. Cada decisión tiene un por qué.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-[#E4E4E7] hover:border-[#7C5CBF]/30 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#18181B] mb-3">Precios que se entienden</h3>
              <p className="text-[#52525B] text-sm leading-relaxed">
                Sin letras chicas. Sin sorpresas al final del mes. Lo que ves es lo que pagas.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-[#E4E4E7] hover:border-[#7C5CBF]/30 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#18181B] mb-3">Resultados medibles</h3>
              <p className="text-[#52525B] text-sm leading-relaxed">
                Analíticas reales, reportes claros. Sabes exactamente qué está pasando con tu inversión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section className="bg-[#7C5CBF] py-16 text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
          <div>
            <p className="text-5xl font-bold mb-2">50+</p>
            <p className="text-[#E5D8FF] font-medium tracking-wide">Proyectos completados</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">98%</p>
            <p className="text-[#E5D8FF] font-medium tracking-wide">Clientes satisfechos</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">3 años</p>
            <p className="text-[#E5D8FF] font-medium tracking-wide">En el mercado</p>
          </div>
        </div>
      </section>

      {/* FOOTER CONTACT SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[#E4E4E7]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[#F3EEFF] p-12 rounded-3xl relative overflow-hidden">
          <div className="z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#18181B] mb-4">
              ¿Listo para el siguiente nivel?
            </h2>
            <p className="text-[#52525B] text-lg mb-8 max-w-md">
              Hablemos hoy sobre tu proyecto. Estamos listos para empezar a trabajar contigo.
            </p>
            <Link
              href="/cotizar"
              className="inline-block px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-md hover:bg-[#6B4DAE] transition-all"
            >
              Contactar ahora
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <BillieCat className="w-48 h-48 md:w-64 md:h-64" />
            <p className="text-xs text-[#7C5CBF] font-medium uppercase tracking-widest mt-2">
              Billie · Soporte
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
