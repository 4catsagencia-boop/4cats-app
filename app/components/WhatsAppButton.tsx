"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Aparece ligeramente después del scroll para que no estorbe instantáneamente
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {/* Glow pulsante de fondo */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full blur opacity-40 animate-pulse"></div>
      
      <Link 
        href="https://wa.me/56912345678" // FIXME: Reemplazar con el WhatsApp real
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#25D366] to-[#128C7E] rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-7 h-7 text-white"
        >
          <path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.6-1.3-.8-1.8-.1-.4-.3-.4-.4-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.4 1.7.5.8.1 1.5.1 2-.1.6-.2 1.3-.8 1.5-1.5.2-.7.2-1.2.1-1.4-.1-.3-.3-.4-.5-.5z" />
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5-1.3c1.4.8 3.1 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.2.8.9-3.1-.2-.3C4.1 15 3.7 13.5 3.7 12c0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.3-8.3 8.3z" />
        </svg>

        {/* Badge indicador de no-leído (generador de curiosidad) */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-[#0A0710] rounded-full animate-bounce"></span>
      </Link>
    </div>
  );
}
