'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';
import { ArrowRight } from 'lucide-react';

export default function Work() {
  const { t } = useLang();

  const servicesList = [
    { title: t('work.svc1.title'), label: t('work.svc1.label') },
    { title: t('work.svc2.title'), label: t('work.svc2.label') },
    { title: t('work.svc3.title'), label: t('work.svc3.label') },
    { title: t('work.svc4.title'), label: t('work.svc4.label') },
  ];

  return (
    <section id="work" style={{ background: SURFACE.base, padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .work-section-grid {
            display: grid;
            grid-template-columns: 0.85fr 1.15fr;
            grid-template-areas: "text cards" "cta cards";
            gap: 0 56px;
            align-items: start;
          }
          .work-text { grid-area: text; }
          .work-cta-wrap { grid-area: cta; }
          .work-cards-grid {
            grid-area: cards;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          @media (max-width: 900px) {
            .work-section-grid {
              grid-template-columns: 1fr;
              /* Botão de CTA por último, depois dos cards de serviço, em telas estreitas. */
              grid-template-areas: "text" "cards" "cta";
              gap: 32px;
            }
            .work-cta-wrap { margin-top: 0 !important; }
          }
          @media (max-width: 500px) {
            .work-cards-grid { grid-template-columns: 1fr; }
            .service-card { min-height: 0 !important; }
            .work-cta-button { width: 100% !important; justify-content: center !important; }
          }
          .service-card {
            transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          }
          .service-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 14px 28px rgba(0,0,0,0.1);
            border-color: rgba(26,26,26,0.3);
          }
        `}</style>

        <div className="work-section-grid">
          {/* Left column: text */}
          <FadeIn delay={0.1} direction="up" className="work-text">
            <span
              style={{
                fontSize: 'var(--fs-eyebrow)',
                fontWeight: 700,
                color: 'var(--color-primary-text)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '14px',
              }}
            >
              {t('work.eyebrow')}
            </span>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: '#1a1a1a',
                lineHeight: 1.15,
                margin: '0 0 16px',
              }}
            >
              {t('work.title')}
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'rgba(26,26,26,1)', lineHeight: 1.7, margin: 0, maxWidth: '420px' }}>
              {t('work.subtitle')}
            </p>
          </FadeIn>

          {/* CTA button — próprio bloco pra poder ir para o final da seção em mobile */}
          <FadeIn delay={0.15} direction="up" className="work-cta-wrap" style={{ marginTop: '28px' }}>
            <a
              href="/briefing"
              className="work-cta-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'var(--color-primary-text)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                padding: '14px 28px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              {t('nav.startProject')}
              <ArrowRight size={16} />
            </a>
          </FadeIn>

          {/* Right column: cards grid */}
          <div className="work-cards-grid">
            {servicesList.map((item, i) => (
              <FadeIn key={item.title} delay={0.15 + i * 0.05} style={{ height: '100%' }}>
                <Link href="/briefing" style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                  <div
                    className="service-card"
                    style={{
                      position: 'relative',
                      background: SURFACE.raised,
                      border: '1px solid var(--color-border)',
                      borderRadius: '16px',
                      padding: '28px 24px',
                      height: '100%',
                      minHeight: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        margin: '0 8px 8px 0',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.6,
                        color: 'rgba(26,26,26,0.62)',
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
