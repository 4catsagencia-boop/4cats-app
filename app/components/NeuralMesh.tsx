"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useTheme } from "../context/ThemeContext"

function Scene({ pointCount = 1500, distortionRadius = 2.5 }) {
  const { theme } = useTheme()
  const { viewport, mouse } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)

  // Colores basados en el tema
  const colors = useMemo(() => {
    return theme === "dark" 
      ? { point: "#7C5CBF", line: "#7C5CBF", opacity: 0.2 }
      : { point: "#7C5CBF", line: "#7C5CBF", opacity: 0.15 }
  }, [theme])

  // Inicializar posiciones estables (se ejecutan una sola vez)
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(pointCount * 3)
    const initPos = new Float32Array(pointCount * 3)
    
    // Usamos un generador pseudo-aleatorio simple (LCG) para mantener la pureza en React 19
    let seed = 42
    const pseudoRandom = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }

    for (let i = 0; i < pointCount; i++) {
      const x = (pseudoRandom() - 0.5) * 20
      const y = (pseudoRandom() - 0.5) * 20
      const z = (pseudoRandom() - 0.5) * 10
      
      pos[i * 3] = initPos[i * 3] = x
      pos[i * 3 + 1] = initPos[i * 3 + 1] = y
      pos[i * 3 + 2] = initPos[i * 3 + 2] = z
    }
    return [pos, initPos]
  }, [pointCount])

  // Lógica de distorsión y animación
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const time = state.clock.getElapsedTime()
    
    // Transformar coordenadas del mouse (-1 a 1) a coordenadas de la escena
    const mx = (mouse.x * viewport.width) / 2
    const my = (mouse.y * viewport.height) / 2

    for (let i = 0; i < pointCount; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      // Movimiento base (flotación suave)
      const x = initialPositions[ix] + Math.sin(time * 0.5 + initialPositions[ix]) * 0.2
      const y = initialPositions[iy] + Math.cos(time * 0.5 + initialPositions[iy]) * 0.2
      const z = initialPositions[iz]

      // Cálculo de distancia al mouse
      const dx = x - mx
      const dy = y - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < distortionRadius) {
        // Efecto de repulsión
        const force = (1 - dist / distortionRadius) * 0.8
        attr.array[ix] = x + dx * force
        attr.array[iy] = y + dy * force
      } else {
        attr.array[ix] = x
        attr.array[iy] = y
      }
      attr.array[iz] = z
    }
    attr.needsUpdate = true

    // Actualizar líneas (esto es más costoso, limitamos a los primeros N puntos para performance)
    if (linesRef.current) {
      const lineAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      // Simplificación: solo conectamos puntos correlativos para crear una "malla" visual
      // sin el costo O(n^2) de buscar vecinos reales en cada frame.
      for (let i = 0; i < pointCount - 1; i++) {
        if (i % 20 === 0) continue // Romper la red para que no sea una sola línea
        lineAttr.array[i * 6] = attr.array[i * 3]
        lineAttr.array[i * 6 + 1] = attr.array[i * 3 + 1]
        lineAttr.array[i * 6 + 2] = attr.array[i * 3 + 2]
        
        lineAttr.array[i * 6 + 3] = attr.array[(i + 1) * 3]
        lineAttr.array[i * 6 + 4] = attr.array[(i + 1) * 3 + 1]
        lineAttr.array[i * 6 + 5] = attr.array[(i + 1) * 3 + 2]
      }
      lineAttr.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={pointCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={colors.point}
          transparent
          opacity={colors.opacity * 2}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(pointCount * 6), 3]}
            count={pointCount * 2}
            array={new Float32Array(pointCount * 6)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={colors.line}
          transparent
          opacity={colors.opacity}
        />
      </lineSegments>
    </>
  )
}

export default function NeuralMesh() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]} // Optimización para pantallas retina
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
