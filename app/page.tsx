import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#888] mb-5">
          Soluciones digitales
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-[#111] mb-5 leading-tight max-w-xl">
          Haz crecer tu negocio en línea
        </h1>
        <p className="text-[#666] text-base max-w-lg leading-relaxed mb-10">
          Diseñamos, desarrollamos y posicionamos tu presencia digital. Planes
          claros, sin costos ocultos, con resultados medibles.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/planes"
            className="text-sm font-medium bg-[#111] text-white px-5 py-2.5 rounded-md hover:bg-[#333] transition-colors"
          >
            Ver planes
          </Link>
          <Link
            href="/cotizar"
            className="text-sm font-medium text-[#111] border border-[#e5e5e5] px-5 py-2.5 rounded-md hover:bg-[#f5f5f5] transition-colors"
          >
            Cotizar gratis
          </Link>
        </div>
      </main>
    </div>
  );
}
