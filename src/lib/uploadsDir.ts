import path from 'path';

/** Pasta raiz dos uploads do admin. Em produção deve ser um volume persistente (ver Dockerfile). */
export const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads');
