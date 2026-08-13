import path from "node:path"
import type { NextConfig } from "next"

// R3F v10 alpha eagerly imports three's WebGPU Inspector addon, which has an import
// cycle (-> three/webgpu) that crashes under Turbopack with "Cannot read properties
// of undefined (reading 'REVISION')". Alias it to a no-op stub.
// See lib/three-inspector-stub.ts and https://github.com/pmndrs/react-three-fiber/issues/3846
const inspectorStub = path.resolve(process.cwd(), "lib/three-inspector-stub.ts")

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Turbopack rejects absolute Windows paths ("windows imports are not implemented
      // yet"), so use a project-root-relative specifier here.
      "three/addons/inspector/Inspector.js": "./lib/three-inspector-stub.ts",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // `$` = exact match in webpack; absolute path is fine for webpack.
      "three/addons/inspector/Inspector.js$": inspectorStub,
    }
    return config
  },
}

export default nextConfig
