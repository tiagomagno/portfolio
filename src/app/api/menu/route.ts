import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
    return NextResponse.json({ items });
  } catch (err) {
    console.error('GET /api/menu falhou:', err);
    return NextResponse.json({ items: [] });
  }
}
