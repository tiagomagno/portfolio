// Sincroniza o banco com o layout atual do site (seções da Home e menu).
// Idempotente: pode rodar mais de uma vez. Não toca em textos, cases, leads nem usuários.
//   Produção (terminal do Coolify): node prisma/sync-home.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HOME = [
  { key: 'hero', label: 'Hero (topo)' },
  { key: 'cases', label: 'Cases em Destaque' },
  { key: 'services', label: 'Como trabalho' },
  { key: 'aboutBento', label: 'Sobre (bento)' },
  { key: 'labs', label: 'Lab' },
  { key: 'ctaFooter', label: 'CTA + Rodapé' },
];

async function main() {
  // Seções da Home: as atuais visíveis e na ordem; qualquer outra fica desativada (os componentes continuam no código).
  const keep = HOME.map((s) => s.key);
  for (let i = 0; i < HOME.length; i++) {
    const { key, label } = HOME[i];
    await prisma.homeSection.upsert({
      where: { key },
      update: { order: i, visible: true },
      create: { key, label, order: i, visible: true },
    });
  }
  const others = await prisma.homeSection.findMany({ where: { key: { notIn: keep } } });
  for (let i = 0; i < others.length; i++) {
    await prisma.homeSection.update({ where: { key: others[i].key }, data: { order: HOME.length + i, visible: false } });
  }

  // Menu: "Cases" aponta pra âncora da Home e "Início" vem primeiro.
  await prisma.menuItem.updateMany({ where: { href: '/portfolio' }, data: { href: '/#cases' } });
  const home = await prisma.menuItem.findFirst({ where: { href: '/' } });
  if (!home) {
    await prisma.menuItem.updateMany({ data: { order: { increment: 1 } } });
    await prisma.menuItem.create({ data: { labelPt: 'Início', labelEn: 'Home', href: '/', order: 0, visible: true } });
  }

  console.log('Home:', (await prisma.homeSection.findMany({ where: { visible: true }, orderBy: { order: 'asc' } })).map((s) => s.key).join(' → '));
  console.log('Menu:', (await prisma.menuItem.findMany({ where: { visible: true }, orderBy: { order: 'asc' } })).map((m) => m.labelPt).join(' | '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
