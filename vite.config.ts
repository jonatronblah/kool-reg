import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // @/* -> project root (matches tsconfig "@/*": ["./*"]).
      // String find matches "@" exactly or "@/" prefix only, so scoped packages
      // like @react-three/fiber are NOT affected.
      { find: "@", replacement: fileURLToPath(new URL(".", import.meta.url)) },
      // R3F v10 alpha.3 eagerly imports three's WebGPU Inspector addon, which has an
      // import cycle that crashed under Turbopack. Kept here preemptively (zero-cost:
      // the WebGL cube never instantiates the Inspector). Remove after upgrading past
      // alpha.3 (https://github.com/pmndrs/react-three-fiber/issues/3846, PR #3855).
      {
        find: /^three\/addons\/inspector\/Inspector\.js$/,
        replacement: fileURLToPath(
          new URL("./lib/three-inspector-stub.ts", import.meta.url)
        ),
      },
    ],
  },
})
