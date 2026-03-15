"use client";

interface CatProps {
  className?: string;
}

export default function LaylaCat({ className = "" }: CatProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sitting side view */}
      <path
        d="M40 95C40 80 50 65 65 55C80 45 90 30 80 15C70 5 55 10 50 25C45 40 40 60 40 95Z"
        stroke="#6B4DAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#F3EEFF"
      />
      {/* Elegant tail */}
      <path
        d="M40 95C25 95 20 85 25 70"
        stroke="#6B4DAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ears */}
      <path
        d="M65 15L70 5L80 12"
        stroke="#6B4DAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Collar/Bow detail */}
      <circle cx="58" cy="45" r="2.5" fill="#6B4DAE" />
    </svg>
  );
}
