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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  intro: Intro,
  positioning: Positioning,
  about: About,
  stats: Stats,
  work: Work,
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
  services: GRADIENT.ltr,
  aboutBento: GRADIENT.rtl,
  labs: GRADIENT.ltr,
  ctaFooter: GRADIENT.rtl,
};

const DEFAULT_ORDER = ['hero', 'cases', 'services', 'aboutBento', 'labs', 'ctaFooter'];

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
    const sections = await prisma.homeSection.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
    if (sections.length === 0) return DEFAULT_ORDER;
    // FAQ saiu da home (mudou pra página /consultoria) — filtra mesmo que ainda
    // esteja salva na ordem configurada em /admin/sections de alguma instalação antiga.
    return sections.map((s) => s.key).filter((key) => key in SECTION_COMPONENTS && key !== 'faq');
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
          return <div key={key} style={{ background: SECTION_GRADIENT[key] }}>{section}</div>;
        })}
      </main>
    </>
  );
}
