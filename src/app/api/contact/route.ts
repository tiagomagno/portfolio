import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        // Persiste no admin pra alimentar o pipeline de leads — falha aqui não deve bloquear o Trello.
        prisma.lead.create({ data: { source: 'contato', name, email, data: { message } } }).catch((err) => {
            console.error('Contact lead persist error:', err);
        });

        const apiKey = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_TOKEN;
        const listId = process.env.TRELLO_CONTACT_LIST_ID;

        if (!apiKey || !token || !listId) {
            console.error('Trello env vars not configured');
            return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 });
        }

        const cardName = `📬 Contato: ${name}`;
        const cardDesc = [
            `**Nome:** ${name}`,
            `**E-mail:** ${email}`,
            `---`,
            `**Mensagem:**`,
            message,
        ].join('\n');

        const url = new URL('https://api.trello.com/1/cards');
        url.searchParams.set('key', apiKey);
        url.searchParams.set('token', token);

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idList: listId,
                name: cardName,
                desc: cardDesc
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Trello API error:', error);
            return NextResponse.json({ error: 'Erro ao criar card no Trello' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
