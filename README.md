# retro-computer-react

An interactive 3D retro computer — with a working UNIX-style terminal, virtual
file system, and CRT shader effects — rendered in WebGL and wrapped as a
React/Next.js client component.

**Live:** the scene runs as the hero of [elonzito.com](https://elonzito.com).
Click the screen and type `help`.

This is a port of [retro-computer-website][upstream] by **Edward Hinrichsen**
(MIT), moved from a standalone Vite app into a component that drops into any
Next.js/React app. Full attribution and licence in [LICENSE.md](LICENSE.md).

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
