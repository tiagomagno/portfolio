import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_MENU_ITEMS = [
  { labelPt: 'Início', labelEn: 'Home', href: '/' },
  { labelPt: 'Portfólio', labelEn: 'Portfolio', href: '/#cases' },
  { labelPt: 'Processo', labelEn: 'Process', href: '/#services' },
  { labelPt: 'Sobre', labelEn: 'About', href: '/#about' },
  { labelPt: 'Consultoria', labelEn: 'Consulting', href: '/consultoria' },
  { labelPt: 'Contato', labelEn: 'Contact', href: '/#contact' },
];

const DEFAULT_HOME_SECTIONS = [
  { key: 'hero', label: 'Hero (topo)' },
  { key: 'intro', label: 'Introdução' },
  { key: 'work', label: 'O que faço' },
  { key: 'cases', label: 'Cases em Destaque' },
  { key: 'aboutBento', label: 'Sobre (bento)' },
  { key: 'profile', label: 'Sobre + Qualidades', visible: false },
  { key: 'labs', label: 'Lab' },
  { key: 'services', label: 'Como trabalho' },
  { key: 'positioning', label: 'Posicionamento' },
  { key: 'about', label: 'Sobre' },
  { key: 'stats', label: 'Números' },
  { key: 'experience', label: 'Trajetória' },
  { key: 'skills', label: 'Competências' },
  { key: 'talkCta', label: 'CTA — Vamos Conversar' },
  { key: 'ctaFooter', label: 'CTA + Rodapé' },
  { key: 'contact', label: 'Contato' },
];

async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL || 'admin@tiagomagno.com.br').toLowerCase().trim();
  const password = process.env.ADMIN_SEED_PASSWORD || 'troque-esta-senha';

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({ data: { email, passwordHash } });
    console.log(`Admin criado: ${email}`);
  } else {
    console.log(`Admin já existe: ${email}`);
  }

  const menuCount = await prisma.menuItem.count();
  if (menuCount === 0) {
    for (let i = 0; i < DEFAULT_MENU_ITEMS.length; i++) {
      await prisma.menuItem.create({ data: { ...DEFAULT_MENU_ITEMS[i], order: i } });
    }
    console.log(`${DEFAULT_MENU_ITEMS.length} itens de menu criados`);
  }

  for (let i = 0; i < DEFAULT_HOME_SECTIONS.length; i++) {
    const s = DEFAULT_HOME_SECTIONS[i];
    await prisma.homeSection.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, label: s.label, order: i, visible: s.visible ?? true },
    });
  }
  console.log(`${DEFAULT_HOME_SECTIONS.length} seções da home seedadas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
