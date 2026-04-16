"use client"

interface CatProps { className?: string }

export default function LucyCat({ className }: CatProps) {
  const c = "#F5A855"
  return (
    <svg viewBox="0 0 108 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sombra */}
      <ellipse cx="50" cy="126" rx="27" ry="4" fill={c} opacity="0.2" />
      {/* Cola — forma C rellena que abraza el lado derecho */}
      <path d="M70 98 Q102 90 100 114 Q98 130 70 128 L66 120 Q82 118 82 114 Q82 98 66 98 Z" fill={c} />
      {/* Cuerpo */}
      <ellipse cx="47" cy="102" rx="30" ry="23" fill={c} />
      {/* Cuello — une cabeza y cuerpo sin costura */}
      <ellipse cx="47" cy="83" rx="18" ry="12" fill={c} />
      {/* Cabeza */}
      <circle cx="47" cy="66" r="27" fill={c} />
      {/* Orejas */}
      <path d="M23 52 L15 24 L39 46 Z" fill={c} />
      <path d="M71 52 L79 24 L55 46 Z" fill={c} />
      {/* Patas */}
      <ellipse cx="33" cy="121" rx="14" ry="7" fill={c} />
      <ellipse cx="57" cy="121" rx="14" ry="7" fill={c} />
      {/* Ojos */}
      <circle cx="38" cy="64" r="6.5" fill="white" />
      <circle cx="56" cy="64" r="6.5" fill="white" />
      <circle cx="39" cy="64" r={3.5} fill={c} />
      <circle cx="57" cy="64" r={3.5} fill={c} />
      <circle cx="40" cy="63" r="1.2" fill="white" />
      <circle cx="58" cy="63" r="1.2" fill="white" />
      {/* Nariz */}
      <path d="M45 72 L47 76 L49 72" fill="white" opacity="0.6" />
      {/* Corona */}
      <path d="M22 46 L26 27 L36 38 L47 19 L58 38 L68 27 L72 46 Z" fill="#FFD700" />
      <rect x="22" y="44" width="50" height="5" rx="2.5" fill="#FFD700" />
      <circle cx="47" cy="20" r="3.5" fill="white" opacity="0.9" />
      <circle cx="27" cy="28" r="2.5" fill="white" opacity="0.85" />
      <circle cx="67" cy="28" r="2.5" fill="white" opacity="0.85" />
    </svg>
  )
}
