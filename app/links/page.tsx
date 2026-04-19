import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../components/Logo";
import { FadeUp } from "../components/FadeUp";

export const metadata: Metadata = {
  title: "4cats — Enlaces y Contacto",
  description: "Accede a todos nuestros canales oficiales, portafolio y solicita tu cotización.",
  icons: {
    icon: "/logo-web.png",
    apple: "/logo-web.png",
  },
};

export default function LinksPage() {
  const links = [
    {
      label: "Solicitar Cotización",
      sub: "Propuesta gratuita en < 24h",
      href: "/cotizar",
      primary: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Ver Portafolio",
      sub: "Casos de éxito reales",
      href: "/portafolio",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      label: "Nuestra Web",
      sub: "Explora el universo 4cats",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
    {
      label: "WhatsApp Directo",
      sub: "Consultas inmediatas",
      href: "https://wa.me/56934819569",
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03a11.782 11.782 0 001.592 5.961L0 24l6.117-1.605a11.782 11.782 0 005.925 1.585h.005c6.637 0 12.032-5.391 12.036-12.027a11.791 11.791 0 00-3.615-8.504z" />
        </svg>
      ),
    },
    {
      label: "Instagram Oficial",
      sub: "@4cats.ai",
      href: "https://www.instagram.com/4cats.ai/",
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#06030F] text-white selection:bg-[#7C5CBF]/30 relative overflow-hidden flex flex-col items-center px-6 py-16">
      
      {/* ── BACKGROUND ATMOSPHERE ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C5CBF]/15 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4788A]/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[url('/file.svg')] opacity-[0.03] bg-repeat pointer-events-none" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
        
        {/* Profile Header */}
        <FadeUp>
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-24 h-24 relative mb-6">
              <div className="absolute inset-0 bg-[#7C5CBF]/20 blur-xl rounded-full" />
              <div className="relative w-full h-full bg-[#141418] border border-white/10 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
                <Logo className="w-full h-full text-[#7C5CBF]" />
              </div>
            </div>
            <h1 className="text-2xl font-black mb-2 tracking-tight">4cats digital agency</h1>
            <p className="text-white/40 text-sm font-medium px-4">
              Software a medida · IA · Automatización
            </p>
          </div>
        </FadeUp>

        {/* Links List */}
        <div className="w-full flex flex-col gap-4 mb-16">
          {links.map((link, i) => (
            <FadeUp key={link.href} delay={i * 80}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-squish group flex items-center gap-4 w-full p-4 rounded-2xl border transition-all ${
                    link.primary 
                      ? "bg-[#7C5CBF] border-white/20 text-white" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/80"
                  }`}
                  style={link.primary ? { boxShadow: "0 10px 30px -5px rgba(124, 92, 191, 0.4)" } : {}}
                >
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${link.primary ? "bg-white/15" : "bg-white/5"}`}>
                    {link.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-bold ${link.primary ? "text-white" : "text-white"}`}>{link.label}</p>
                    <p className={`text-[11px] ${link.primary ? "text-white/60" : "text-white/30"}`}>{link.sub}</p>
                  </div>
                  <svg className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={`btn-squish group flex items-center gap-4 w-full p-4 rounded-2xl border transition-all ${
                    link.primary 
                      ? "bg-[#7C5CBF] border-white/20 text-white" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/80"
                  }`}
                  style={link.primary ? { boxShadow: "0 10px 30px -5px rgba(124, 92, 191, 0.4)" } : {}}
                >
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${link.primary ? "bg-white/15" : "bg-white/5"}`}>
                    {link.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-bold ${link.primary ? "text-white" : "text-white"}`}>{link.label}</p>
                    <p className={`text-[11px] ${link.primary ? "text-white/60" : "text-white/30"}`}>{link.sub}</p>
                  </div>
                  <svg className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </FadeUp>
          ))}
        </div>

        {/* Footer */}
        <FadeUp delay={600}>
          <div className="flex flex-col items-center gap-6 opacity-30">
            <div className="flex items-center gap-8">
               <a href="https://www.instagram.com/4cats.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7C5CBF] transition-colors">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                 </svg>
               </a>
               <a href="https://wa.me/56934819569" target="_blank" rel="noopener noreferrer" className="hover:text-[#7C5CBF] transition-colors">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                 </svg>
               </a>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">4cats studio · temuco</span>
          </div>
        </FadeUp>

      </div>
    </main>
  );
}
