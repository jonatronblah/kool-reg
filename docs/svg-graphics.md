# SVG Graphics Pipeline

How this registry turns hand-drawn vector art into distributable shadcn components.

## TL;DR

**Static hand-drawn SVGs (exported from a design tool) → optimized → converted to inline-TSX components → shipped as `.tsx` in the registry.** No runtime libraries, no bundler config for us or for consumers. This is the lucide / shadcn / magicui pattern.

Avoid importing `.svg` files at runtime — that forces every consumer to configure SVGR for their bundler, and Turbopack vs webpack diverge (see [Pitfalls](#preview-app-pitfalls)). Avoid procedural libraries unless a component's geometry is genuinely data-driven.

## File layout

| Location | Purpose | Distributed to consumers? |
|---|---|---|
| `assets/svg-source/*.svg` | Design source (raw exports from Figma/Illustrator/Inkscape). Build-time **input** only. | No |
| `.svgrrc.cjs` | SVGR conversion config (icon mode, TypeScript, `currentColor` rewrite, keep `viewBox`). | No |
| `registry/icons/*.tsx` | Generated inline-SVG components — the actual registry artifacts. | **Yes** (via `registry.json`) |

## Pipeline — adding a new icon

1. Export from your design tool as `.svg` (outline strokes, expand text to paths, keep `viewBox`). Drop it in `assets/svg-source/`.
2. Run the converter:
   ```bash
   pnpm svg:build
   ```
   SVGR (with bundled SVGO) runs over `assets/svg-source/*.svg` → `registry/icons/*.tsx`, rewriting `#000`→`currentColor`, dropping fixed size, keeping `viewBox`.
3. Add an item to `registry.json` pointing at the generated `.tsx` (`type: "registry:ui"`). No `dependencies` — pure inline SVG.
4. `pnpm registry:build` to emit the manifest under `public/r/`.

## Generated component shape

```tsx
import type { SVGProps } from "react"
const SvgSketchStar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="..." />
  </svg>
)
export default SvgSketchStar
```

`currentColor` + spread props means Tailwind drives color and size:

```tsx
import SketchStar from "@/registry/icons/SketchStar"

<SketchStar className="size-8 text-primary" />          // themed, dark-mode aware
<SketchStar className="size-4 text-muted-foreground" /> // muted
```

CSS `size-*` / `text-*` override the SVG's presentation attributes, so the icon scales and recolors with your design tokens.

## Accessibility

- **Decorative** (sits next to a text label): `aria-hidden="true"`.
- **Meaningful** (conveys info on its own): `role="img"` + `aria-label`, or a `<title>` child referenced by `aria-labelledby`.

## When to go procedural (rare)

Only if the shape is **data-driven** (a sketchy bar whose height is a prop, a generative doodle, a hand-drawn border around arbitrary content). Then call **`roughjs`** (npm: `roughjs`, *not* `rough`) directly inside a `"use client"` component, generating paths in `useEffect`/`useMemo` with a fixed `seed` — randomized jitter otherwise causes SSR hydration mismatches. Declare `roughjs` in the item's `dependencies`.

**Avoid:**
- `react-rough-fiber` — despite the name it is **not** React Three Fiber; it's a standalone `react-reconciler` renderer with no declared React 19 support and low recent activity.
- `rough-notation` — unmaintained (6 yrs); it's for annotating existing text, not building graphic components.

## Preview-app pitfalls

- **Turbopack/webpack divergence — avoided.** Inline-TSX SVG compiles under any bundler with zero config. (The `.svg`-import route would require SVGR in *both* `webpack()` and `turbopack.rules`, and so would every consumer — the same dual-bundler pain as the R3F inspector alias in `next.config.ts`.)
- **Payload size.** Inline SVG ships in the JS bundle. SVGO optimizes it (the pipeline does this). For a very large illustration, prefer `public/*.svg` + `<img>` over inlining.
- **`roughjs` + SSR.** Randomized strokes differ server vs client → hydration error. Client component + seed.
- **CSP.** Inline `<svg>` markup is fine; inline `style="..."` attributes can require `style-src 'unsafe-inline'`. Use Tailwind classes, not inline styles.
- **`next/image`.** Don't feed SVG to the Image optimizer; use `unoptimized` or a plain element.

## Sources

- SVGR — Next.js integration & CLI: <https://react-svgr.com/docs/next/>, <https://react-svgr.com/docs/cli/>
- SVGO: <https://github.com/svg/svgo>
- Next.js Turbopack config (`turbopack.rules`, loader constraints): <https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack>
- `roughjs`: <https://www.npmjs.com/package/roughjs>
- `react-rough-fiber` (reconciler-based, React 18 only documented): <https://www.npmjs.com/package/react-rough-fiber>
- magicui inline-SVG registry pattern: <https://github.com/magicuidesign/magicui>
