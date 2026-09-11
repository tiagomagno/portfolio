import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Sem sinal explícito de "dinâmico", um GET assim pode ficar em cache (navegador/CDN na
// frente do site) e uma mudança salva no admin (/admin/sections) não aparecer até um redeploy.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sections = await prisma.homeSection.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ sections }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
  } catch (err) {
    console.error('GET /api/sections falhou:', err);
    return NextResponse.json({ sections: [] }, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
  }
}
