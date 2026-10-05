import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pickAttribution } from '@/lib/analytics';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        await prisma.lead.create({ data: { source: 'contato', name, email, data: { message, ...pickAttribution(body) } } });

        return NextResponse.json({ success: true });
    } catch (error) {
        // Não bloqueia o envio do contato (que já foi feito por e-mail) — só loga.
        console.error('Contact lead persist error:', error);
        return NextResponse.json({ success: false }, { status: 200 });
    }
}
