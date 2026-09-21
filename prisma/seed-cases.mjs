import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';

/**
 * Popula o model Case com os ~60 cases que existiam hardcoded em src/data/portfolio.ts
 * antes da migração pro banco (dados já resolvidos, incluindo os overrides de imagem/
 * visibilidade que estavam salvos em CaseAsset/PortfolioItemVisibility na época da
 * migração). Idempotente — usa upsert por slug, seguro rodar mais de uma vez.
 *
 * Rodar uma vez em cada ambiente que ainda não tem a tabela Case populada (produção,
 * homologação etc.), depois de `npx prisma db push`:
 *   node prisma/seed-cases.mjs
 */
const prisma = new PrismaClient();

const data = JSON.parse(await readFile(new URL('./cases-seed-data.json', import.meta.url), 'utf-8'));

let created = 0;
let skipped = 0;
for (const item of data) {
  const existing = await prisma.case.findUnique({ where: { slug: item.slug } });
  if (existing) {
    skipped++;
    continue;
  }
  await prisma.case.create({ data: item });
  created++;
}

console.log(`Cases: ${created} criados, ${skipped} já existiam (pulados).`);
await prisma.$disconnect();
