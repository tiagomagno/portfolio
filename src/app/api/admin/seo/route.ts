import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/** Defaults hardcoded hoje em cada page.tsx — usados quando não há override no banco. */
const SEO_DEFAULTS: Record<string, { label: string; titlePt: string; descriptionPt: string; keywordsPt: string }> = {
  home: {
    label: 'Home',
    titlePt: 'Tiago Magno - UX Designer Sênior | Product Design',
    descriptionPt:
      'Transformo interações complexas em experiências digitais eficientes, escaláveis e centradas no usuário, conectando estratégia, UX, tecnologia e dados.',
    keywordsPt: 'UX Designer, Product Designer, UX Design, Product Design, Design Thinking, UI Design, Design System',
  },
  portfolio: {
    label: 'Portfólio',
    titlePt: 'Portfólio - Tiago Magno',
    descriptionPt: 'Uma seleção de trabalhos em UX/UI, produtos digitais, identidade visual e design systems ao longo de mais de 20 anos de carreira.',
    keywordsPt: '',
  },
  briefing: {
    label: 'Briefing',
    titlePt: 'Briefing - Tiago Magno',
    descriptionPt: 'Inicie seu projeto com um briefing detalhado e personalizado.',
    keywordsPt: '',
  },
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  // Se a tabela SeoMeta ainda não existir neste banco (schema desatualizado), cai pros
  // defaults hardcoded em vez de derrubar a página inteira — só perde os overrides salvos.
  const rows = await prisma.seoMeta.findMany().catch((err) => {
    console.error('SeoMeta findMany falhou:', err);
    return [];
  });
  const byPage = new Map(rows.map((r) => [r.page, r]));

  const pages = Object.entries(SEO_DEFAULTS).map(([page, def]) => {
    const row = byPage.get(page);
    return {
      page,
      label: def.label,
      titlePt: row?.titlePt ?? def.titlePt,
      titleEn: row?.titleEn ?? '',
      descriptionPt: row?.descriptionPt ?? def.descriptionPt,
      descriptionEn: row?.descriptionEn ?? '',
      keywordsPt: row?.keywordsPt ?? def.keywordsPt,
      keywordsEn: row?.keywordsEn ?? '',
      ogImage: row?.ogImage ?? null,
      canonicalUrl: row?.canonicalUrl ?? '',
      noIndex: row?.noIndex ?? false,
    };
  });

  return NextResponse.json({ pages });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const { page, titlePt, titleEn, descriptionPt, descriptionEn, keywordsPt, keywordsEn, ogImage, canonicalUrl, noIndex } = body;

  if (!page || !SEO_DEFAULTS[page]) {
    return NextResponse.json({ error: 'Página inválida' }, { status: 400 });
  }

  const data = {
    titlePt: titlePt || null,
    titleEn: titleEn || null,
    descriptionPt: descriptionPt || null,
    descriptionEn: descriptionEn || null,
    keywordsPt: keywordsPt || null,
    keywordsEn: keywordsEn || null,
    ogImage: ogImage || null,
    canonicalUrl: canonicalUrl || null,
    noIndex: Boolean(noIndex),
  };

  await prisma.seoMeta.upsert({
    where: { page },
    update: data,
    create: { page, ...data },
  });

  return NextResponse.json({ ok: true });
}
