'use client';

import Link from 'next/link';
import { ArrowRight, LayoutGrid, Compass, Component, GraduationCap, type LucideIcon } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

const SERVICES: { n: number; Icon: LucideIcon }[] = [
  { n: 1, Icon: LayoutGrid },
  { n: 2, Icon: Compass },
  { n: 3, Icon: Component },
  { n: 4, Icon: GraduationCap },
];

export default function ConsultingServices() {
  const { t } = useLang();
  return (
    <section id="servicos" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <style>{`
        .csvc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .csvc-card { border: 1px solid rgba(255,255,255,0.06); border-radius: 28px; padding: 28px; background: transparent; }
        @media (max-width: 1024px) { .csvc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .csvc-grid { grid-template-columns: 1fr; } .csvc-cta a { width: 100%; justify-content: center; } }
      `}</style>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 12px' }}>{t('work.title')}</h2>
            <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>{t('consultingServices.subtitle')}</p>
          </div>
        </FadeIn>

        <div className="csvc-grid">
          {SERVICES.map(({ n, Icon }, i) => (
            <FadeIn key={n} delay={0.05 * i} style={{ height: '100%' }}>
              <div className="csvc-card" style={{ height: '100%' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Icon size={22} color="var(--color-text)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px' }}>{t(`consultingServices.s${n}.title`)}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>{t(`consultingServices.s${n}.text`)}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="csvc-cta" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
            <Link
              href="/briefing"
              className="cta-primary"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '52px', boxSizing: 'border-box', padding: '0 32px', borderRadius: '999px', background: 'var(--color-primary-text-hover)', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}
            >
              {t('nav.startProject')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
