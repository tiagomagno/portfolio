import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Cases from '@/components/Cases';
import TalkCTA from '@/components/TalkCTA';
import Services from '@/components/Services';
import Consulting from '@/components/Consulting';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { getAllCaseAssetOverrides } from '@/data/caseAssets';

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  about: About,
  work: Work,
  experience: Experience,
  cases: Cases,
  talkCta: TalkCTA,
  services: Services,
  consulting: Consulting,
  contact: Contact,
};

const DEFAULT_ORDER = ['hero', 'about', 'work', 'experience', 'cases', 'talkCta', 'services', 'consulting', 'contact'];

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
  const [order, overrides] = await Promise.all([getSectionOrder(), getAllCaseAssetOverrides()]);
  const overridesBySlug = Object.fromEntries(overrides);

  return (
    <>
      <Header />
      <main>
        {order.map((key) => {
          if (key === 'cases') return <Cases key={key} overrides={overridesBySlug} />;
          const Section = SECTION_COMPONENTS[key];
          return Section ? <Section key={key} /> : null;
        })}
      </main>
      <Footer />
    </>
  );
}
