import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Garante que o engine do Prisma seja incluído no build standalone (o file tracing
  // do Next não o detecta sozinho, e sem isso o admin quebra em produção).
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
