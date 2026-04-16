'use client';

import FadeIn from './ui/FadeIn';

const S = {
  section: (bg: string) => ({
    background: bg,
    padding: '96px 0',
  }),
  container: {
    maxWidth: '85vw',
    margin: '0 auto',
    padding: '0 24px',
  },
  label: {
    fontSize: 'var(--fs-eyebrow)',
    fontWeight: 700,
    color: '#ff5625',
    letterSpacing: 'var(--ls-eyebrow)',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '12px',
  },
  h2: {
    fontSize: 'var(--fs-h2)',
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1.1,
    margin: '0 0 24px',
  },
  body: {
    fontSize: 'var(--fs-body-lg)',
    color: '#a8a29e',
    lineHeight: 1.7,
  },
};

export default function About() {
  const stats = [
    { title: 'Atuação', text: 'Da interface ao produto, conectando estratégia, design e tecnologia.' },
    { title: 'Especialidades', text: 'UX/UI Design, arquitetura de informação, prototipação e validação.' },
    { title: 'Forma de trabalho', text: 'Processo orientado por contexto, uso real e tomada de decisão consciente.' },
    { title: 'Abordagem', text: 'Equilíbrio entre negócio, viabilidade técnica e experiência do usuário.' },
    { title: 'Entrega', text: 'Soluções consistentes, pensadas para evoluir e escalar.' },
  ];

  return (
    <section id="about" style={S.section('#131313')}>
      <div className="section-container" style={S.container}>
        {/* Grid: Heading + Text */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px',
            marginBottom: '64px',
            alignItems: 'start',
          }}
        >
          <FadeIn delay={0.1}>
          <div>
            <h2 style={{ ...S.h2 }}>
              Acredito no <span style={{ color: '#ff5625' }}>Design Estratégico</span> como fator
              viabilizador de negócios e na <span style={{ color: '#ff5625' }}>Experiência do Usuário</span>{' '}
              como o maior ativo de uma marca moderna.
            </h2>
          </div>
          </FadeIn>
          <FadeIn delay={0.2}>
          <div>
            <p style={{ ...S.body, marginBottom: '16px' }}>
              Minha jornada no design digital começou em 2004, e desde então venho evoluindo continuamente entre interface, experiência do usuário e produto.
            </p>
            <p style={{ ...S.body, marginBottom: '16px' }}>
              Hoje, atuo como elo entre negócio, tecnologia e usuário. Mais do que criar interfaces visualmente bem resolvidas, meu foco é estruturar produtos que façam sentido estratégico, sejam tecnicamente viáveis e — acima de tudo — que as pessoas realmente queiram usar.
            </p>
            <p style={{ ...S.body, marginBottom: '16px' }}>
              Ao longo dessa trajetória, ampliei minha atuação para além do visual, incorporando UX, pesquisa, validação e pensamento de produto. Já trabalhei como freelancer, liderei projetos e atuei em ambientes corporativos, sempre com foco em resolver problemas reais.
            </p>
            <p style={S.body}>
              Cada decisão de design é orientada por contexto, uso e objetivo. O resultado são produtos mais consistentes, que evoluem com clareza e sustentam crescimento.
            </p>
          </div>
          </FadeIn>
        </div>

        {/* Stats grid */}
        <div
          className="about-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {stats.map(({ title, text }, i) => (
            <FadeIn key={title} delay={0.3 + i * 0.1} style={{ height: '100%' }}>
            <div
              className="stat-card"
              style={{
                background: '#1c1b1b',
                border: '1px solid #2a2a2a',
                borderRadius: '16px',
                padding: '28px',
                height: '100%',
              }}
            >
              <span
                className="stat-title"
                style={{ fontSize: 'var(--fs-card-title)', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '12px' }}
              >
                {title}
              </span>
              <span className="stat-text" style={{ fontSize: 'var(--fs-body)', color: '#a8a29e', lineHeight: 1.5 }}>{text}</span>
            </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

