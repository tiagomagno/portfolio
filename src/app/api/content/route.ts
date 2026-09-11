import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lido direto pelo client (LangContext) a cada carregamento — sem isso, um GET sem sinal
// explícito de "dinâmico" pode ficar em cache (navegador/CDN na frente do site) e uma
// mudança salva no admin (/admin/textos) não aparece até um redeploy.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await prisma.pageContent.findMany();
    const content: Record<string, { pt: string; en: string }> = {};
    for (const row of rows) {
      content[row.key] = { pt: row.valuePt, en: row.valueEn };
    }
    return NextResponse.json({ content }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
  } catch (err) {
    console.error('GET /api/content falhou:', err);
    return NextResponse.json({ content: {} }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
  }
}
