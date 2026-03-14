import { spawnSync } from 'child_process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Generate Prisma client during build
      try {
        console.log('[v0] Generating Prisma client during build...')
        const result = spawnSync('npx', ['prisma', 'generate'], {
          stdio: 'inherit',
          timeout: 30000,
        })
        
        if (result.error) {
          console.warn('[v0] Prisma generation failed:', result.error)
        } else {
          console.log('[v0] Prisma client generated successfully')
        }
      } catch (error) {
        console.warn('[v0] Could not generate Prisma client:', error)
      }
    }
    
    return config
  },
}

export default nextConfig
