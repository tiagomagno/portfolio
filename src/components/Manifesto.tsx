'use client';

import FadeIn from './ui/FadeIn';

export default function Manifesto() {
  return (
    <section style={{ background: '#0e0e0e', padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: '85vw', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn delay={0.1}>
        <p
          style={{
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 300,
            color: '#a8a29e',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Acredito no{' '}
          <strong style={{ color: '#fff', fontWeight: 700 }}>Design Estratégico</strong> como fator
          viabilizador de negócios e na{' '}
          <strong style={{ color: '#fff', fontWeight: 700 }}>Experiência do Usuário</strong> como o
          maior ativo de uma marca moderna.
        </p>
        </FadeIn>

        <FadeIn delay={0.2}>
        <div style={{ marginTop: '40px' }}>
          <a
            href="#services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#ff5625',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Conheça minha metodologia
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>south</span>
          </a>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}

