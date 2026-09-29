import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, verifyPassword, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Aceita só o nome de usuário (ex.: "admin") ou o e-mail completo (compatível com o cadastro existente).
  const body = await request.json();
  const login = body.username ?? body.email;
  const password = body.password;

  if (typeof login !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const id = login.toLowerCase().trim();
  const user = await prisma.adminUser.findFirst({
    where: id.includes('@') ? { email: id } : { OR: [{ email: id }, { email: { startsWith: `${id}@` } }] },
  });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
  }

  const token = await createSessionToken({ sub: user.id, email: user.email });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
