import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Stats from '@/components/Stats';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Cases from '@/components/Cases';
import TalkCTA from '@/components/TalkCTA';
import Skills from '@/components/Skills';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Divider from '@/components/Divider';
import { prisma } from '@/lib/prisma';
import { getAllCaseAssetOverrides } from '@/data/caseAssets';
import { getHiddenPortfolioSlugs } from '@/data/portfolioVisibility';

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  about: About,
  stats: Stats,
  work: Work,
  experience: Experience,
  cases: Cases,
  talkCta: TalkCTA,
  skills: Skills,
  services: Services,
  contact: Contact,
};

const DEFAULT_ORDER = ['hero', 'about', 'stats', 'work', 'experience', 'cases', 'skills', 'services', 'talkCta', 'contact'];

// Reflete a ordem/visibilidade definida em /admin/sections sem precisar de novo deploy.
export const revalidate = 60;

async function getSectionOrder(): Promise<string[]> {
  try {
    const sections = await prisma.homeSection.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
    if (sections.length === 0) return DEFAULT_ORDER;
    return sections.map((s) => s.key).filter((key) => key in SECTION_COMPONENTS);
  } catch {
    return DEFAULT_ORDER;
  }
}

export default async function Home() {
  const [order, overrides, hiddenSlugs] = await Promise.all([
    getSectionOrder(),
    getAllCaseAssetOverrides(),
    getHiddenPortfolioSlugs(),
  ]);
  const overridesBySlug = Object.fromEntries(overrides);

  return (
    <>
      <Header />
      <main>
        {order.map((key, i) => {
          const section = key === 'cases'
            ? <Cases key={key} overrides={overridesBySlug} hiddenSlugs={[...hiddenSlugs]} />
            : (() => {
                const Section = SECTION_COMPONENTS[key];
                return Section ? <Section key={key} /> : null;
              })();
          if (!section) return null;
          return (
            <div key={key}>
              {i > 0 && <Divider />}
              {section}
            </div>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
