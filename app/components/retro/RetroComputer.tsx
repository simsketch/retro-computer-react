'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The interactive retro computer, ported from a standalone Vite/three.js
 * project into a React client component. Upstream, the licence, and the full
 * list of changes are in ./LICENSE.md.
 *
 * The scene owns a WebGL canvas and a full terminal emulator, so it needs real
 * DOM nodes rather than React state. It gets them via refs, boots once in an
 * effect, and is torn down completely on unmount — the effect must be safe to
 * run twice because React StrictMode mounts, unmounts, and remounts in dev.
 */
export default function RetroComputer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // `isActive` is read inside the scene's event handlers on every keystroke, so
  // it lives in a ref — routing it through state would re-run the effect and
  // rebuild the entire scene on every scroll.
  const activeRef = useRef(false)

  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // Track whether the computer is on screen. The terminal captures keystrokes
  // typed anywhere in the document, so it must stop doing that once the visitor
  // has scrolled on to the rest of the page.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const textarea = inputRef.current
    if (!canvas || !textarea) return

    // Skip WebGL entirely when the visitor has asked for reduced motion, or the
    // browser cannot give us a context. The static fallback renders instead.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) {
      setFailed(true)
      return
    }

    let scene: { dispose: () => void } | null = null
    let cancelled = false

    // Dynamic import keeps three.js and the terminal out of the initial bundle;
    // nothing here can run on the server anyway.
    import('./webgl')
      .then(({ default: WebGL }) => {
        if (cancelled) return
        scene = WebGL({
          canvas,
          textarea,
          isActive: () => activeRef.current,
          onProgress: (loadedCount, total) => {
            setProgress(total > 0 ? loadedCount / total : 0)
          },
          onLoaded: () => setLoaded(true),
        })
      })
      .catch((error) => {
        console.error('[retro] failed to start the scene', error)
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
      scene?.dispose()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#b9b9b9]"
      aria-label="Interactive retro computer terminal"
    >
      {/* Real heading for SEO and screen readers — the visual title is drawn
          inside the WebGL screen, which no crawler or reader can see. */}
      <h1 className="sr-only">
        Elon Zito — Lead ML Engineer, Solutions Architect and Generative AI
        Specialist
      </h1>

      <canvas
        ref={canvasRef}
        className="webgl absolute inset-0 h-full w-full touch-pan-y"
        aria-hidden="true"
      />

      {/* The terminal's real input. Kept offscreen but focusable so typing and
          mobile keyboards work; the visible caret is drawn in the 3D screen. */}
      <input
        ref={inputRef}
        id="textarea"
        type="text"
        readOnly
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Terminal input"
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
      />

      {/* Loading overlay */}
      {!loaded && !failed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#b9b9b9] transition-opacity duration-300">
          <div className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">
            Booting Elinux 1.0 LTS
          </div>
          <div className="h-1 w-48 overflow-hidden bg-black/10">
            <div
              className="h-full origin-left bg-[var(--color-rust)] transition-transform duration-200"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      )}

      {/* Static fallback: reduced motion, no WebGL, or a load failure. */}
      {failed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">
              Lead ML Engineer
            </div>
            <div className="heading-massive mt-2">Elon</div>
            <div className="heading-massive">
              <span className="italic-accent text-[0.7em]">Zito</span>
              <span className="text-[var(--color-rust)]">*</span>
            </div>
          </div>
          <p className="max-w-md font-serif text-lg leading-relaxed opacity-80">
            Architecting intelligent systems with <em>agentic AI</em>,{' '}
            <em>LLMs</em>, and <em>full-stack engineering</em>.
          </p>
        </div>
      )}

      {/* Hint + scroll indicator, once the scene is live */}
      {loaded && !failed && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
            Click the screen and type &ldquo;help&rdquo;
          </span>
          <div className="h-12 w-px animate-scroll-bounce bg-[var(--color-ink)] opacity-20" />
        </div>
      )}
    </section>
  )
}
