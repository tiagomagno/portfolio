import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lido direto pelo client (Header.tsx) a cada carregamento — sem isso, um GET sem sinal
// explícito de "dinâmico" pode ficar em cache (navegador/CDN na frente do site) e uma
// mudança salva no admin (/admin/menu) não aparece até um redeploy.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
  } catch (err) {
    console.error('GET /api/menu falhou:', err);
    return NextResponse.json({ items: [] }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
  }
}
