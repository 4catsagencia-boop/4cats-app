"use client"

import Link from "next/link"
import { useState } from "react"
import Navbar from "./components/Navbar"

function PawIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Almohadilla central */}
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      {/* Dedo izquierdo exterior */}
      <ellipse cx="5.5" cy="11" rx="2.2" ry="2.8" transform="rotate(-15 5.5 11)" />
      {/* Dedo izquierdo interior */}
      <ellipse cx="9" cy="8.5" rx="2" ry="2.6" transform="rotate(-5 9 8.5)" />
      {/* Dedo derecho interior */}
      <ellipse cx="15" cy="8.5" rx="2" ry="2.6" transform="rotate(5 15 8.5)" />
      {/* Dedo derecho exterior */}
      <ellipse cx="18.5" cy="11" rx="2.2" ry="2.8" transform="rotate(15 18.5 11)" />
    </svg>
  )
}

function LucyCat({ isHovered }: { isHovered: boolean }) {
  const c = "#F5A855"
  return (
    <svg width="130" height="148" viewBox="0 0 100 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra */}
      <ellipse cx="50" cy="124" rx="26" ry="4" fill={c} opacity="0.25" />
      {/* Cola — misma silueta, detrás del cuerpo */}
      <path d="M75 97 Q100 76 93 52 Q87 32 70 38" stroke={c} strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Cuerpo */}
      <ellipse cx="50" cy="100" rx="32" ry="20" fill={c} />
      {/* Cabeza */}
      <circle cx="50" cy="66" r="28" fill={c} />
      {/* Orejas */}
      <path d="M26 52 L17 24 L42 46 Z" fill={c} />
      <path d="M74 52 L83 24 L58 46 Z" fill={c} />
      {/* Patas */}
      <ellipse cx="36" cy="116" rx="13" ry="7" fill={c} />
      <ellipse cx="64" cy="116" rx="13" ry="7" fill={c} />
      {/* Ojos */}
      <circle cx="39" cy="64" r="6" fill="white" />
      <circle cx="61" cy="64" r="6" fill="white" />
      <circle cx="40" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="62" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="41" cy="63" r="1.2" fill="white" />
      <circle cx="63" cy="63" r="1.2" fill="white" />
      {/* Nariz */}
      <path d="M48 72 L50 75 L52 72" fill="white" opacity="0.6" />
      {/* Corona */}
      <path d="M25 44 L29 27 L39 37 L50 19 L61 37 L71 27 L75 44 Z" fill="#FFD700" />
      <rect x="25" y="43" width="50" height="5" rx="2" fill="#FFD700" />
      <circle cx="50" cy="20" r="3.5" fill="white" opacity="0.9" />
      <circle cx="30" cy="28" r="2.5" fill="white" opacity="0.8" />
      <circle cx="70" cy="28" r="2.5" fill="white" opacity="0.8" />
    </svg>
  )
}

function BillieCatCard({ isHovered }: { isHovered: boolean }) {
  const c = "#9B8EB2"
  return (
    <svg width="130" height="148" viewBox="0 0 100 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra */}
      <ellipse cx="50" cy="124" rx="26" ry="4" fill={c} opacity="0.25" />
      {/* Cola */}
      <path d="M75 97 Q100 76 93 52 Q87 32 70 38" stroke={c} strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Cuerpo */}
      <ellipse cx="50" cy="100" rx="32" ry="20" fill={c} />
      {/* Cabeza */}
      <circle cx="50" cy="66" r="28" fill={c} />
      {/* Orejas */}
      <path d="M26 52 L17 24 L42 46 Z" fill={c} />
      <path d="M74 52 L83 24 L58 46 Z" fill={c} />
      {/* Patas */}
      <ellipse cx="36" cy="116" rx="13" ry="7" fill={c} />
      <ellipse cx="64" cy="116" rx="13" ry="7" fill={c} />
      {/* Ojos */}
      <circle cx="39" cy="64" r="6" fill="white" />
      <circle cx="61" cy="64" r="6" fill="white" />
      <circle cx="40" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="62" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="41" cy="63" r="1.2" fill="white" />
      <circle cx="63" cy="63" r="1.2" fill="white" />
      {/* Nariz */}
      <path d="M48 72 L50 75 L52 72" fill="white" opacity="0.6" />
      {/* Boina */}
      <ellipse cx="53" cy="41" rx="27" ry="10" fill="#E84393" />
      <ellipse cx="53" cy="39" rx="22" ry="7" fill="#FF6EB3" />
      {/* Pompón */}
      <circle cx="39" cy="31" r="8" fill="#E84393" />
      <circle cx="39" cy="31" r="4" fill="#FF99CC" />
    </svg>
  )
}

