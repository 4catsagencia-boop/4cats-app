"use client"

interface CatProps { className?: string; isHovered?: boolean }

export default function RoxanneCat({ className, isHovered }: CatProps) {
  const primary = "#D4788A"
  const secondary = "#B85C6D"
  const accessory = "#FFFFFF"

  return (
    <svg 
      viewBox="0 0 108 130" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} transition-transform duration-500 ${isHovered ? "scale-105" : ""}`}
    >
      <defs>
        <linearGradient id="roxanneBodyGradient" x1="47" y1="79" x2="47" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <radialGradient id="roxanneFaceHighlight" cx="47" cy="60" r="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Sombra */}
      <ellipse cx="50" cy="126" rx="27" ry="4" fill="#000" opacity="0.1" />

      {/* Cola */}
      <path 
        d="M70 98 Q102 90 100 114 Q98 130 70 128 L66 120 Q82 118 82 114 Q82 98 66 98 Z" 
        fill="url(#roxanneBodyGradient)"
        className={`transition-all duration-700 origin-[70px_110px] ${isHovered ? "rotate-[-8deg] scale-105" : ""}`}
      />

      {/* Cuerpo */}
      <ellipse cx="47" cy="102" rx="30" ry="23" fill="url(#roxanneBodyGradient)" />
      
      {/* Cuello */}
      <ellipse cx="47" cy="83" rx="18" ry="12" fill={primary} />

      {/* Cabeza */}
      <circle cx="47" cy="66" r="27" fill="url(#roxanneBodyGradient)" />
      <circle cx="47" cy="66" r="27" fill="url(#roxanneFaceHighlight)" />

      {/* Orejas */}
      <path d="M23 52 L15 24 L39 46 Z" fill={secondary} />
      <path d="M26 48 L20 32 L34 44 Z" fill="#F8B4C0" opacity="0.4" />
      
      <path d="M71 52 L79 24 L55 46 Z" fill={secondary} />
      <path d="M68 48 L74 32 L60 44 Z" fill="#F8B4C0" opacity="0.4" />

      {/* Bigotes */}
      <g stroke="white" strokeWidth="0.5" opacity="0.3">
        <line x1="25" y1="72" x2="15" y2="72" />
        <line x1="25" y1="76" x2="17" y2="78" />
        <line x1="69" y1="72" x2="79" y2="72" />
        <line x1="69" y1="76" x2="77" y2="78" />
      </g>

      {/* Patas */}
      <ellipse cx="33" cy="121" rx="14" ry="7" fill={secondary} />
      <ellipse cx="57" cy="121" rx="14" ry="7" fill={secondary} />

      {/* Ojos */}
      <g className={`transition-transform duration-300 ${isHovered ? "scale-105" : ""}`} style={{ transformOrigin: "47px 64px" }}>
        <circle cx="38" cy="64" r="6.5" fill="white" />
        <circle cx="56" cy="64" r="6.5" fill="white" />
        
        <circle cx="38" cy="64" r={isHovered ? 4.5 : 4} fill={secondary} />
        <circle cx="56" cy="64" r={isHovered ? 4.5 : 4} fill={secondary} />
        
        <circle cx="38" cy="64" r="2" fill="#18181B" />
        <circle cx="56" cy="64" r="2" fill="#18181B" />
        
        <circle cx="40" cy="62" r="1.5" fill="white" />
        <circle cx="58" cy="62" r="1.5" fill="white" />
      </g>

      {/* Nariz */}
      <path d="M45 72 L47 75 L49 72" fill="#F8B4C0" />

      {/* Moño Hiper-Pro */}
      <g className={`transition-transform duration-500 ${isHovered ? "rotate-[5deg] scale-110" : ""}`} style={{ transformOrigin: "47px 42px" }}>
        <path d="M47 42 L30 30 L24 42 L30 54 Z" fill={accessory} fillOpacity="0.95" />
        <path d="M47 42 L64 30 L70 42 L64 54 Z" fill={accessory} fillOpacity="0.95" />
        <circle cx="47" cy="42" r="6" fill={accessory} />
        <circle cx="47" cy="42" r="3" fill="#F8B4C0" opacity="0.4" />
      </g>
    </svg>
  )
}
