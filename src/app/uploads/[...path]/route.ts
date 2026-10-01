import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { UPLOADS_ROOT } from '@/lib/uploadsDir';

// O Next em produção (standalone) só serve arquivos de public/ que existiam no boot do servidor,
// então imagens enviadas pelo admin depois disso davam 404. Esta rota as serve direto do disco.
const TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const filePath = path.join(UPLOADS_ROOT, ...segments);

  // Bloqueia path traversal (../) para fora da pasta de uploads.
  if (!filePath.startsWith(UPLOADS_ROOT + path.sep)) return new NextResponse('Not found', { status: 404 });

  const contentType = TYPES[path.extname(filePath).toLowerCase()];
  if (!contentType) return new NextResponse('Not found', { status: 404 });

  try {
    const file = await readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        // Nomes são UUIDs (imutáveis): cache longo é seguro.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