function LaylaCatCard({ isHovered }: { isHovered: boolean }) {
  const c = "#7C5CBF"
  return (
    <svg width="130" height="148" viewBox="0 0 100 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra */}
      <ellipse cx="50" cy="124" rx="26" ry="4" fill={c} opacity="0.25" />
      {/* Cola */}
      <path d="M75 97 Q100 76 93 52 Q87 32 70 38" stroke={c} strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Cuerpo */}
      <ellipse cx="50" cy="100" rx="32" ry="20" fill={c} />
      {/* Cabeza */}
      <circle cx="50" cy="66" r="28" fill={c} />
      {/* Orejas */}
      <path d="M26 52 L17 24 L42 46 Z" fill={c} />
      <path d="M74 52 L83 24 L58 46 Z" fill={c} />
      {/* Patas */}
      <ellipse cx="36" cy="116" rx="13" ry="7" fill={c} />
      <ellipse cx="64" cy="116" rx="13" ry="7" fill={c} />
      {/* Ojos */}
      <circle cx="39" cy="64" r="6" fill="white" />
      <circle cx="61" cy="64" r="6" fill="white" />
      <circle cx="40" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="62" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="41" cy="63" r="1.2" fill="white" />
      <circle cx="63" cy="63" r="1.2" fill="white" />
      {/* Nariz */}
      <path d="M48 72 L50 75 L52 72" fill="white" opacity="0.6" />
      {/* Audífonos — banda sobre la cabeza */}
      <path d="M14 66 Q14 30 50 28 Q86 30 86 66" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Copa izquierda */}
      <rect x="5" y="60" width="16" height="20" rx="6" fill="#FFD700" />
      <rect x="8" y="63" width="10" height="14" rx="3" fill="#FFF0A0" />
      {/* Copa derecha */}
      <rect x="79" y="60" width="16" height="20" rx="6" fill="#FFD700" />
      <rect x="82" y="63" width="10" height="14" rx="3" fill="#FFF0A0" />
    </svg>
  )
}

function RoxanneCat({ isHovered }: { isHovered: boolean }) {
  const c = "#D4788A"
  return (
    <svg width="130" height="148" viewBox="0 0 100 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra */}
      <ellipse cx="50" cy="124" rx="26" ry="4" fill={c} opacity="0.25" />
      {/* Cola */}
      <path d="M75 97 Q100 76 93 52 Q87 32 70 38" stroke={c} strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Cuerpo */}
      <ellipse cx="50" cy="100" rx="32" ry="20" fill={c} />
      {/* Cabeza */}
      <circle cx="50" cy="66" r="28" fill={c} />
      {/* Orejas */}
      <path d="M26 52 L17 24 L42 46 Z" fill={c} />
      <path d="M74 52 L83 24 L58 46 Z" fill={c} />
      {/* Patas */}
      <ellipse cx="36" cy="116" rx="13" ry="7" fill={c} />
      <ellipse cx="64" cy="116" rx="13" ry="7" fill={c} />
      {/* Ojos */}
      <circle cx="39" cy="64" r="6" fill="white" />
      <circle cx="61" cy="64" r="6" fill="white" />
      <circle cx="40" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="62" cy="64" r={isHovered ? 4.5 : 3.5} fill={c} />
      <circle cx="41" cy="63" r="1.2" fill="white" />
      <circle cx="63" cy="63" r="1.2" fill="white" />
      {/* Nariz */}
      <path d="M48 72 L50 75 L52 72" fill="white" opacity="0.6" />
      {/* Moño */}
      <path d="M50 40 L33 29 L27 40 L33 51 Z" fill="white" opacity="0.92" />
      <path d="M50 40 L67 29 L73 40 L67 51 Z" fill="white" opacity="0.92" />
      <circle cx="50" cy="40" r="5.5" fill="white" />
      {/* Detalle moño */}
      <path d="M50 40 L33 29 L27 40 L33 51 Z" fill="white" opacity="0.15" />
    </svg>
  )
}

const cats = [
  {
    id: "lucy",
    name: "Lucy",
    role: "Estrategia y Vision",
    description: "La mente maestra detras de cada proyecto. Define el camino al exito.",
    color: "#f5a855",
    song: "Lucy in the Sky",
    Component: LucyCat,
  },
  {
    id: "billie",
    name: "Billie",
    role: "Diseno y Creatividad",
    description: "Transforma ideas en experiencias visuales que enamoran.",
    color: "#9B8EB2",
    song: "Billie Jean",
    Component: BillieCatCard,
  },
  {
    id: "layla",
    name: "Layla",
    role: "Desarrollo Web",
    description: "Codigo limpio, sitios rapidos. Tu web siempre perfecta.",
    color: "#9370db",
    song: "Layla",
    Component: LaylaCatCard,
  },
  {
    id: "roxanne",
    name: "Roxanne",
    role: "Marketing Digital",
    description: "Convierte visitas en clientes con estrategias que funcionan.",
    color: "#D4788A",
    song: "Roxanne",
    Component: RoxanneCat,
  },
]

