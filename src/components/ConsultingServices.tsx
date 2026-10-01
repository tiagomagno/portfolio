'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, LayoutGrid, Compass, Component, GraduationCap, type LucideIcon } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import RevealHeading from './ui/RevealHeading';

const SERVICES: { n: number; Icon: LucideIcon }[] = [
  { n: 1, Icon: LayoutGrid },
  { n: 2, Icon: Compass },
  { n: 3, Icon: Component },
  { n: 4, Icon: GraduationCap },
];

export default function ConsultingServices() {
  const { t } = useLang();
  return (
    <section id="servicos" style={{ background: 'transparent', padding: 'calc(var(--section-pad-y) * 1.3) 0' }}>
      <style>{`
        .csvc-row { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr); gap: 24px; align-items: stretch; }
        .csvc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .csvc-card { border: 1px solid var(--color-border-subtle); border-radius: 24px; padding: 20px 22px; background: transparent; text-align: left; }
        .csvc-visual { position: relative; height: 100%; min-height: 320px; border-radius: 24px; overflow: hidden; border: 1px solid var(--color-border-subtle); }
        @media (max-width: 1024px) { .csvc-row { grid-template-columns: 1fr; } .csvc-visual { min-height: 0; aspect-ratio: 16 / 9; } }
        @media (max-width: 560px) { .csvc-grid { grid-template-columns: 1fr; } .csvc-cta a { width: 100%; justify-content: center; } }
      `}</style>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <div className="section-head">
            <RevealHeading style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.05, margin: 0 }}>{t('work.title')}</RevealHeading>
            <div className="section-head-aside">
              <p>{t('consultingServices.subtitle')}</p>
            </div>
          </div>
        </FadeIn>

        <div className="csvc-row">
          <div>
          <div className="csvc-grid">
            {SERVICES.map(({ n, Icon }, i) => (
              <FadeIn key={n} delay={0.05 * i} style={{ height: '100%' }}>
                <div className="csvc-card hover-lift" style={{ height: '100%' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon size={20} color="var(--color-primary-text)" strokeWidth={1.75} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>{t(`consultingServices.s${n}.title`)}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>{t(`consultingServices.s${n}.text`)}</p>
                </div>
              </FadeIn>
            ))}
          </div>

            <FadeIn delay={0.2}>
              <div className="csvc-cta" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
                <Link
                  href="/briefing"
                  className="btn-outline-orange"
                >
                  {t('nav.startProject')}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} style={{ height: '100%' }}>
            <div className="csvc-visual">
              <Image src="/consultoria/discovery.webp" alt="Time de produto em uma sessão de descoberta, com jornadas e fluxos na mesa e na parede" fill sizes="(max-width: 1024px) 100vw, 40vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
