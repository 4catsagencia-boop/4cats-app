"use client";

interface CatProps {
  className?: string;
}

export default function LucyCat({ className = "" }: CatProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body & Head */}
      <path
        d="M60 100C45 100 35 90 35 70V50C35 40 45 30 60 30C75 30 85 40 85 50V70C85 90 75 100 60 100Z"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#F3EEFF"
      />
      {/* Ears */}
      <path
        d="M35 50L30 25L50 35M85 50L90 25L70 35"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tail */}
      <path
        d="M85 90C100 90 105 80 105 70"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crown */}
      <circle cx="55" cy="20" r="1.5" fill="#7C5CBF" />
      <circle cx="60" cy="18" r="1.5" fill="#7C5CBF" />
      <circle cx="65" cy="20" r="1.5" fill="#7C5CBF" />
      {/* Eyes (minimalist) */}
      <path d="M50 50H55M65 50H70" stroke="#7C5CBF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
