import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

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
        url.searchParams.set('idList', listId);
        url.searchParams.set('name', cardName);
        url.searchParams.set('desc', cardDesc);

        const response = await fetch(url.toString(), { method: 'POST' });

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
