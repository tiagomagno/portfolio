import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * IDs públicos das ferramentas de medição, lidos em runtime (env do Coolify) — assim
 * não dependem de variável de build nem de rebuild da imagem para mudar.
 * Qualquer ID ausente simplesmente desliga aquela ferramenta.
 */
export async function GET() {
  return NextResponse.json(
    {
      gaId: process.env.GA_MEASUREMENT_ID ?? '',
      metaPixelId: process.env.META_PIXEL_ID ?? '',
      clarityId: process.env.CLARITY_PROJECT_ID ?? '',
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
