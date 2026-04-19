"use client";

import { usePathname } from "next/navigation";

export default function FloatingContact() {
  const pathname = usePathname();
  
  // No mostrar en el panel de control o admin para no estorbar
  if (pathname.startsWith("/cats-control") || pathname.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl = "https://wa.me/56934819569?text=Hola%204cats!%20Me%20gustar%C3%ADa%20cotizar%20un%20proyecto.";
  const instagramUrl = "https://www.instagram.com/4cats.ai/";

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Instagram Label (Elegante) */}
      <a 
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group flex items-center gap-2 bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full transition-all hover:scale-105 hover:bg-white/10"
      >
        <span className="text-[10px] font-bold text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-widest">Follow us</span>
        <svg className="w-4 h-4 text-[#D4788A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>

      {/* WhatsApp Button (Conversión) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto btn-squish group relative flex items-center justify-center w-14 h-14 bg-[#7C5CBF] text-white rounded-2xl shadow-2xl transition-all duration-300 hover:rotate-6 active:scale-90 overflow-hidden"
        style={{ 
          boxShadow: "0 10px 30px -5px rgba(124, 92, 191, 0.5)",
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Icon */}
        <svg className="w-7 h-7 relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03a11.782 11.782 0 001.592 5.961L0 24l6.117-1.605a11.782 11.782 0 005.925 1.585h.005c6.637 0 12.032-5.391 12.036-12.027a11.791 11.791 0 00-3.615-8.504z" />
        </svg>

        {/* Pulse Ring */}
        <span className="absolute flex h-full w-full">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-[#7C5CBF] opacity-20"></span>
        </span>
      </a>

    </div>
  );
}
