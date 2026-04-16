"use client"

interface CatProps { className?: string; isHovered?: boolean }

export default function LucyCat({ className, isHovered }: CatProps) {
  const primary = "#F5A855"
  const secondary = "#E6943D"
  const accent = "#FFD700"

  return (
    <svg 
      viewBox="0 0 108 130" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} transition-transform duration-500 ${isHovered ? "scale-105" : ""}`}
    >
      <defs>
        <linearGradient id="lucyBodyGradient" x1="47" y1="79" x2="47" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <radialGradient id="lucyFaceHighlight" cx="47" cy="60" r="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="lucyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Sombra proyectada */}
      <ellipse cx="50" cy="126" rx="27" ry="4" fill="#000" opacity="0.1" />

      {/* Cola con movimiento */}
      <path 
        d="M70 98 Q102 90 100 114 Q98 130 70 128 L66 120 Q82 118 82 114 Q82 98 66 98 Z" 
        fill="url(#lucyBodyGradient)" 
        className={`transition-all duration-700 origin-[70px_110px] ${isHovered ? "rotate-6" : ""}`}
      />

      {/* Cuerpo con volumen */}
      <ellipse cx="47" cy="102" rx="30" ry="23" fill="url(#lucyBodyGradient)" />
      
      {/* Cuello */}
      <ellipse cx="47" cy="83" rx="18" ry="12" fill={primary} />

      {/* Cabeza */}
      <circle cx="47" cy="66" r="27" fill="url(#lucyBodyGradient)" />
      <circle cx="47" cy="66" r="27" fill="url(#lucyFaceHighlight)" />

      {/* Orejas con detalle interno */}
      <path d="M23 52 L15 24 L39 46 Z" fill={secondary} />
      <path d="M26 48 L20 32 L34 44 Z" fill="#FFCBA4" opacity="0.4" />
      
      <path d="M71 52 L79 24 L55 46 Z" fill={secondary} />
      <path d="M68 48 L74 32 L60 44 Z" fill="#FFCBA4" opacity="0.4" />

      {/* Bigotes */}
      <g stroke="white" strokeWidth="0.5" opacity="0.4">
        <line x1="25" y1="72" x2="10" y2="70" />
        <line x1="25" y1="75" x2="8" y2="76" />
        <line x1="69" y1="72" x2="84" y2="70" />
        <line x1="69" y1="75" x2="86" y2="76" />
      </g>

      {/* Patas con "deditos" */}
      <ellipse cx="33" cy="121" rx="14" ry="7" fill={secondary} />
      <circle cx="25" cy="123" r="3" fill="white" opacity="0.1" />
      <circle cx="33" cy="123" r="3" fill="white" opacity="0.1" />
      
      <ellipse cx="57" cy="121" rx="14" ry="7" fill={secondary} />
      <circle cx="57" cy="123" r="3" fill="white" opacity="0.1" />
      <circle cx="65" cy="123" r="3" fill="white" opacity="0.1" />

      {/* Ojos Hiper-Pro */}
      <g className={`transition-transform duration-300 ${isHovered ? "scale-105" : ""}`} style={{ transformOrigin: "47px 64px" }}>
        {/* Fondo ojo */}
        <circle cx="38" cy="64" r="6.5" fill="white" />
        <circle cx="56" cy="64" r="6.5" fill="white" />
        
        {/* Iris con gradiente */}
        <circle cx="38" cy="64" r={isHovered ? 4.5 : 4} fill={secondary} />
        <circle cx="56" cy="64" r={isHovered ? 4.5 : 4} fill={secondary} />
        
        {/* Pupila */}
        <circle cx="38" cy="64" r="2" fill="#18181B" />
        <circle cx="56" cy="64" r="2" fill="#18181B" />
        
        {/* Brillo de ojos */}
        <circle cx="40" cy="62" r="1.5" fill="white" />
        <circle cx="58" cy="62" r="1.5" fill="white" />
      </g>

      {/* Nariz y boca */}
      <path d="M45 72 L47 75 L49 72" fill="#FFCBA4" />
      <path d="M44 78 Q47 80 50 78" stroke="#000" strokeWidth="0.5" opacity="0.2" fill="none" />

      {/* Corona Mejorada */}
      <g filter={isHovered ? "url(#lucyGlow)" : ""}>
        <path d="M22 46 L26 27 L36 38 L47 19 L58 38 L68 27 L72 46 Z" fill={accent} />
        <rect x="22" y="44" width="50" height="5" rx="2.5" fill="#E6C200" />
        <circle cx="47" cy="20" r="3.5" fill="white" />
        <circle cx="27" cy="28" r="2.5" fill="white" opacity="0.8" />
        <circle cx="67" cy="28" r="2.5" fill="white" opacity="0.8" />
        {/* Gemas */}
        <circle cx="47" cy="46" r="1.5" fill="#FF0000" opacity="0.6" />
        <circle cx="35" cy="46" r="1.5" fill="#0000FF" opacity="0.6" />
        <circle cx="59" cy="46" r="1.5" fill="#00FF00" opacity="0.6" />
      </g>
    </svg>
  )
}
