import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Consulting from '@/components/Consulting';
import { getSeoOverride, withSeoOverride } from '@/lib/seo';

const DEFAULT_METADATA: Metadata = {
  title: 'Consultoria - Tiago Magno',
  description: 'Consultoria PJ em UX/UI e Product Design: diagnóstico, execução e evolução contínua, integrado ao seu time.',
  alternates: { canonical: '/consultoria' },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getSeoOverride('consultoria');
  return withSeoOverride(DEFAULT_METADATA, override);
}

export default function ConsultoriaPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Consulting />
      </main>
      <Footer />
    </>
  );
}
