import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PortfolioHero from '@/components/PortfolioHero';
import PortfolioGrid from '@/components/PortfolioGrid';
import PortfolioCTA from '@/components/PortfolioCTA';
import SectionDivider from '@/components/ui/SectionDivider';
import { SURFACE } from '@/lib/surfaces';

export const metadata: Metadata = {
  title: 'Portfólio - Tiago Magno',
  description: 'Uma seleção de trabalhos em UX/UI, produtos digitais, identidade visual e design systems ao longo de mais de 20 anos de carreira.',
};

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main>
        <PortfolioHero />
        <SectionDivider from={SURFACE.base} to={SURFACE.raised} />
        <PortfolioGrid />
        <PortfolioCTA />
        <SectionDivider from={SURFACE.base} to={SURFACE.footer} />
      </main>
      <Footer />
    </>
  );
}
