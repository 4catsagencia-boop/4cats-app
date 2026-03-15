"use client"

import Link from "next/link"
import { useState } from "react"
import Navbar from "./components/Navbar"

function LucyCat({ isHovered }: { isHovered: boolean }) {
  return (
    <svg width="140" height="160" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="lucyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#c97a3a" floodOpacity="0.3"/>
        </filter>
        <linearGradient id="lucyBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffbc6b"/>
          <stop offset="50%" stopColor="#f5a855"/>
          <stop offset="100%" stopColor="#e08c3a"/>
        </linearGradient>
        <linearGradient id="lucyHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe4b8" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f5a855" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="154" rx="38" ry="5" fill="#d4c4b0" opacity="0.6">
        <animate attributeName="rx" values="38;40;38" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <g filter="url(#lucyShadow)">
        <path d="M115 95 Q142 72 136 42 Q132 22 120 12" fill="url(#lucyBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 115 95;5 115 95;0 115 95;-3 115 95;0 115 95" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      <path d="M132 52 L140 48" stroke="#d4894a" strokeWidth="3" strokeLinecap="round" />
      <path d="M128 68 L137 65" stroke="#d4894a" strokeWidth="3" strokeLinecap="round" />
      <g filter="url(#lucyShadow)">
        <ellipse cx="70" cy="115" rx="45" ry="35" fill="url(#lucyBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" />
      </g>
      <ellipse cx="55" cy="100" rx="20" ry="12" fill="url(#lucyHighlight)" />
      <ellipse cx="70" cy="130" rx="38" ry="18" fill="#d98a35" opacity="0.35" />
      <path d="M38 105 Q50 98 44 118" stroke="#c67a3a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M102 105 Q90 98 96 118" stroke="#c67a3a" strokeWidth="2.5" strokeLinecap="round" />
      <g filter="url(#lucyShadow)">
        <circle cx="70" cy="60" r="38" fill="url(#lucyBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" />
      </g>
      <ellipse cx="55" cy="45" rx="18" ry="12" fill="url(#lucyHighlight)" />
      <ellipse cx="70" cy="75" rx="30" ry="12" fill="#d98a35" opacity="0.25" />
      <path d="M50 42 Q62 36 56 54" stroke="#c67a3a" strokeWidth="2" strokeLinecap="round" />
      <path d="M90 42 Q78 36 84 54" stroke="#c67a3a" strokeWidth="2" strokeLinecap="round" />
      <path d="M67 32 L70 24 L73 32" stroke="#c67a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g filter="url(#lucyShadow)">
        <path d="M32 42 L26 12 Q28 8 32 10 L48 35 Q46 42 38 42 Z" fill="url(#lucyBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" strokeLinejoin="round">
          {isHovered && <animateTransform attributeName="transform" type="rotate" values="0 38 42;-8 38 42;0 38 42" dur="0.3s" />}
        </path>
        <path d="M108 42 L114 12 Q112 8 108 10 L92 35 Q94 42 102 42 Z" fill="url(#lucyBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" strokeLinejoin="round">
          {isHovered && <animateTransform attributeName="transform" type="rotate" values="0 102 42;8 102 42;0 102 42" dur="0.3s" />}
        </path>
      </g>
      <path d="M34 38 L30 18 L44 36" fill="#ffcba4" />
      <path d="M106 38 L110 18 L96 36" fill="#ffcba4" />
      <path d="M32 25 L38 34" stroke="#c67a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M108 25 L102 34" stroke="#c67a3a" strokeWidth="1.5" strokeLinecap="round" />
      <g filter="url(#lucyShadow)">
        <path d="M48 20 L54 4 L62 16 L70 0 L78 16 L86 4 L92 20" fill="#ffd700" stroke="#5a4a3a" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <path d="M54 8 L58 14" stroke="#fff5cc" strokeWidth="2" strokeLinecap="round" />
      <circle cx="70" cy="8" r="3" fill="#ff6b9d" stroke="#5a4a3a" strokeWidth="1" />
      <ellipse cx="52" cy="58" rx="14" ry="12" fill="white" opacity="0.15" />
      <ellipse cx="88" cy="58" rx="14" ry="12" fill="white" opacity="0.15" />
      <circle cx="52" cy="58" r="14" fill="none" stroke="#5a4a3a" strokeWidth="2.5" />
      <circle cx="88" cy="58" r="14" fill="none" stroke="#5a4a3a" strokeWidth="2.5" />
      <path d="M66 58 L74 58" stroke="#5a4a3a" strokeWidth="2.5" />
      <path d="M38 54 L26 48" stroke="#5a4a3a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M102 54 L114 48" stroke="#5a4a3a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 50 Q48 48 52 50" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M80 50 Q84 48 88 50" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="52" cy="58" rx="8" ry="9" fill="white" />
      <ellipse cx="88" cy="58" rx="8" ry="9" fill="white" />
      <ellipse cx="53" cy="56" rx="4" ry="5" fill="#4a7c59" />
      <ellipse cx="89" cy="56" rx="4" ry="5" fill="#4a7c59" />
      <circle cx="55" cy="54" r="1.5" fill="white" />
      <circle cx="91" cy="54" r="1.5" fill="white" />
      <path d="M44 52 Q52 47 60 52" fill="#f5a855" stroke="#5a4a3a" strokeWidth="1.5" />
      <path d="M80 52 Q88 47 96 52" fill="#f5a855" stroke="#5a4a3a" strokeWidth="1.5" />
      <path d="M70 72 L64 80 L76 80 Z" fill="#ff9a9a" stroke="#5a4a3a" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="68" cy="74" rx="2" ry="1.5" fill="#ffb8b8" opacity="0.7" />
      <path d="M70 80 L70 84" stroke="#5a4a3a" strokeWidth="2" strokeLinecap="round" />
      <path d="M64 86 Q70 90 76 86" fill="none" stroke="#5a4a3a" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 78 L24 71" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 82 L20 82" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 86 L24 93" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 78 L116 71" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M92 82 L120 82" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 86 L116 93" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M38 95 Q70 106 102 95" fill="none" stroke="#7c5cbf" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 97 Q70 107 100 97" fill="none" stroke="#5a3d8a" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <g transform="translate(62, 98)">
        <path d="M8 0 L16 9 L8 20 L0 9 Z" fill="#87CEEB" stroke="#5a4a3a" strokeWidth="1.5">
          {isHovered && <animate attributeName="opacity" values="1;0.7;1" dur="0.5s" repeatCount="indefinite" />}
        </path>
        <path d="M8 4 L12 9 L8 14" fill="white" opacity="0.5" />
        <path d="M4 9 L8 4" stroke="white" strokeWidth="1" opacity="0.6" />
      </g>
      <ellipse cx="50" cy="149" rx="12" ry="6" fill="url(#lucyBodyGrad)" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="90" cy="149" rx="12" ry="6" fill="url(#lucyBodyGrad)" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="50" cy="152" rx="10" ry="3" fill="#c97a3a" opacity="0.3" />
      <ellipse cx="90" cy="152" rx="10" ry="3" fill="#c97a3a" opacity="0.3" />
      <circle cx="45" cy="149" r="2" fill="#ffcba4" />
      <circle cx="50" cy="147" r="2" fill="#ffcba4" />
      <circle cx="55" cy="149" r="2" fill="#ffcba4" />
      <circle cx="85" cy="149" r="2" fill="#ffcba4" />
      <circle cx="90" cy="147" r="2" fill="#ffcba4" />
      <circle cx="95" cy="149" r="2" fill="#ffcba4" />
    </svg>
  )
}

function BillieCatCard({ isHovered }: { isHovered: boolean }) {
  return (
    <svg width="140" height="165" viewBox="0 0 140 165" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="billieShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#7a7a7a" floodOpacity="0.25"/>
        </filter>
        <linearGradient id="billieBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="50%" stopColor="#f8f8f8"/>
          <stop offset="100%" stopColor="#e8e8e8"/>
        </linearGradient>
        <linearGradient id="billieHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#f0f0f0" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="158" rx="42" ry="5" fill="#c8c8c8" opacity="0.5">
        <animate attributeName="rx" values="42;44;42" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <g filter="url(#billieShadow)">
        <path d="M110 105 Q140 85 134 52 Q130 32 118 22" fill="url(#billieBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 110 105;8 110 105;0 110 105;-5 110 105;0 110 105" dur="2.5s" repeatCount="indefinite" />
        </path>
      </g>
      <ellipse cx="130" cy="52" rx="9" ry="14" fill="#9a9a9a">
        <animateTransform attributeName="transform" type="rotate" values="0 110 105;8 110 105;0 110 105;-5 110 105;0 110 105" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <g filter="url(#billieShadow)">
        <ellipse cx="70" cy="120" rx="52" ry="40" fill="url(#billieBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" />
      </g>
      <ellipse cx="52" cy="105" rx="22" ry="14" fill="url(#billieHighlight)" />
      <ellipse cx="70" cy="138" rx="44" ry="18" fill="#d0d0d0" opacity="0.4" />
      <ellipse cx="36" cy="115" rx="22" ry="26" fill="#9a9a9a" />
      <ellipse cx="104" cy="120" rx="18" ry="22" fill="#a8a8a8" />
      <ellipse cx="70" cy="145" rx="24" ry="10" fill="#b0b0b0" opacity="0.6" />
      <g filter="url(#billieShadow)">
        <circle cx="70" cy="58" r="42" fill="url(#billieBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" />
      </g>
      <ellipse cx="52" cy="42" rx="20" ry="14" fill="url(#billieHighlight)" />
      <ellipse cx="70" cy="78" rx="36" ry="14" fill="#d0d0d0" opacity="0.35" />
      <ellipse cx="94" cy="38" rx="18" ry="15" fill="#9a9a9a" />
      <ellipse cx="42" cy="52" rx="14" ry="11" fill="#a8a8a8" />
      <g filter="url(#billieShadow)">
        <ellipse cx="70" cy="22" rx="30" ry="11" fill="#e84393" stroke="#5a5a5a" strokeWidth="2" />
        <path d="M40 22 Q50 -8 70 -2 Q90 -8 100 22" fill="#e84393" stroke="#5a5a5a" strokeWidth="2" />
      </g>
      <path d="M50 10 Q60 5 70 8" stroke="#ff6eb3" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="70" cy="2" r="5" fill="#5a5a5a" />
      <g filter="url(#billieShadow)">
        <path d="M28 44 L22 16 Q24 12 28 14 L46 38 Q44 46 36 44 Z" fill="url(#billieBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M112 44 L118 16 Q116 12 112 14 L94 38 Q96 46 104 44 Z" fill="url(#billieBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <path d="M30 40 L26 22 L42 38" fill="#ffcba4" />
      <path d="M110 40 L114 22 L98 38" fill="#ffcba4" />
      <ellipse cx="28" cy="28" rx="5" ry="8" fill="#9a9a9a" />
      <ellipse cx="50" cy="55" rx="14" ry="16" fill="white" stroke="#5a5a5a" strokeWidth="2" />
      <path d="M72 55 Q88 46 104 55" fill="none" stroke="#5a5a5a" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="52" cy="57" rx="8" ry="10" fill="#e84393" />
      <circle cx="55" cy="52" r="4" fill="white" />
      <path d="M40 40 Q50 35 60 40" fill="none" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="74" rx="12" ry="8" fill="#ffb6c1" opacity="0.45" />
      <ellipse cx="108" cy="74" rx="12" ry="8" fill="#ffb6c1" opacity="0.45" />
      <path d="M70 70 L62 80 L78 80 Z" fill="#ff9a9a" stroke="#5a5a5a" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="67" cy="73" rx="2.5" ry="2" fill="#ffb8b8" opacity="0.7" />
      <path d="M70 80 L70 85" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 88 Q70 100 86 88" fill="none" stroke="#5a5a5a" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="70" cy="94" rx="7" ry="5" fill="#ff9a9a" />
      <path d="M44 78 L16 70" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M42 83 L12 83" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 88 L16 96" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M96 78 L124 70" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M98 83 L128 83" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M96 88 L124 96" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 100 Q70 116 112 100" fill="none" stroke="#4a90d9" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 103 Q70 118 110 103" fill="none" stroke="#2a5a8a" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <g transform="translate(58, 108)">
        <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="#FFD700" stroke="#5a5a5a" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="8s" repeatCount="indefinite" />
        </path>
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.5" />
      </g>
      <ellipse cx="44" cy="154" rx="16" ry="8" fill="url(#billieBodyGrad)" stroke="#5a5a5a" strokeWidth="2" />
      <ellipse cx="96" cy="154" rx="16" ry="8" fill="url(#billieBodyGrad)" stroke="#5a5a5a" strokeWidth="2" />
      <ellipse cx="40" cy="154" rx="7" ry="5" fill="#9a9a9a" />
      <ellipse cx="44" cy="157" rx="14" ry="4" fill="#c0c0c0" opacity="0.3" />
      <ellipse cx="96" cy="157" rx="14" ry="4" fill="#c0c0c0" opacity="0.3" />
      <circle cx="38" cy="154" r="2.5" fill="#ffcba4" />
      <circle cx="44" cy="152" r="2.5" fill="#ffcba4" />
      <circle cx="50" cy="154" r="2.5" fill="#ffcba4" />
      <circle cx="90" cy="154" r="2.5" fill="#ffcba4" />
      <circle cx="96" cy="152" r="2.5" fill="#ffcba4" />
      <circle cx="102" cy="154" r="2.5" fill="#ffcba4" />
    </svg>
  )
}

function LaylaCatCard({ isHovered }: { isHovered: boolean }) {
  return (
    <svg width="160" height="165" viewBox="0 0 160 165" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="laylaShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#c97a3a" floodOpacity="0.3"/>
        </filter>
        <linearGradient id="laylaBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffbc6b"/>
          <stop offset="50%" stopColor="#f5a855"/>
          <stop offset="100%" stopColor="#e08c3a"/>
        </linearGradient>
        <linearGradient id="laylaHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe4b8" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f5a855" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="158" rx="40" ry="5" fill="#d4c4b0" opacity="0.5">
        <animate attributeName="rx" values="40;42;40" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <g filter="url(#laylaShadow)">
        <path d="M115 110 Q148 82 156 45 Q158 20 148 5 Q143 -5 136 -8" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 115 110;6 115 110;0 115 110;-4 115 110;0 115 110" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M152 15 Q164 8 158 -4" fill="none" stroke="#f5a855" strokeWidth="5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 115 110;6 115 110;0 115 110;-4 115 110;0 115 110" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M156 30 Q170 24 162 12" fill="none" stroke="#f5a855" strokeWidth="5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 115 110;6 115 110;0 115 110;-4 115 110;0 115 110" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M157 48 Q172 42 164 30" fill="none" stroke="#f5a855" strokeWidth="5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 115 110;6 115 110;0 115 110;-4 115 110;0 115 110" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      <ellipse cx="152" cy="32" rx="7" ry="12" fill="#3d3d3d" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 115 110;6 115 110;0 115 110;-4 115 110;0 115 110" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <g filter="url(#laylaShadow)">
        <ellipse cx="70" cy="120" rx="48" ry="38" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" />
      </g>
      <ellipse cx="52" cy="105" rx="20" ry="12" fill="url(#laylaHighlight)" />
      <ellipse cx="70" cy="138" rx="40" ry="16" fill="#d98a35" opacity="0.35" />
      <ellipse cx="36" cy="115" rx="20" ry="24" fill="#3d3d3d" opacity="0.75" />
      <ellipse cx="102" cy="125" rx="16" ry="20" fill="#3d3d3d" opacity="0.65" />
      <ellipse cx="70" cy="108" rx="24" ry="30" fill="white" stroke="#e8e8e8" strokeWidth="1" opacity="0.92" />
      <ellipse cx="70" cy="100" rx="16" ry="18" fill="url(#laylaHighlight)" />
      <g filter="url(#laylaShadow)">
        <circle cx="70" cy="58" r="40" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" />
      </g>
      <ellipse cx="52" cy="42" rx="18" ry="12" fill="url(#laylaHighlight)" />
      <ellipse cx="70" cy="78" rx="34" ry="12" fill="#d98a35" opacity="0.25" />
      <ellipse cx="44" cy="45" rx="16" ry="14" fill="#3d3d3d" opacity="0.75" />
      <g filter="url(#laylaShadow)">
        <path d="M30 42 L24 14 Q26 10 30 12 L48 36 Q46 44 38 42 Z" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M110 42 L116 14 Q114 10 110 12 L92 36 Q94 44 102 42 Z" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <path d="M32 38 L28 20 L44 36" fill="#ffcba4" />
      <path d="M108 38 L112 20 L96 36" fill="#ffcba4" />
      <path d="M22 58 Q16 30 34 16" fill="none" stroke="#5a4a3a" strokeWidth="5" strokeLinecap="round" />
      <path d="M118 58 Q124 30 106 16" fill="none" stroke="#5a4a3a" strokeWidth="5" strokeLinecap="round" />
      <path d="M34 16 Q70 2 106 16" fill="none" stroke="#5a4a3a" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="22" cy="60" rx="12" ry="16" fill="#9370db" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="118" cy="60" rx="12" ry="16" fill="#9370db" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="22" cy="58" rx="6" ry="10" fill="#7c5cbf" />
      <ellipse cx="118" cy="58" rx="6" ry="10" fill="#7c5cbf" />
      <path d="M18 52 Q22 48 26 52" stroke="#b8a8d8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M114 52 Q118 48 122 52" stroke="#b8a8d8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="52" cy="58" rx="12" ry="14" fill="white" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="88" cy="58" rx="12" ry="14" fill="white" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="54" cy="60" rx="7" ry="9" fill="#9370db" />
      <ellipse cx="90" cy="60" rx="7" ry="9" fill="#9370db" />
      <circle cx="56" cy="56" r="3" fill="white" />
      <circle cx="92" cy="56" r="3" fill="white" />
      <path d="M40 52 Q52 45 64 52" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2" />
      <path d="M76 52 Q88 45 100 52" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2" />
      <path d="M70 72 L63 81 L77 81 Z" fill="#ff9a9a" stroke="#5a4a3a" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="67" cy="74" rx="2" ry="1.5" fill="#ffb8b8" opacity="0.7" />
      <path d="M70 81 L70 86" stroke="#5a4a3a" strokeWidth="2" strokeLinecap="round" />
      <path d="M64 89 Q73 93 82 87" fill="none" stroke="#5a4a3a" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 78 L24 71" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 83 L20 83" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 88 L24 95" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 78 L116 71" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M92 83 L120 83" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 88 L116 95" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 95 Q70 110 108 95" fill="none" stroke="#9370db" strokeWidth="5" strokeLinecap="round" />
      <path d="M34 98 Q70 112 106 98" fill="none" stroke="#5a3d8a" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <g transform="translate(62, 100)">
        <path d="M10 0 L4 10 L8 10 L2 20 L18 8 L12 8 L16 0 Z" fill="#FFD700" stroke="#5a4a3a" strokeWidth="1.5">
          {isHovered && <animate attributeName="opacity" values="1;0.6;1" dur="0.3s" repeatCount="indefinite" />}
        </path>
        <path d="M10 2 L6 10" stroke="white" strokeWidth="1.5" opacity="0.5" />
      </g>
      <ellipse cx="48" cy="154" rx="13" ry="7" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="92" cy="154" rx="13" ry="7" fill="url(#laylaBodyGrad)" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="48" cy="157" rx="11" ry="3" fill="#c97a3a" opacity="0.3" />
      <ellipse cx="92" cy="157" rx="11" ry="3" fill="#c97a3a" opacity="0.3" />
      <circle cx="43" cy="154" r="2" fill="#ffcba4" />
      <circle cx="48" cy="152" r="2" fill="#ffcba4" />
      <circle cx="53" cy="154" r="2" fill="#ffcba4" />
      <circle cx="87" cy="154" r="2" fill="#ffcba4" />
      <circle cx="92" cy="152" r="2" fill="#ffcba4" />
      <circle cx="97" cy="154" r="2" fill="#ffcba4" />
    </svg>
  )
}

function RoxanneCat({ isHovered }: { isHovered: boolean }) {
  return (
    <svg width="130" height="155" viewBox="0 0 130 155" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="roxanneShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#7a7a7a" floodOpacity="0.25"/>
        </filter>
        <linearGradient id="roxanneBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="50%" stopColor="#f8f8f8"/>
          <stop offset="100%" stopColor="#e8e8e8"/>
        </linearGradient>
        <linearGradient id="roxanneHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#f0f0f0" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <ellipse cx="65" cy="148" rx="34" ry="4" fill="#c8c8c8" opacity="0.5">
        <animate attributeName="rx" values="34;36;34" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <g filter="url(#roxanneShadow)">
        <path d="M105 95 Q125 75 118 45 Q115 28 105 20" fill="url(#roxanneBodyGrad)" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 105 95;7 105 95;0 105 95;-5 105 95;0 105 95" dur="2.2s" repeatCount="indefinite" />
        </path>
      </g>
      <ellipse cx="116" cy="50" rx="5" ry="9" fill="#f5a855" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 105 95;7 105 95;0 105 95;-5 105 95;0 105 95" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      <g filter="url(#roxanneShadow)">
        <ellipse cx="65" cy="112" rx="42" ry="34" fill="url(#roxanneBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" />
      </g>
      <ellipse cx="50" cy="98" rx="18" ry="12" fill="url(#roxanneHighlight)" />
      <ellipse cx="65" cy="128" rx="36" ry="14" fill="#d0d0d0" opacity="0.35" />
      <ellipse cx="38" cy="105" rx="16" ry="20" fill="#3d3d3d" opacity="0.7" />
      <ellipse cx="88" cy="118" rx="14" ry="16" fill="#f5a855" opacity="0.7" />
      <ellipse cx="65" cy="130" rx="18" ry="8" fill="#3d3d3d" opacity="0.5" />
      <g filter="url(#roxanneShadow)">
        <circle cx="65" cy="52" r="36" fill="url(#roxanneBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" />
      </g>
      <ellipse cx="50" cy="38" rx="16" ry="11" fill="url(#roxanneHighlight)" />
      <ellipse cx="65" cy="70" rx="30" ry="10" fill="#d0d0d0" opacity="0.3" />
      <ellipse cx="48" cy="38" rx="12" ry="10" fill="#3d3d3d" opacity="0.7" />
      <ellipse cx="82" cy="42" rx="10" ry="8" fill="#f5a855" opacity="0.7" />
      <g filter="url(#roxanneShadow)">
        <path d="M32 38 L26 12 Q28 8 32 10 L48 32 Q46 40 38 38 Z" fill="url(#roxanneBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M98 38 L104 12 Q102 8 98 10 L82 32 Q84 40 92 38 Z" fill="url(#roxanneBodyGrad)" stroke="#5a5a5a" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <path d="M34 34 L30 18 L44 32" fill="#ffcba4" />
      <path d="M96 34 L100 18 L86 32" fill="#ffcba4" />
      <ellipse cx="32" cy="22" rx="4" ry="6" fill="#3d3d3d" opacity="0.6" />
      <ellipse cx="98" cy="22" rx="4" ry="6" fill="#f5a855" opacity="0.7" />
      <g transform="translate(85, 75)">
        <rect x="0" y="0" width="28" height="18" rx="2" fill="#5a5a5a" stroke="#3d3d3d" strokeWidth="1.5" />
        <rect x="2" y="2" width="24" height="12" rx="1" fill="#1a1a2e" />
        <path d="M5 11 L9 8 L13 10 L17 5 L21 7" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="21" cy="7" r="1.5" fill="#4ade80" />
        <rect x="0" y="16" width="28" height="4" rx="1" fill="#4a4a4a" />
      </g>
      <ellipse cx="50" cy="52" rx="11" ry="13" fill="white" stroke="#5a5a5a" strokeWidth="2" />
      <ellipse cx="80" cy="52" rx="11" ry="13" fill="white" stroke="#5a5a5a" strokeWidth="2" />
      <ellipse cx="52" cy="54" rx="6" ry="8" fill="#c47a7a" />
      <ellipse cx="82" cy="54" rx="6" ry="8" fill="#c47a7a" />
      <circle cx="54" cy="50" r="2.5" fill="white" />
      <circle cx="84" cy="50" r="2.5" fill="white" />
      <path d="M42 42 L58 46" stroke="#5a5a5a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M88 42 L72 46" stroke="#5a5a5a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M65 62 L59 70 L71 70 Z" fill="#ff9a9a" stroke="#5a5a5a" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="63" cy="64" rx="2" ry="1.5" fill="#ffb8b8" opacity="0.7" />
      <path d="M65 70 L65 74" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 76 Q65 79 70 76" fill="none" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 68 L26 62" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M46 72 L22 72" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 76 L26 82" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M82 68 L104 62" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M84 72 L108 72" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M82 76 L104 82" stroke="#5a5a5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 85 Q65 98 96 85" fill="none" stroke="#c47a7a" strokeWidth="4" strokeLinecap="round" />
      <path d="M36 88 Q65 100 94 88" fill="none" stroke="#8a4a4a" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <g transform="translate(58, 90)">
        <rect x="4" y="0" width="6" height="3" fill="#5a5a5a" rx="1" />
        <ellipse cx="7" cy="9" rx="5" ry="7" fill="#ff6b6b" stroke="#5a5a5a" strokeWidth="1.5">
          {isHovered && <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />}
        </ellipse>
        <ellipse cx="6" cy="7" rx="2" ry="3" fill="#ff9a9a" opacity="0.6" />
      </g>
      <ellipse cx="48" cy="144" rx="11" ry="6" fill="url(#roxanneBodyGrad)" stroke="#5a5a5a" strokeWidth="2" />
      <ellipse cx="82" cy="144" rx="11" ry="6" fill="url(#roxanneBodyGrad)" stroke="#5a5a5a" strokeWidth="2" />
      <ellipse cx="48" cy="147" rx="9" ry="3" fill="#c0c0c0" opacity="0.3" />
      <ellipse cx="82" cy="147" rx="9" ry="3" fill="#c0c0c0" opacity="0.3" />
      <circle cx="43" cy="144" r="2" fill="#ffcba4" />
      <circle cx="48" cy="142" r="2" fill="#ffcba4" />
      <circle cx="53" cy="144" r="2" fill="#ffcba4" />
      <circle cx="77" cy="144" r="2" fill="#ffcba4" />
      <circle cx="82" cy="142" r="2" fill="#ffcba4" />
      <circle cx="87" cy="144" r="2" fill="#ffcba4" />
    </svg>
  )
}

const cats = [
  {
    id: "lucy",
    name: "Lucy",
    role: "Estrategia y Vision",
    description: "La mente maestra detras de cada proyecto. Define el camino al exito.",
    color: "#f5a855",
    song: "Lucy in the Sky",
    Component: LucyCat,
  },
  {
    id: "billie",
    name: "Billie",
    role: "Diseno y Creatividad",
    description: "Transforma ideas en experiencias visuales que enamoran.",
    color: "#9a9a9a",
    song: "Billie Jean",
    Component: BillieCatCard,
  },
  {
    id: "layla",
    name: "Layla",
    role: "Desarrollo Web",
    description: "Codigo limpio, sitios rapidos. Tu web siempre perfecta.",
    color: "#9370db",
    song: "Layla",
    Component: LaylaCatCard,
  },
  {
    id: "roxanne",
    name: "Roxanne",
    role: "Marketing Digital",
    description: "Convierte visitas en clientes con estrategias que funcionan.",
    color: "#c47a7a",
    song: "Roxanne",
    Component: RoxanneCat,
  },
]

function CatCard({ cat, index }: { cat: typeof cats[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const { Component } = cat

  return (
    <div
      className="relative group"
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative bg-white rounded-3xl p-8 transition-all duration-300 overflow-hidden"
        style={{
          boxShadow: isHovered
            ? `0 20px 40px -12px ${cat.color}40, 0 8px 16px -8px rgba(0,0,0,0.1)`
            : "0 4px 20px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(${cat.color} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${cat.color}20 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
        <div className="relative flex justify-center mb-6">
          <Component isHovered={isHovered} />
        </div>
        <div className="relative text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-300" style={{ color: cat.color }}>
            {cat.song}
          </p>
          <h3 className="text-2xl font-bold text-[#18181B] mb-1">{cat.name}</h3>
          <p className="text-sm font-medium text-[#7C5CBF] mb-3">{cat.role}</p>
          <p className="text-sm text-[#52525B] leading-relaxed">{cat.description}</p>
        </div>
        <div
          className="absolute -top-2 right-4 bg-white rounded-xl px-3 py-2 shadow-lg transition-all duration-300 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
            border: `2px solid ${cat.color}30`,
          }}
        >
          <p className="text-xs font-medium text-[#52525B]">Hola! Soy {cat.name}</p>
          <div
            className="absolute -bottom-2 right-6 w-3 h-3 bg-white rotate-45"
            style={{ borderRight: `2px solid ${cat.color}30`, borderBottom: `2px solid ${cat.color}30` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#7C5CBF] bg-[#F3EEFF] px-4 py-2 rounded-full inline-block mb-6">
            Agencia digital con personalidad
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#18181B] leading-[1.1] mb-6">
            Conoce al equipo que hara<br />crecer tu negocio
          </h1>
          <p className="text-[#52525B] text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Somos 4cats. Cuatro especialistas con actitud felina, listas para disenar, desarrollar y posicionar tu presencia digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planes" className="px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-md hover:bg-[#6B4DAE] transition-all text-center">
              Ver planes
            </Link>
            <Link href="/cotizar" className="px-8 py-3 border border-[#E4E4E7] text-[#18181B] font-semibold rounded-md hover:bg-[#FAFAFA] transition-all text-center">
              Cotizar gratis
            </Link>
          </div>
        </div>
      </section>

      {/* GATAS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((cat, index) => (
            <CatCard key={cat.id} cat={cat} index={index} />
          ))}
        </div>
      </section>

      {/* POR QUE 4CATS */}
      <section className="bg-[#FAFAFA] py-24 border-y border-[#E4E4E7]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#18181B] tracking-tight mb-16">Lo que nos hace distintos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Estrategia antes que codigo",
                desc: "Entendemos tu negocio antes de escribir una linea. Cada decision tiene un por que.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: "Precios que se entienden",
                desc: "Sin letras chicas. Sin sorpresas al final del mes. Lo que ves es lo que pagas.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
                title: "Resultados medibles",
                desc: "Analiticas reales, reportes claros. Sabes exactamente que esta pasando con tu inversion.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8 rounded-2xl border border-[#E4E4E7] hover:border-[#7C5CBF]/30 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#7C5CBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                </div>
                <h3 className="text-xl font-bold text-[#18181B] mb-3">{item.title}</h3>
                <p className="text-[#52525B] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#7C5CBF] py-16 text-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div><p className="text-5xl font-bold mb-2">50+</p><p className="text-[#E5D8FF] font-medium tracking-wide">Proyectos completados</p></div>
          <div><p className="text-5xl font-bold mb-2">98%</p><p className="text-[#E5D8FF] font-medium tracking-wide">Clientes satisfechos</p></div>
          <div><p className="text-5xl font-bold mb-2">3 anos</p><p className="text-[#E5D8FF] font-medium tracking-wide">En el mercado</p></div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[#F3EEFF] p-12 rounded-3xl relative overflow-hidden"
          style={{ boxShadow: "0 8px 32px -8px rgba(124, 92, 191, 0.2)" }}
        >
          <div className="z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#18181B] mb-4">Listo para el siguiente nivel?</h2>
            <p className="text-[#52525B] text-lg mb-8 max-w-md">
              Hablemos hoy sobre tu proyecto. Las 4cats estamos listas para empezar a trabajar contigo.
            </p>
            <Link
              href="/cotizar"
              className="inline-block px-8 py-3 bg-[#7C5CBF] text-white font-semibold rounded-md hover:bg-[#6B4DAE] transition-all"
              style={{ boxShadow: "0 4px 14px -4px rgba(124, 92, 191, 0.5)" }}
            >
              Contactar ahora
            </Link>
          </div>
          <div className="flex gap-4 items-end">
            <div className="transform hover:scale-105 transition-transform">
              <LucyCat isHovered={false} />
            </div>
            <div className="transform hover:scale-105 transition-transform -ml-8">
              <BillieCatCard isHovered={false} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
