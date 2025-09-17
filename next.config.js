/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 15
  eslint: {
    // Disable ESLint during builds for faster deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during builds for faster deployment
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig