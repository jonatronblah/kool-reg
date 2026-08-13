// Stub for three/addons/inspector/Inspector.js
//
// R3F v10 alpha (10.0.0-alpha.3) statically imports three's WebGPU Inspector addon,
// which (a) creates an import cycle (Inspector.js -> three/webgpu) that throws
// "Cannot read properties of undefined (reading 'REVISION')" under Turbopack, and
// (b) runs a top-level _loadState() -> localStorage.getItem that crashes Node 22 SSR.
// The Inspector is WebGPU-only dev tooling; R3F never instantiates it in the WebGL
// path (it only references the type), so an empty stub is runtime-safe.
//
// Upstream: https://github.com/pmndrs/react-three-fiber/issues/3846
// Fixed in alpha.4 (PR #3855 makes the import lazy). Remove this file and the alias
// in next.config.ts after upgrading past alpha.3.
export class Inspector {
  init() {}
  dispose() {}
}

export default Inspector
