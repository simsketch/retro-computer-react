/** @type {import('next').NextConfig} */

// Set NEXT_PUBLIC_BASE_PATH when the site is served from a subpath — the
// GitHub Pages deploy sets it to "/retro-computer-react". The same variable
// feeds app/components/retro/basePath.ts so the WebGL loaders find the assets.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined

const nextConfig = {
  output: 'export',
  basePath,
}

export default nextConfig
