'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function Work() {
  const { t } = useLang();

  const servicesList = [
    { title: t('work.svc1.title'), label: t('work.svc1.label') },
    { title: t('work.svc2.title'), label: t('work.svc2.label') },
    { title: t('work.svc3.title'), label: t('work.svc3.label') },
    { title: t('work.svc4.title'), label: t('work.svc4.label') },
    { title: t('work.svc5.title'), label: t('work.svc5.label') },
    { title: t('work.svc6.title'), label: t('work.svc6.label') },
  ];

  return (
    <section id="work" style={{ background: SURFACE.base, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'min(85vw, 1320px)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .work-section-grid {
            display: grid;
            grid-template-columns: 0.85fr 1.15fr;
            gap: 56px;
            align-items: start;
          }
          .work-cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          @media (max-width: 900px) {
            .work-section-grid { grid-template-columns: 1fr; }
          }
          @media (max-width: 500px) {
            .work-cards-grid { grid-template-columns: 1fr; }
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
          {/* Left column */}
          <FadeIn delay={0.1} direction="up">
            <div
              style={{
                display: 'inline-block',
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(26,26,26,0.7)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {t('work.eyebrow')}
            </div>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: '#1a1a1a',
                lineHeight: 1.15,
                margin: '0 0 16px',
              }}
            >
              {t('work.title.p1')} <span>{t('work.title.highlight')}</span>
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'rgba(26,26,26,0.6)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: '420px' }}>
              {t('work.subtitle')}
            </p>
            <a
              href="/briefing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '14px 28px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              {t('nav.startProject')}
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
                    <div
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--color-bg-high)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'rgba(26,26,26,0.6)' }}>
                        north_east
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        margin: '0 8px 8px 0',
                        paddingRight: '40px',
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
