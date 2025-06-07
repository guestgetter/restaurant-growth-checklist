/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Webpack configuration for better stability
  webpack: (config, { dev, isServer }) => {
    // Prevent webpack cache corruption in development
    if (dev) {
      config.cache = false;
    }
    
    // Better error handling for missing modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
  
  // Experimental features for better stability
  experimental: {
    // Disable problematic optimizations in development
    optimizePackageImports: ['lucide-react'],
  },
  
  // Better error overlay in development
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig 