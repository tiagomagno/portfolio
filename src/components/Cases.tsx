'use client';

import FadeIn from './ui/FadeIn';

const CASES = [
  {
    id: 1,
    client: 'Du Box',
    service: 'Produto Digital · App',
    tag: 'SAAS',
    desc: 'Redesenho do produto de gestão de boxes de crossfit, aumentando retenção em 40%.',
  },
  {
    id: 2,
    client: 'Hubmetro',
    service: 'UX Research · Design System',
    tag: 'MARTECH',
    desc: 'Construção do Design System e refatoração da jornada de onboarding da plataforma.',
  },
  {
    id: 3,
    client: 'SaaSMaster',
    service: 'Product Design · Frontend',
    tag: 'B2B SAAS',
    desc: 'Arquitetura de informação e implementação React de painel administrativo complexo.',
  },
];

export default function Cases() {
  return (
    <section id="cases" style={{ background: '#131313', padding: '96px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <FadeIn delay={0.1}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '24px',
            marginBottom: '48px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#ff5625',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Trabalho selecionado
            </span>
            <h2
              style={{
                fontSize: 'clamp(36px, 4vw, 52px)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Impacto real<br />em projetos
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {['west', 'east'].map((icon) => (
              <button
                key={icon}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid #2a2a2a',
                  background: '#1c1b1b',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
              </button>
            ))}
          </div>
        </div>
        </FadeIn>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {CASES.map((c, i) => (
            <FadeIn key={c.id} delay={0.2 + i * 0.1} direction="up" style={{ height: '100%' }}>
            <a
              href="#"
              style={{
                background: '#1c1b1b',
                border: '1px solid #2a2a2a',
                borderRadius: '16px',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              {/* Image area */}
              <div
                style={{
                  background: '#0e0e0e',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '48px', color: '#2a2a2a' }}
                >
                  photo_camera
                </span>
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#ff5625',
                    background: 'rgba(255,86,37,0.1)',
                    border: '1px solid rgba(255,86,37,0.3)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}
                >
                  {c.tag}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                  {c.client}
                </h3>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#a8a29e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 12px',
                  }}
                >
                  {c.service}
                </p>
                <p style={{ fontSize: '14px', color: '#a8a29e', lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                  {c.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff5625', fontSize: '13px', fontWeight: 700 }}>
                  Ver case
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </div>
              </div>
            </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
