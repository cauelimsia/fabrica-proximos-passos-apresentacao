import type { NextConfig } from 'next';

// Site estático para o GitHub Pages: https://cauelimsia.github.io/fabrica-proximos-passos-apresentacao/
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/fabrica-proximos-passos-apresentacao',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
