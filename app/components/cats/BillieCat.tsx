"use client"

import Image from "next/image"

interface CatProps { className?: string }

export default function BillieCat({ className }: CatProps) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <Image
        src="/cats/billie.png"
        alt="Billie — Diseño y Experiencia"
        fill
        sizes="(max-width: 768px) 160px, 240px"
        className="object-contain drop-shadow-lg"
        priority={false}
      />
    </div>
  )
}
