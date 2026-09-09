'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import PillTabs from './ui/PillTabs';
import { SURFACE } from '@/lib/surfaces';

const PILLARS = ['diagnostico', 'execucao', 'escala'] as const;
type Pillar = (typeof PILLARS)[number];

export default function Consulting() {
  const { t } = useLang();
  const [active, setActive] = useState<Pillar>('diagnostico');

  const tabs = PILLARS.map((id) => ({ id, label: t(`consulting.pillars.${id}.label`) }));

  return (
    <section id="consulting" style={{ background: SURFACE.raised, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <span
            style={{
              fontSize: 'var(--fs-eyebrow)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              letterSpacing: 'var(--ls-eyebrow)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '14px',
            }}
          >
            {t('consulting.eyebrow')}
          </span>
          <h2
            style={{
              fontSize: 'var(--fs-h2)',
              fontWeight: 900,
              color: '#1a1a1a',
              lineHeight: 1.1,
              margin: '0 0 20px',
              maxWidth: '640px',
            }}
          >
            {t('consulting.title.p1')}
            <br />
            <span>{t('consulting.title.highlight')}</span>
          </h2>
          <p
            style={{
              fontSize: 'var(--fs-body-lg)',
              lineHeight: 1.7,
              color: 'rgba(26,26,26,0.6)',
              maxWidth: '560px',
              margin: '0 0 48px',
            }}
          >
            {t('consulting.subtitle')}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PillTabs
              tabs={tabs}
              activeId={active}
              onChange={(id) => setActive(id as Pillar)}
              layoutId="consulting-pill-indicator"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '760px',
                minHeight: '240px',
                background: SURFACE.card,
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                padding: '36px 40px',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px' }}
                  className="consulting-content-grid"
                >
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>
                      {t(`consulting.pillars.${active}.title`)}
                    </h3>
                    <p style={{ fontSize: 'var(--fs-body)', lineHeight: 1.8, color: 'rgba(26,26,26,0.6)', margin: 0 }}>
                      {t(`consulting.pillars.${active}.desc`)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        style={{
                          background: '#ffffff',
                          borderLeft: '2px solid var(--color-primary)',
                          borderRadius: '0 10px 10px 0',
                          padding: '14px 18px',
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
                          {t(`consulting.pillars.${active}.item${n}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </FadeIn>

        <style>{`
          @media (max-width: 700px) {
            .consulting-content-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          }
        `}</style>

        <FadeIn delay={0.3}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a
              href="/briefing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '40px',
                background: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '15px 32px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              {t('consulting.cta')}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
