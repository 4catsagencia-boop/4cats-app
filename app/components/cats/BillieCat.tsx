"use client"

interface CatProps { className?: string }

export default function BillieCat({ className }: CatProps) {
  const c = "#9B8EB2"
  return (
    <svg viewBox="0 0 108 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sombra */}
      <ellipse cx="50" cy="126" rx="27" ry="4" fill={c} opacity="0.2" />
      {/* Cola */}
      <path d="M70 98 Q102 90 100 114 Q98 130 70 128 L66 120 Q82 118 82 114 Q82 98 66 98 Z" fill={c} />
      {/* Cuerpo */}
      <ellipse cx="47" cy="102" rx="30" ry="23" fill={c} />
      {/* Cuello */}
      <ellipse cx="47" cy="83" rx="18" ry="12" fill={c} />
      {/* Cabeza */}
      <circle cx="47" cy="66" r="27" fill={c} />
      {/* Orejas */}
      <path d="M23 52 L15 30 L39 46 Z" fill={c} />
      <path d="M71 52 L79 30 L55 46 Z" fill={c} />
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
      {/* Bigotes */}
      <g stroke="white" strokeWidth="0.8" opacity="0.4" strokeLinecap="round">
        <path d="M38 74 L25 72" />
        <path d="M38 77 L25 79" />
        <path d="M38 80 L28 86" />
        <path d="M56 74 L69 72" />
        <path d="M56 77 L69 79" />
        <path d="M56 80 L66 86" />
      </g>
      {/* Boina */}
      <ellipse cx="49" cy="42" rx="26" ry="10" fill="#E84393" />
      <ellipse cx="49" cy="40" rx="21" ry="7" fill="#FF6EB3" />
      {/* Pompón */}
      <circle cx="35" cy="32" r="8" fill="#E84393" />
      <circle cx="35" cy="32" r="4" fill="#FF99CC" />
    </svg>
  )
}
