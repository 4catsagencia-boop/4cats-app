import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#18181B] text-white mt-0">

      {/* Main footer */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div>
            <span className="text-2xl font-bold tracking-tight text-white">4cats</span>
            <span className="ml-2 text-xs font-medium text-[#7C5CBF] bg-[#7C5CBF]/10 px-2 py-0.5 rounded-full">Agencia digital</span>
          </div>
          <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm">
            Diseñamos, desarrollamos y posicionamos presencias digitales que convierten.
            Sin humo. Con resultados medibles.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <a href="tel:+56934819569" className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors group">
              <svg className="w-4 h-4 text-[#7C5CBF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.05 3.16a1 1 0 01-.23 1.02L7.91 9.09a11.05 11.05 0 005 5l1.23-1.14a1 1 0 011.02-.23l3.16 1.05a1 1 0 01.68.95V17a2 2 0 01-2 2C7.16 19 1 12.84 1 5a2 2 0 012-2z" />
              </svg>
              +56 9 3481 9569
            </a>
            <a href="mailto:luis.saez@4cats.cl" className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors">
              <svg className="w-4 h-4 text-[#7C5CBF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              luis.saez@4cats.cl
            </a>
            <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
              <svg className="w-4 h-4 text-[#7C5CBF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Santiago, Chile
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#52525B]">Servicios</p>
          <ul className="flex flex-col gap-2.5">
            {[
              { label: "Diseño web", href: "/planes" },
              { label: "Desarrollo a medida", href: "/planes" },
              { label: "Posicionamiento SEO", href: "/planes" },
              { label: "E-commerce", href: "/planes" },
              { label: "Marketing digital", href: "/planes" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-[#A1A1AA] hover:text-white transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#52525B]">Empresa</p>
          <ul className="flex flex-col gap-2.5">
            {[
              { label: "Planes y precios", href: "/planes" },
              { label: "Cotizar gratis", href: "/cotizar" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-[#A1A1AA] hover:text-white transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Las gatas */}
          <div className="mt-4 pt-4 border-t border-[#27272A]">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#52525B] mb-3">El equipo</p>
            <div className="flex flex-col gap-1.5">
              {[
                { name: "Lucy", role: "Fundadora" },
                { name: "Billie", role: "Soporte" },
                { name: "Layla", role: "Diseño" },
                { name: "Roxanne", role: "Estrategia" },
              ].map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CBF]" />
                  <span className="text-xs text-[#71717A]">
                    <span className="text-[#A1A1AA] font-medium">{cat.name}</span>
                    {" · "}{cat.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#27272A]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#52525B]">
            © {year} 4cats. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[#3F3F46] italic">
            Billie · Layla · Roxanne · Lucy — nombres inspirados en el rock clásico
          </p>
        </div>
      </div>

    </footer>
  );
}
