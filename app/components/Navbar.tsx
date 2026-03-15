"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LucyCat from "./cats/LucyCat";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/planes", label: "Planes" },
    { href: "/cotizar", label: "Cotizar" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E4E4E7]">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <LucyCat className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="text-lg font-bold tracking-tight text-[#7C5CBF]">
            4cats
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all relative py-1 group ${
                  pathname === link.href ? "text-[#7C5CBF]" : "text-[#52525B] hover:text-[#18181B]"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-[#7C5CBF] transition-all duration-300 group-hover:w-full ${pathname === link.href ? "w-full" : ""}`} />
              </Link>
            ))}
          </div>

          <Link
            href="/cotizar"
            className="text-sm font-medium bg-[#7C5CBF] text-white px-4 py-2 rounded-md hover:bg-[#6B4DAE] transition-all active:scale-95 shadow-sm shadow-[#7C5CBF]/20"
          >
            Cotizar gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}
