import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ConsultingServices from '@/components/ConsultingServices';
import ConsultingProcess from '@/components/ConsultingProcess';
import ConsultingImpact from '@/components/ConsultingImpact';
import { CasesAndAbout } from '@/components/ConsultingExtras';
import Faq from '@/components/Faq';
import CtaFooter from '@/components/CtaFooter';
import { GRADIENT } from '@/lib/surfaces';
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

// Página de venda da consultoria: hero → serviços → processo (detalhado) → impacto real
// → portfólio + sobre (lado a lado) → FAQ → CTA/rodapé da home.
export default function ConsultoriaPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div style={{ background: GRADIENT.ltr }}>
          <Hero variant="consulting" />
        </div>
        <div style={{ background: GRADIENT.rtl }}>
          <ConsultingServices />
        </div>
        <div style={{ background: GRADIENT.ltr }}>
          <ConsultingProcess />
        </div>
        <div style={{ background: GRADIENT.rtl }}>
          <ConsultingImpact />
        </div>
        <div style={{ background: GRADIENT.ltr }}>
          <CasesAndAbout />
        </div>
        <div style={{ background: GRADIENT.rtl }}>
          <Faq />
        </div>
        <CtaFooter />
      </main>
    </>
  );
}
