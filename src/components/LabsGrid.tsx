'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from './ui/FadeIn';
import PillTabs from './ui/PillTabs';
import type { LabItem } from '@/data/labs';
import { useLang } from '@/context/LangContext';


const matches = (item: LabItem, tab: string) =>
  tab === 'all' || (tab === 'live' ? item.status === 'MVP no ar' : item.status !== 'MVP no ar');

export default function LabsGrid({ items: allItems }: { items: LabItem[] }) {
  const { t } = useLang();
  const [tab, setTab] = useState('all');
  const TABS = [
    { id: 'all', label: t('labs.tab.all') },
    { id: 'live', label: t('labs.tab.live') },
    { id: 'proto', label: t('labs.tab.proto') },
  ];
  const items = allItems.filter((item) => matches(item, tab));

  return (
    <section id="lab" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 16px' }}>
              <span style={{ color: 'var(--color-primary-text)' }}>{t('labs.title.accent')}</span>
              {t('labs.title.rest').split('\n').map((line, i) => (i === 0 ? line : <span key={i}><br className="labs-br" />{line}</span>))}
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 auto', maxWidth: '520px' }}>
              {t('labs.subtitle')}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
            <PillTabs tabs={TABS} activeId={tab} onChange={setTab} layoutId="labs-tabs-indicator" />
          </div>
        </FadeIn>

        <style>{`
          .labs-bento { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
          .labs-bento > * { grid-column: span 6; }
          .labs-bento > *:nth-child(4n + 1), .labs-bento > *:nth-child(4n) { grid-column: span 7; }
          .labs-bento > *:nth-child(4n + 2), .labs-bento > *:nth-child(4n + 3) { grid-column: span 5; }
          @media (max-width: 800px) {
            .labs-bento > *, .labs-bento > *:nth-child(n) { grid-column: 1 / -1; }
          }
          .labs-bento-link { display: block; text-decoration: none; height: 100%; }
          .labs-card { min-height: 440px; }
          @media (max-width: 800px) { .labs-br { display: none; } }
          @media (max-width: 800px) { .labs-card { min-height: 240px; padding: 28px !important; } }
          @media (hover: hover) and (pointer: fine) { .labs-bento-link:hover .labs-card-cta { background: var(--color-primary-text-hover); border-color: transparent; } }
        `}</style>

        <div className="labs-bento">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={0.05 * i} style={{ height: '100%' }}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="labs-bento-link">
                  <LabCard item={item} />
                </a>
              ) : (
                <LabCard item={item} />
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabCard({ item }: { item: LabItem }) {
  const { t } = useLang();
  return (
    <div
      className="labs-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '28px',
        background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
        padding: '36px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', margin: '0 0 8px' }}>
        <h3 style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>{item.title}</h3>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--color-primary-text)',
            border: '1px solid rgba(255,86,37,0.45)',
            padding: '3px 9px',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
          }}
        >
          {item.status}
        </span>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0, maxWidth: '380px' }}>{item.tagline}</p>

      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={item.title} style={{ display: 'block', width: '100%', flex: 1, minHeight: '200px', objectFit: 'cover', borderRadius: '16px', marginTop: '24px' }} />
      )}

      {item.href && (
        <span
          className="labs-card-cta"
          style={{
            alignSelf: 'flex-start',
            marginTop: item.image ? '16px' : 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--color-text)',
            padding: '9px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          {t('labs.access')}
          <ArrowUpRight size={15} />
        </span>
      )}
    </div>
  );
}