function CatCard({ cat, index }: { cat: typeof cats[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const { Component } = cat

  return (
    <div
      className="relative group"
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative bg-white rounded-3xl p-8 transition-all duration-300 overflow-hidden"
        style={{
          boxShadow: isHovered
            ? `0 20px 40px -12px ${cat.color}40, 0 8px 16px -8px rgba(0,0,0,0.1)`
            : "0 4px 20px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(${cat.color} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${cat.color}20 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
        <div className="relative flex justify-center mb-6">
          <Component isHovered={isHovered} />
        </div>
        <div className="relative text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-300" style={{ color: cat.color }}>
            {cat.song}
          </p>
          <h3 className="text-2xl font-bold text-[#18181B] mb-1">{cat.name}</h3>
          <p className="text-sm font-medium text-[#7C5CBF] mb-3">{cat.role}</p>
          <p className="text-sm text-[#52525B] leading-relaxed">{cat.description}</p>
        </div>
        <div
          className="absolute -top-2 right-4 bg-white rounded-xl px-3 py-2 shadow-lg transition-all duration-300 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
            border: `2px solid ${cat.color}30`,
          }}
        >
          <p className="text-xs font-medium text-[#52525B]">Hola! Soy {cat.name}</p>
          <div
            className="absolute -bottom-2 right-6 w-3 h-3 bg-white rotate-45"
            style={{ borderRight: `2px solid ${cat.color}30`, borderBottom: `2px solid ${cat.color}30` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#7C5CBF] bg-[#F3EEFF] px-4 py-2 rounded-full inline-block mb-6">
            Agencia digital con personalidad
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#18181B] leading-[1.1] mb-6">
            Conoce al equipo que hara<br />crecer tu negocio
          </h1>
          <p className="text-[#52525B] text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Somos 4cats. Cuatro especialistas con actitud felina, listas para disenar, desarrollar y posicionar tu presencia digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planes" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-md hover:bg-[#6B4DAE] transition-all">
              <PawIcon className="w-4 h-4" />
              Ver planes
            </Link>
            <Link href="/cotizar" className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#E4E4E7] text-[#18181B] font-semibold rounded-md hover:bg-[#FAFAFA] transition-all">
              <PawIcon className="w-4 h-4 text-[#7C5CBF]" />
              Cotizar gratis
            </Link>
          </div>
        </div>
      </section>

      {/* GATAS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((cat, index) => (
            <CatCard key={cat.id} cat={cat} index={index} />
          ))}
        </div>
      </section>

      {/* POR QUE 4CATS */}
      <section className="bg-[#FAFAFA] py-24 border-y border-[#E4E4E7]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#18181B] tracking-tight mb-16">Lo que nos hace distintos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Estrategia antes que codigo",
                desc: "Entendemos tu negocio antes de escribir una linea. Cada decision tiene un por que.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: "Precios que se entienden",
                desc: "Sin letras chicas. Sin sorpresas al final del mes. Lo que ves es lo que pagas.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
                title: "Resultados medibles",
                desc: "Analiticas reales, reportes claros. Sabes exactamente que esta pasando con tu inversion.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8 rounded-2xl border border-[#E4E4E7] hover:border-[#7C5CBF]/30 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                </div>
                <h3 className="text-xl font-bold text-[#18181B] mb-3">{item.title}</h3>
                <p className="text-[#52525B] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#7C5CBF] py-16 text-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div><p className="text-5xl font-bold mb-2">50+</p><p className="text-[#E5D8FF] font-medium tracking-wide">Proyectos completados</p></div>
          <div><p className="text-5xl font-bold mb-2">98%</p><p className="text-[#E5D8FF] font-medium tracking-wide">Clientes satisfechos</p></div>
          <div><p className="text-5xl font-bold mb-2">3 anos</p><p className="text-[#E5D8FF] font-medium tracking-wide">En el mercado</p></div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[#F3EEFF] p-12 rounded-3xl relative overflow-hidden"
          style={{ boxShadow: "0 8px 32px -8px rgba(124, 92, 191, 0.2)" }}
        >
          <div className="z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#18181B] mb-4">Listo para el siguiente nivel?</h2>
            <p className="text-[#52525B] text-lg mb-8 max-w-md">
              Hablemos hoy sobre tu proyecto. Las 4cats estamos listas para empezar a trabajar contigo.
            </p>
            <Link
              href="/cotizar"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-md hover:bg-[#6B4DAE] transition-all"
              style={{ boxShadow: "0 4px 14px -4px rgba(124, 92, 191, 0.5)" }}
            >
              <PawIcon className="w-4 h-4" />
              Contactar ahora
            </Link>
          </div>
          <div className="flex gap-4 items-end">
            <div className="transform hover:scale-105 transition-transform">
              <LucyCat isHovered={false} />
            </div>
            <div className="transform hover:scale-105 transition-transform -ml-8">
              <BillieCatCard isHovered={false} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
