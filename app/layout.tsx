import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Retro Computer — React/Next.js port',
  description:
    'An interactive 3D retro computer with a working terminal, rendered in WebGL. A React/Next.js port of Edward Hinrichsen’s retro-computer-website.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
