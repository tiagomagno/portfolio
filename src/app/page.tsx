import Header from '@/components/Header';
import IntroSplash from '@/components/IntroSplash';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Positioning from '@/components/Positioning';
import About from '@/components/About';
import Stats from '@/components/Stats';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Cases from '@/components/Cases';
import LabsGrid from '@/components/LabsGrid';
import Profile from '@/components/Profile';
import AboutBento from '@/components/AboutBento';
import TalkCTA from '@/components/TalkCTA';
import Skills from '@/components/Skills';
import Services from '@/components/Services';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import CtaFooter from '@/components/CtaFooter';
import { prisma } from '@/lib/prisma';
import { getVisibleCases } from '@/data/cases';
import { getSiteSettings } from '@/data/siteSettings';
import { translations } from '@/lib/translations';
import { getLabItems } from '@/data/labs';
import { GRADIENT } from '@/lib/surfaces';
import { HOME_SECTION_KEYS, mergeSectionOrder } from '@/lib/homeSections';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  intro: Intro,
  positioning: Positioning,
  about: About,
  stats: Stats,
  work: Work,
  offer: Work,
  experience: Experience,
  cases: Cases,
  labs: LabsGrid,
  profile: Profile,
  aboutBento: AboutBento,
  talkCta: TalkCTA,
  skills: Skills,
  services: Services,
  faq: Faq,
  contact: Contact,
  ctaFooter: CtaFooter,
};

// Direção do gradiente de fundo das seções pretas (as demais têm fundo sólido próprio).
const SECTION_GRADIENT: Record<string, string> = {
  hero: GRADIENT.ltr,
  cases: GRADIENT.rtl,
  offer: GRADIENT.ltr,
  ctaFooter: GRADIENT.rtl,
};

// Seções com fundo sólido próprio (branco/laranja) em vez do gradiente preto; a classe de tema
// (globals.css) inverte as cores de texto dentro delas.
const SECTION_THEME: Record<string, { className: string; background: string }> = {
  services: { className: 'theme-light', background: '#ffffff' },
  aboutBento: { className: 'theme-light', background: '#ffffff' },
  labs: { className: 'theme-primary', background: 'var(--color-primary)' },
};

const DEFAULT_ORDER: string[] = [...HOME_SECTION_KEYS];

// Schema.org HowTo para a seção "Como trabalho" (AEO). Os passos vêm das mesmas chaves
// process.step* que a seção usa, já com as edições feitas em /admin (PageContent, versão PT).
async function getProcessHowToJsonLd() {
  const dict = translations['pt-BR'] as Record<string, string>;
  const overrides: Record<string, string> = {};
  try {
    const rows = await prisma.pageContent.findMany({ where: { key: { startsWith: 'process.step' } } });
    for (const row of rows) overrides[row.key] = row.valuePt;
  } catch {
    // sem banco: usa os textos padrão de translations.ts
  }
  const pick = (key: string) => overrides[key] || dict[key];
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como funciona o processo de design de produto do Tiago Magno',
    description: 'Do problema à solução, em quatro etapas.',
    step: [1, 2, 3, 4].map((n) => ({
      '@type': 'HowToStep',
      name: pick(`process.step${n}.title`),
      text: pick(`process.step${n}.desc`),
    })),
  };
}

// Reflete a ordem/visibilidade definida em /admin/sections sem precisar de novo deploy.
export const revalidate = 60;

async function getSectionOrder(): Promise<string[]> {
  try {
    const rows = await prisma.homeSection.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) return DEFAULT_ORDER;
    const hidden = new Set(rows.filter((r) => !r.visible).map((r) => r.key));
    // Só as seções do layout atual (HOME_SECTION_KEYS): linhas antigas do banco (intro, stats, faq...)
    // não renderizam. Seções novas, ainda sem linha no banco, entram no lugar padrão e visíveis.
    const known = new Set<string>(HOME_SECTION_KEYS);
    return mergeSectionOrder(rows.map((r) => r.key).filter((key) => known.has(key))).filter((key) => !hidden.has(key));
  } catch {
    return DEFAULT_ORDER;
  }
}

export default async function Home() {
  const [order, cases, settings, howTo, labItems] = await Promise.all([getSectionOrder(), getVisibleCases(), getSiteSettings(), getProcessHowToJsonLd(), getLabItems()]);

  return (
    <>
      <IntroSplash />
      <Header />
      <main id="main-content">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
        />
        {order.map((key) => {
          const section = key === 'cases'
            ? <Cases key={key} items={cases} />
            : key === 'labs'
            ? <LabsGrid key={key} items={labItems} />
            : key === 'contact'
            ? <Contact key={key} recipientEmail={settings.contactFormRecipientEmail} />
            : (() => {
                const Section = SECTION_COMPONENTS[key];
                return Section ? <Section key={key} /> : null;
              })();
          if (!section) return null;
          const theme = SECTION_THEME[key];
          return <div key={key} className={theme?.className} style={{ background: theme?.background ?? SECTION_GRADIENT[key] }}>{section}</div>;
        })}
      </main>
    </>
  );
}
