# retro-computer-react

An interactive 3D retro computer — with a working UNIX-style terminal, virtual
file system, and CRT shader effects — rendered in WebGL and wrapped as a
React/Next.js client component.

**Live demo:** https://simsketch.github.io/retro-computer-react/ — click the
screen and type `help`. The scene also runs as the hero of
[elonzito.com](https://elonzito.com).

## Attribution

The original 3D scene, terminal emulator, and assets are
[retro-computer-website][upstream] by **[Edward Hinrichsen](https://github.com/edhinrichsen)**,
used under the MIT licence — all credit for the scene design, the Commodore
model treatment, the CRT shader look, and the terminal concept belongs to him.
This repository is a port of that work from a standalone Vite app into a
component that drops into any Next.js/React app. The full licence and list of
changes are in [LICENSE.md](LICENSE.md).

## What the port adds

- **Vite → Next.js/webpack**: `?raw` GLSL imports became inline template
  literals; `import.meta.glob` over the file-system content became a generated
  TypeScript module (`app/components/retro/terminal/fileSystemContent.ts`).
- **React lifecycle**: the scene boots inside a client component via dynamic
  import (three.js stays out of the initial bundle), and tears down completely
  on unmount with a full `dispose()` — safe under React StrictMode's
  mount/unmount/remount in dev.
- **Scoped keyboard capture**: an `IntersectionObserver` stops the terminal
  from swallowing keystrokes once the component scrolls off screen — necessary
  when the computer shares a page with other content.
- **Accessibility & fallbacks**: honours `prefers-reduced-motion`, renders a
  static fallback when WebGL is unavailable or the scene fails to load, and
  keeps a real `<h1>` in the DOM (the visual title is drawn inside the WebGL
  screen, which crawlers and screen readers can't see).
- **Portrait viewports** keep the computer upright instead of rotating it 90°.
- Pinned to `three@0.134`, whose APIs the scene depends on.

## Run it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000, click the screen, type `help`.

The site is fully static (`output: 'export'`); pushes to `main` deploy it to
GitHub Pages via `.github/workflows/pages.yml`, which sets
`NEXT_PUBLIC_BASE_PATH=/retro-computer-react` so the WebGL asset loaders work
under the Pages subpath.

## Make it yours

The terminal's file system is plain markdown under `content/retro-file-system/`
(currently my portfolio content). Edit or replace those files, then regenerate
the inlined module:

```bash
pnpm build:filesystem
```

Images referenced by the markdown live in `public/retro/images/`. The 3D model,
baked lightmaps, environment map, and MSDF fonts are in `public/retro/`.

To embed the computer in your own app, copy `app/components/retro/` and
`public/retro/` and render `<RetroComputer />` in a client-rendered page.

## Terminal commands

`cd`, `ls`, `pwd`, `mkdir`, `touch`, `echo`, `show` (renders markdown/images on
the CRT), `hello`, `help`.

[upstream]: https://github.com/edhinrichsen/retro-computer-website
