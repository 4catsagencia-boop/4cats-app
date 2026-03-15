"use client";

interface CatProps {
  className?: string;
}

export default function BillieCat({ className = "" }: CatProps) {
  return (
    <svg
      viewBox="0 0 180 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── CUERPO echado, forma redondeada horizontal ── */}
      <ellipse cx="98" cy="91" rx="68" ry="22" fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Barriga suave */}
      <ellipse cx="100" cy="93" rx="48" ry="13" fill="#F3EEFF" />

      {/* ── PATAS DELANTERAS extendidas hacia la izquierda ── */}
      {/* Pata izquierda */}
      <path
        d="M28 88 Q20 87 17 91 Q14 95 20 97 Q27 99 36 97 Q42 95 40 90 Q37 86 28 88Z"
        fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Pata derecha (debajo de la cabeza) */}
      <path
        d="M44 87 Q36 86 33 90 Q30 94 36 96 Q43 98 52 96 Q58 94 56 89 Q53 85 44 87Z"
        fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Beans pata izquierda */}
      <circle cx="20" cy="95" r="2" fill="#7C5CBF" opacity="0.25" />
      <circle cx="25" cy="96.5" r="2" fill="#7C5CBF" opacity="0.25" />
      <circle cx="30" cy="96.5" r="2" fill="#7C5CBF" opacity="0.25" />
      <circle cx="35" cy="95.5" r="2" fill="#7C5CBF" opacity="0.25" />
      {/* Beans pata derecha */}
      <circle cx="36" cy="94" r="2" fill="#7C5CBF" opacity="0.25" />
      <circle cx="41" cy="95.5" r="2" fill="#7C5CBF" opacity="0.25" />
      <circle cx="46" cy="95.5" r="2" fill="#7C5CBF" opacity="0.25" />
      <circle cx="51" cy="94.5" r="2" fill="#7C5CBF" opacity="0.25" />

      {/* ── CABEZA apoyada en las patas ── */}
      <circle cx="46" cy="70" r="21" fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.5" />

      {/* ── OREJAS ── */}
      {/* Oreja izquierda */}
      <path
        d="M32 54 L24 40 L40 52"
        fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M32 54 L27 44 L38 52" fill="#E5D8FF" />
      {/* Oreja derecha */}
      <path
        d="M58 51 L66 38 L62 54"
        fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M58 51 L63 41 L61 53" fill="#E5D8FF" />

      {/* ── OJOS somnolientos (arcos hacia abajo = ojos cerrados/soñolientos) ── */}
      <path d="M35 68 Q40 72 45 68" stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 68 Q53 72 58 68" stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pestañas sutiles */}
      <path d="M36 67 L34 65" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" />
      <path d="M58 67 L60 65" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" />

      {/* ── NARIZ y BOCA ── */}
      <path d="M44 76 L47 78 L50 76" fill="#7C5CBF" opacity="0.7" />
      <path d="M47 78 Q44 82 41 81" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" />
      <path d="M47 78 Q50 82 53 81" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" />

      {/* ── BIGOTES izquierda ── */}
      <path d="M22 72 L36 74" stroke="#7C5CBF" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M20 76 L35 77" stroke="#7C5CBF" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M22 80 L36 79" stroke="#7C5CBF" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      {/* ── BIGOTES derecha ── */}
      <path d="M57 74 L73 72" stroke="#7C5CBF" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M58 77 L75 76" stroke="#7C5CBF" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M57 79 L73 80" stroke="#7C5CBF" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />

      {/* ── COLA enroscada en la parte derecha del cuerpo ── */}
      <path
        d="M160 88 Q172 68 162 52 Q152 38 140 46 Q128 54 136 66 Q142 75 148 82"
        stroke="#7C5CBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Punta de la cola */}
      <ellipse cx="143" cy="47" rx="7" ry="10" fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.5"
        style={{ transformOrigin: "143px 47px", transform: "rotate(-25deg)" }}
      />

      {/* ── PATAS TRASERAS asomando ── */}
      <path
        d="M148 100 Q152 105 160 104 Q168 103 166 97 Q163 92 155 93 Q148 94 148 100Z"
        fill="#EDE8F5" stroke="#7C5CBF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── ZZZ flotando ── */}
      <path d="M80 38 L89 38 L80 48 L89 48" stroke="#7C5CBF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M93 26 L99 26 L93 33 L99 33" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
      <path d="M104 16 L108 16 L104 21 L108 21" stroke="#7C5CBF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    </svg>
  );
}
