import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { getSession } from '@/lib/session';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const WEBP_QUALITY = 80;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Arquivo maior que 8MB' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cases');
  await mkdir(uploadDir, { recursive: true });

  const originalBuffer = Buffer.from(await file.arrayBuffer());

  // GIFs animados perderiam a animação na conversão (sharp mantém só o 1º frame), então são salvos como estão.
  if (file.type === 'image/gif') {
    const fileName = `${randomUUID()}.gif`;
    await writeFile(path.join(uploadDir, fileName), originalBuffer);
    return NextResponse.json({ url: `/uploads/cases/${fileName}` });
  }

  const webpBuffer = await sharp(originalBuffer).webp({ quality: WEBP_QUALITY }).toBuffer();
  const fileName = `${randomUUID()}.webp`;
  await writeFile(path.join(uploadDir, fileName), webpBuffer);

  return NextResponse.json({ url: `/uploads/cases/${fileName}` });
}
