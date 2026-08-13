"use client"

import { useRef } from "react"
import * as THREE from "three"
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { cn } from "@/lib/utils"

function SpinningCube(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export function Cube({ className }: { className?: string }) {
  return (
    <div className={cn("h-[400px] w-full bg-muted", className)}>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <SpinningCube />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
