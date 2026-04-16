import { BriefingForm } from '@/components/briefing/BriefingForm';
import FadeIn from '@/components/ui/FadeIn';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Briefing - Tiago Magno',
  description: 'Inicie seu projeto com um briefing detalhado e personalizado.',
};

export default function BriefingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Header spacing */}
      <div style={{ height: '80px' }} />

      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          background: 'var(--color-primary)',
          opacity: 0.05,
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'var(--color-primary)',
          opacity: 0.05,
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px 120px', position: 'relative', zIndex: 1 }}>
        <FadeIn delay={0.1}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Vamos Começar
            </span>
            <h1
              className="font-title"
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 900,
                color: 'var(--color-text)',
                lineHeight: 1.1,
                marginBottom: '24px',
              }}
            >
              Conte-me sobre o seu{' '}<br className="hidden sm:block" />
              <span style={{ color: 'var(--color-primary)' }}>Desafio</span>
            </h1>
            <p style={{ fontSize: 'alertpx', color: '#a8a29e', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
              Este briefing nos ajudará a entender perfeitamente o cenário do seu produto ou serviço. Responda com calma, os detalhes preenchidos aqui serão a base da nossa estratégia.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div
            style={{
              background: '#1c1b1b', // Manter leve contraste contra o fundo principal
              border: '1px solid #2a2a2a',
              borderRadius: '24px',
              padding: 'clamp(24px, 4vw, 48px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            <BriefingForm />
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
