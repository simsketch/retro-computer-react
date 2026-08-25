import RetroComputer from './components/retro/RetroComputer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative">
        <RetroComputer />

        {/* Attribution — always visible over the scene */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black/60 sm:text-[11px]">
          <a
            href="https://github.com/simsketch/retro-computer-react"
            className="pointer-events-auto hover:text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            retro-computer-react ↗
          </a>
          <span className="pointer-events-auto text-right normal-case tracking-normal">
            Original 3D scene &amp; terminal by{' '}
            <a
              href="https://github.com/edhinrichsen/retro-computer-website"
              className="underline hover:text-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edward Hinrichsen
            </a>{' '}
            (MIT) · React/Next.js port by{' '}
            <a
              href="https://elonzito.com"
              className="underline hover:text-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elon Zito
            </a>
          </span>
        </div>
      </div>
    </main>
  )
}
