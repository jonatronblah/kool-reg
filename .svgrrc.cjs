/** @type {import('@svgr/core').Config} */
// SVGR config — converts assets/svg-source/*.svg into registry/icons/*.tsx.
// Run: pnpm svg:build   (see docs/svg-graphics.md for the full pipeline rationale)
module.exports = {
  // Icon mode: default size to 1em so `className="size-*"` / font-size drives sizing.
  icon: true,
  typescript: true,
  // Default export per icon file (SVGR default) — clean and collision-free across
  // the icon set; consumers do `import SketchStar from "@/registry/icons/SketchStar"`.
  // React 19 / Next automatic JSX runtime — no `import React` needed.
  jsxRuntime: "automatic",
  // Recolor design-tool black strokes to currentColor so the SVG inherits
  // Tailwind text-* tokens (text-foreground, text-primary, dark mode, ...).
  replaceAttrValues: { "#000": "currentColor", "#000000": "currentColor" },
  svgo: true,
  svgoConfig: {
    plugins: [
      // Use SVGO's default preset, but NEVER strip the viewBox (it's required for
      // the SVG to scale correctly via className sizing).
      { name: "preset-default", params: { overrides: { removeViewBox: false } } },
    ],
  },
}
