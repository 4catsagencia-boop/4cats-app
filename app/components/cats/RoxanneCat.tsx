"use client";

interface CatProps {
  className?: string;
}

export default function RoxanneCat({ className = "" }: CatProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body leaning forward */}
      <path
        d="M30 80C30 65 40 55 55 55C75 55 95 65 95 85"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#EDE8F5"
      />
      {/* Head forward */}
      <path
        d="M85 75C85 65 92 58 100 58C108 58 115 65 115 75C115 85 108 92 100 92C92 92 85 85 85 75Z"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        fill="#EDE8F5"
      />
      {/* Ears - one forward, one back */}
      <path
        d="M100 58L105 40L112 55M90 60L75 45L95 58"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tail up and curved */}
      <path
        d="M30 80C15 80 10 70 15 55"
        stroke="#7C5CBF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Motion lines */}
      <path d="M10 85C5 85 0 83" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" />
      <path d="M8 90C3 90 -2 88" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" />
      <path d="M12 95C7 95 2 93" stroke="#7C5CBF" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
