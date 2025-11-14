import type {NextConfig} from 'next';

const isElectron = process.env.ELECTRON_BUILD === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable static export for Electron
  ...(isElectron && {
    output: 'export' as const,
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  }),
  // Web build configuration
  ...(!isElectron && {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'placehold.co',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'avatars.steamstatic.com',
          port: '',
          pathname: '/**',
        }
      ],
    },
  }),
};

export default nextConfig;
