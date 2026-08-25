/**
 * Public URL prefix for the retro computer's assets.
 *
 * The original Vite project read this from `import.meta.env.BASE_URL` (set to
 * `/portfolio/` by its vite.config). Under Next the assets are served out of
 * `public/retro/`; NEXT_PUBLIC_BASE_PATH (inlined at build time) carries the
 * site's basePath when it is deployed under a subpath, e.g. GitHub Pages
 * serving from /retro-computer-react.
 */
export const BASE_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/retro`
