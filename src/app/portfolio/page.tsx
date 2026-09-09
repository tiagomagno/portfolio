import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PortfolioHero from '@/components/PortfolioHero';
import PortfolioGrid from '@/components/PortfolioGrid';
import PortfolioCTA from '@/components/PortfolioCTA';
import SectionDivider from '@/components/ui/SectionDivider';
import { SURFACE } from '@/lib/surfaces';
import { getAllCaseAssetOverrides } from '@/data/caseAssets';
import { getSeoOverride, withSeoOverride } from '@/lib/seo';

const DEFAULT_METADATA: Metadata = {
  title: 'Portfólio - Tiago Magno',
  description: 'Uma seleção de trabalhos em UX/UI, produtos digitais, identidade visual e design systems ao longo de mais de 20 anos de carreira.',
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getSeoOverride('portfolio');
  return withSeoOverride(DEFAULT_METADATA, override);
}

// Reflete imagens atualizadas pelo admin (/admin/cases) sem precisar de novo deploy.
export const revalidate = 60;

export default async function PortfolioPage() {
  const overrides = await getAllCaseAssetOverrides();

  return (
    <>
      <Header />
      <main>
        <PortfolioHero />
        <SectionDivider from={SURFACE.base} to={SURFACE.raised} />
        <PortfolioGrid overrides={Object.fromEntries(overrides)} />
        <PortfolioCTA />
        <SectionDivider from={SURFACE.base} to={SURFACE.footer} />
      </main>
      <Footer />
    </>
  );
}
