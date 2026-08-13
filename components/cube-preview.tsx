"use client"

import dynamic from "next/dynamic"

// fiber v10 alpha eagerly imports three's inspector addon, which reads
// localStorage at module top-level. ssr:false keeps that module off the
// server so SSR does not crash with "Cannot read properties of undefined
// (reading 'getItem')".
const Cube = dynamic(
  () => import("@/registry/scenes/cube/cube").then((m) => ({ default: m.Cube })),
  {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted" />,
  }
)

export function CubePreview() {
  return <Cube />
}
