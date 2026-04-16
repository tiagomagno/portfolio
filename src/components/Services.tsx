'use client';

import { useState } from 'react';
import FadeIn from './ui/FadeIn';

const SERVICES = [
  {
    id: 'discovery',
    label: 'Estratégia & Discovery',
    tags: ['Pesquisa', 'Benchmark', 'Visão de Produto'],
    desc: 'Estruturo o diagnóstico do produto com pesquisas qualitativas e quantitativas, benchmarks competitivos e workshops de alinhamento estratégico.',
    items: ['Entrevistas com Usuários', 'Jobs-to-be-Done', 'Mapa de Oportunidades', 'Visão de Produto'],
  },
  {
    id: 'ux',
    label: 'UX & Interface Design',
    tags: ['Wireframe', 'UI Design', 'Prototipagem'],
    desc: 'Projeto fluxos, wireframes e interfaces de alta fidelidade com foco em clareza, conversão e acessibilidade. Cada pixel tem intenção, cada interação tem propósito.',
    items: ['Arquitetura da Informação', 'Wireframes & Protótipos', 'Design Visual (UI)', 'Testes de Usabilidade'],
  },
  {
    id: 'systems',
    label: 'Design Systems',
    tags: ['Components', 'Tokens', 'Documentação'],
    desc: 'Construo sistemas de design escaláveis com tokens semânticos, biblioteca de componentes e documentação viva.',
    items: ['Design Tokens', 'Component Library', 'Guia de Uso', 'Handoff para Dev'],
  },
  {
    id: 'evolution',
    label: 'Produto & Evolução',
    tags: ['Growth', 'Dados', 'Produto'],
    desc: 'Acompanho a evolução do produto com base em dados, feedback e uso real, refinando continuamente a experiência. Trabalho na identificação de pontos de melhoria, garantindo que o produto continue escalando e respondendo aos objetivos do negócio.',
    items: ['Análise de Uso e Dados', 'Iteração de Experiência', 'Acompanhamento de Métricas', 'Priorização de Melhorias'],
  },
];

export default function Services() {
  const [active, setActive] = useState('discovery');
  const current = SERVICES.find((s) => s.id === active)!;

  return (
    <section id="services" style={{ background: '#131313', padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: '85vw', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <FadeIn delay={0.1}>
        <div style={{ marginBottom: '56px' }}>
          <span
            style={{
              fontSize: 'var(--fs-eyebrow)',
              fontWeight: 700,
              color: '#ff5625',
              letterSpacing: 'var(--ls-eyebrow)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            O que eu faço
          </span>
          <h2
            style={{
              fontSize: 'var(--fs-h2)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            Soluções <span style={{ color: '#ff5625' }}>sob medida</span>
          </h2>
          <p style={{ fontSize: 'var(--fs-body-lg)', color: '#a8a29e', lineHeight: 1.7, maxWidth: '480px' }}>
            Do modelo de negócio ao componente em produção. Atuo em todas as camadas do produto digital.
          </p>
        </div>
        </FadeIn>

        {/* Layout */}
        <style>{`
          @media (max-width: 767px) {
            .services-grid { grid-template-columns: 1fr !important; }
            .services-tabs { flex-direction: row !important; flex-wrap: wrap !important; gap: 8px !important; }
            .services-tabs button { width: auto !important; padding: 10px 16px !important; font-size: 13px !important; }
          }
        `}</style>
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          {/* Tabs */}
          <FadeIn delay={0.2} direction="right">
          <div className="services-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: 'var(--fs-btn)',
                  cursor: 'pointer',
                  border: active === s.id ? '1px solid rgba(255,86,37,0.3)' : '1px solid transparent',
                  background: active === s.id ? 'rgba(255,86,37,0.1)' : 'transparent',
                  color: active === s.id ? '#fff' : '#a8a29e',
                  transition: 'all 0.15s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          </FadeIn>

          {/* Content panel */}
          <FadeIn delay={0.3} direction="left" style={{ height: '100%' }}>
          <div
            style={{
              background: '#1c1b1b',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              padding: '36px',
              height: '100%',
            }}
          >
            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {current.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 'var(--fs-eyebrow)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--ls-eyebrow)',
                    color: '#ff5625',
                    background: 'rgba(255,86,37,0.1)',
                    border: '1px solid rgba(255,86,37,0.2)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <p style={{ fontSize: 'var(--fs-body-lg)', color: '#a8a29e', lineHeight: 1.7, marginBottom: '28px' }}>
              {current.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {current.items.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: '#10b981', fontSize: '18px', flexShrink: 0 }}
                  >
                    check_circle
                  </span>
                  <span style={{ color: '#fff', fontSize: 'var(--fs-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

