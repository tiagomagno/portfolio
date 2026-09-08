import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sections = await prisma.homeSection.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ sections });
  } catch (err) {
    console.error('GET /api/sections falhou:', err);
    return NextResponse.json({ sections: [] });
  }
}
