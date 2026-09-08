import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Existe um package.json solto em C:\Projects (fora deste projeto) que faz o Next
  // inferir a raiz errada pro tracing de arquivos — sem isso, o build standalone sai
  // quase vazio (só react/react-dom), derrubando qualquer rota que use Prisma,
  // bcryptjs, jose ou sharp em produção.
  outputFileTracingRoot: path.join(__dirname),
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
