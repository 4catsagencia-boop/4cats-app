"use client"

import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  useImage?: boolean;
}

export default function Logo({ className = "w-8 h-8", size = 512, useImage = true }: LogoProps) {
  if (useImage) {
    return (
      <div className={`relative ${className}`}>
        <Image 
          src="/logo-web.png" 
          alt="4cats Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Orejas */}
      <path d="M140 220 L110 100 L220 180 Z" fill="currentColor" />
      <path d="M372 220 L402 100 L292 180 Z" fill="currentColor" />
      
      {/* Cabeza */}
      <circle cx="256" cy="280" r="140" fill="currentColor" />
      
      {/* Ojos */}
      <circle cx="210" cy="270" r="20" fill="white" />
      <circle cx="302" cy="270" r="20" fill="white" />
      
      {/* Nariz */}
      <path 
        d="M245 310 L256 325 L267 310" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
