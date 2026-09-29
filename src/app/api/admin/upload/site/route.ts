import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/session';

// Arquivos do site (não são imagens de case): currículo em PDF e logo (SVG/PNG/WebP), salvos como enviados.
const KINDS = {
  resume: { types: { 'application/pdf': 'pdf' }, max: 10 * 1024 * 1024, prefix: 'curriculo' },
  logo: { types: { 'image/svg+xml': 'svg', 'image/png': 'png', 'image/webp': 'webp' }, max: 2 * 1024 * 1024, prefix: 'logo' },
} as const;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  const kind = formData.get('kind');

  if (!(file instanceof File) || (kind !== 'resume' && kind !== 'logo')) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
  const rule = KINDS[kind];
  const ext = (rule.types as Record<string, string>)[file.type];
  if (!ext) return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
  if (file.size > rule.max) return NextResponse.json({ error: `Arquivo maior que ${rule.max / 1024 / 1024}MB` }, { status: 400 });

  const dir = path.join(process.cwd(), 'public', 'uploads', 'site');
  await mkdir(dir, { recursive: true });
  const fileName = `${rule.prefix}-${randomUUID().slice(0, 8)}.${ext}`;
  await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/site/${fileName}` });
}
