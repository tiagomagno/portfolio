import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows = await prisma.pageContent.findMany();
    const content: Record<string, { pt: string; en: string }> = {};
    for (const row of rows) {
      content[row.key] = { pt: row.valuePt, en: row.valueEn };
    }
    return NextResponse.json({ content });
  } catch (err) {
    console.error('GET /api/content falhou:', err);
    return NextResponse.json({ content: {} });
  }
}
