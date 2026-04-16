import { BriefingForm } from '@/components/briefing/BriefingForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FadeIn from '@/components/ui/FadeIn';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Briefing - Tiago Magno',
  description: 'Inicie seu projeto com um briefing detalhado e personalizado.',
};

export default function BriefingPage() {
  return (
    <>
      <Header />

      <main
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '72px', /* height of fixed desktop header */
        }}
      >
        {/* Glow top-right */}
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            opacity: 0.08,
            filter: 'blur(120px)',
            zIndex: 0,
          }}
        />
        {/* Glow bottom-left */}
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            opacity: 0.06,
            filter: 'blur(120px)',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '720px',
            margin: '0 auto',
            padding: '48px 32px 80px',
          }}
        >
          {/* Header text */}
          <FadeIn delay={0.1}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--color-primary)',
                }}
              >
                Vamos Começar
              </span>
              <h1
                style={{
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontWeight: 900,
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                  marginBottom: '16px',
                }}
              >
                Conte-me sobre o seu{' '}
                <span style={{ color: 'var(--color-primary)' }}>Desafio</span>
              </h1>
              <p
                style={{
                  fontSize: 'clamp(14px, 2vw, 17px)',
                  color: 'var(--color-text-dim)',
                  lineHeight: 1.7,
                  maxWidth: '560px',
                  margin: '0 auto',
                }}
              >
                Este briefing nos ajudará a entender perfeitamente o cenário do seu produto ou
                serviço. Responda com calma, os detalhes preenchidos aqui serão a base da nossa
                estratégia.
              </p>
            </div>
          </FadeIn>

          {/* Form card */}
          <FadeIn delay={0.25}>
            <div
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.28)',
              }}
            >
              <BriefingForm />
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  );
}
