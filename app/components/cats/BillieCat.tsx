"use client";

interface CatProps {
  className?: string;
}

export default function BillieCat({ className = "" }: CatProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body lying down */}
      <path
        d="M20 90C20 75 40 65 60 65C85 65 105 75 105 90C105 100 85 105 60 105C35 105 20 100 20 90Z"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#EDE8F5"
      />
      {/* Head resting */}
      <path
        d="M80 75C80 65 88 58 95 58C102 58 110 65 110 75C110 85 102 92 95 92C88 92 80 85 80 75Z"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        fill="#EDE8F5"
      />
      {/* Ears down */}
      <path
        d="M85 62L75 52L90 58M105 62L115 52L100 58"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sleeping eyes */}
      <path d="M88 75C88 78 92 78 92 75" stroke="#7C5CBF" strokeWidth="1" />
      <path d="M98 75C98 78 102 78 102 75" stroke="#7C5CBF" strokeWidth="1" />
      {/* ZZZ */}
      <path d="M40 50L50 50L40 60L50 60" stroke="#7C5CBF" strokeWidth="0.8" />
      <path d="M25 40L32 40L25 47L32 47" stroke="#7C5CBF" strokeWidth="0.8" />
    </svg>
  );
}
