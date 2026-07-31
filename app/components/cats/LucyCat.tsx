"use client"

import Image from "next/image"

interface CatProps { className?: string }

export default function LucyCat({ className }: CatProps) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <Image
        src="/cats/lucy.png"
        alt="Lucy — Datos e Inteligencia"
        fill
        sizes="(max-width: 768px) 160px, 240px"
        className="object-contain drop-shadow-lg"
        priority={false}
      />
    </div>
  )
}
