'use client';

import FadeIn from './ui/FadeIn';

const servicesList = [
  {
    category: 'Produtos Digitais',
    icon: 'web',
    title: 'Landing Pages',
    label: 'Sites institucionais e páginas estruturadas para alta conversão.',
  },
  {
    category: 'Produtos Digitais',
    icon: 'storefront',
    title: 'E-commerces',
    label: 'Lojas virtuais, portais e blogs corporativos integrados.',
  },
  {
    category: 'Produtos Digitais',
    icon: 'dashboard',
    title: 'Sistemas Web',
    label: 'Dashboards e painéis administrativos criados sob medida.',
  },

  {
    category: 'Produtos Digitais',
    icon: 'update',
    title: 'Manutenção',
    label: 'Evolução de sistemas contínua e desenvolvimento de novas features.',
  },
  {
    category: 'Consultoria UX/UI',
    icon: 'search_insights',
    title: 'UX Research',
    label: 'Diagnóstico e entendimento profundo das necessidades do usuário.',
  },
  {
    category: 'Consultoria UX/UI',
    icon: 'account_tree',
    title: 'Arquitetura da Informação',
    label: 'Criação de wireframes para o alinhamento de fluxos ideais.',
  },
  {
    category: 'Consultoria UX/UI',
    icon: 'design_services',
    title: 'Design de Interfaces (UI)',
    label: 'Telas de altíssima fidelidade prontas para a equipe de programação.',
  },
  {
    category: 'Consultoria UX/UI',
    icon: 'touch_app',
    title: 'Protótipos Navegáveis',
    label: 'Validação ágil e testes de usabilidade práticos de uso.',
  },
  {
    category: 'Consultoria UX/UI',
    icon: 'code_blocks',
    title: 'Design Systems',
    label: 'Criação, governança escalável e documentação técnica.',
  },
  {
    category: 'Consultoria UX/UI',
    icon: 'monitoring',
    title: 'Produto & Evolução',
    label: 'Acompanho a evolução do produto com base em dados, feedback e uso real, refinando continuamente a experiência.',
  }
];

export default function Work() {
  return (
    <section id="work" style={{ background: 'var(--color-bg-low)', padding: '120px 0' }}>
      <div className="work-container" style={{ margin: '0 auto' }}>
        <style>{`
          .work-container {
            width: 85%;
            padding: 0;
          }
          .service-card:hover {
            border-color: var(--color-primary) !important;
            transform: translateY(-4px);
          }
          @media (max-width: 768px) {
            .work-container {
              width: 100%;
              padding: 0 16px;
            }
          }
        `}</style>
        <FadeIn delay={0.1} direction="up">
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Como posso ajudar
            </span>
            <h2
              style={{
                fontSize: 'clamp(36px, 4vw, 52px)',
                fontWeight: 900,
                color: 'var(--color-text)',
                lineHeight: 1.1,
                margin: '0',
              }}
            >
              Atuação <span style={{ color: 'var(--color-primary)' }}>Profissional</span>
            </h2>
          </div>
        </FadeIn>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {servicesList.map((item, i) => (
            <FadeIn key={item.title} delay={0.2 + i * 0.05} direction="up" style={{ height: '100%' }}>
              <div
                className="service-card"
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  padding: '32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: 'var(--color-primary)', fontSize: '32px' }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em', 
                    background: 'var(--color-bg-high)', 
                    padding: '4px 10px', 
                    borderRadius: '999px',
                    color: 'var(--color-text-dim)'
                  }}>
                    {item.category}
                  </span>
                </div>
                <h4 style={{ color: 'var(--color-text)', fontSize: '18px', fontWeight: 700, margin: '0 0 12px' }}>
                  {item.title}
                </h4>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
