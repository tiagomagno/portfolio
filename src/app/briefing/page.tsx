import { BriefingForm } from '@/components/briefing/BriefingForm';
import BriefingIntro from '@/components/briefing/BriefingIntro';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FadeIn from '@/components/ui/FadeIn';
import { Metadata } from 'next';
import { getSeoOverride, withSeoOverride } from '@/lib/seo';
import { getSiteSettings } from '@/data/siteSettings';

const DEFAULT_METADATA: Metadata = {
  title: 'Briefing - Tiago Magno',
  description: 'Inicie seu projeto com um briefing detalhado e personalizado.',
  alternates: { canonical: '/briefing' },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getSeoOverride('briefing');
  return withSeoOverride(DEFAULT_METADATA, override);
}

export default async function BriefingPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header />

      <main
        id="main-content"
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '72px', /* height of fixed desktop header */
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '720px',
            margin: '0 auto',
            padding: '48px 32px 80px',
          }}
        >
          <FadeIn delay={0.1}>
            <BriefingIntro />
          </FadeIn>

          {/* Form: sem card — flui direto no corpo da página */}
          <FadeIn delay={0.25}>
            <BriefingForm recipientEmail={settings.briefingFormRecipientEmail} />
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  );
}
