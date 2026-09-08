import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, ...rest } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    await prisma.lead.create({
      data: { source: 'briefing', name, email, data: rest },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Não bloqueia o envio do briefing (que já foi feito por e-mail) — só loga.
    console.error('Briefing lead persist error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
