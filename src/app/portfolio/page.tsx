import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PortfolioHero from '@/components/PortfolioHero';
import PortfolioGrid from '@/components/PortfolioGrid';
import PortfolioCTA from '@/components/PortfolioCTA';
import { getVisibleCases } from '@/data/cases';
import { getSeoOverride, withSeoOverride } from '@/lib/seo';

const DEFAULT_METADATA: Metadata = {
  title: 'Portfólio - Tiago Magno',
  description: 'Uma seleção de trabalhos em UX/UI, produtos digitais, identidade visual e design systems ao longo de mais de 20 anos de carreira.',
  alternates: { canonical: '/portfolio' },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getSeoOverride('portfolio');
  return withSeoOverride(DEFAULT_METADATA, override);
}

// Reflete imagens atualizadas pelo admin (/admin/cases) sem precisar de novo deploy.
export const revalidate = 60;

export default async function PortfolioPage() {
  const items = await getVisibleCases();

  return (
    <>
      <Header />
      <main id="main-content">
        <PortfolioHero />
        <PortfolioGrid items={items} />
        <PortfolioCTA />
      </main>
      <Footer />
    </>
  );
}
