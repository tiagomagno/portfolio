'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from './ui/FadeIn';
import PillTabs from './ui/PillTabs';
import type { LabItem } from '@/data/labs';
import { useLang } from '@/context/LangContext';


// Os filtros (Todos / No ar / Protótipos) só voltam quando houver mais projetos que isso — com poucos,
// só ocupam espaço.
const FILTERS_MIN_ITEMS = 5;

const matches = (item: LabItem, tab: string) =>
  tab === 'all' || (tab === 'live' ? item.status === 'MVP no ar' : item.status !== 'MVP no ar');

export default function LabsGrid({ items: allItems, cardClass }: { items: LabItem[]; cardClass?: string }) {
  const { t } = useLang();
  const [tab, setTab] = useState('all');
  const TABS = [
    { id: 'all', label: t('labs.tab.all') },
    { id: 'live', label: t('labs.tab.live') },
    { id: 'proto', label: t('labs.tab.proto') },
  ];
  const showFilters = allItems.length >= FILTERS_MIN_ITEMS;
  const items = showFilters ? allItems.filter((item) => matches(item, tab)) : allItems;

  return (
    <section id="lab" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <div className="section-head">
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.05, margin: 0 }}>
              <span style={{ color: 'var(--color-accent-text, var(--color-primary-text))' }}>{t('labs.title.accent')}</span>
              {t('labs.title.rest').split('\n').join(' ')}
            </h2>
            <div className="section-head-aside">
              <p>{t('labs.subtitle')}</p>
            </div>
          </div>
          {showFilters && (
            <div style={{ display: 'flex', marginBottom: '32px', ['--pill-bg' as string]: 'rgba(0,0,0,0.14)', ['--pill-inactive-text' as string]: 'rgba(11,11,11,0.78)', ['--pill-hover-text' as string]: '#000000', ['--pill-active-bg' as string]: '#0b0b0b', ['--pill-active-text' as string]: '#ffffff' }}>
              <PillTabs tabs={TABS} activeId={tab} onChange={setTab} layoutId="labs-tabs-indicator" />
            </div>
          )}
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
          .labs-card { min-height: 470px; }
          .labs-frame { position: absolute; overflow: hidden; background: #f4f4f2; box-shadow: 0 30px 80px rgba(0,0,0,0.48); transition: transform 500ms cubic-bezier(.2,.8,.2,1); }
          .labs-frame img { display: block; width: 100%; object-fit: cover; }
          .labs-frame-browser { border: 1px solid rgba(255,255,255,0.18); border-radius: 15px 15px 0 0; }
          .labs-frame-browser img { height: calc(100% - 26px); object-position: top left; }
          .labs-frame-bar { height: 26px; display: flex; align-items: center; gap: 5px; padding: 0 9px; background: #e7e7e2; border-bottom: 1px solid #d6d7d1; }
          .labs-frame-bar i { width: 6px; height: 6px; border-radius: 50%; background: #bdbeb9; }
          .labs-frame-bar span { margin: auto; padding: 3px 23%; border-radius: 4px; color: #92948d; background: rgba(255,255,255,0.72); font-size: 6px; white-space: nowrap; }
          .labs-insight { position: absolute; z-index: 5; right: 39%; top: 47%; min-width: 168px; padding: 13px 15px; border: 1px solid rgba(255,255,255,0.46); border-radius: 13px; color: #162229; background: rgba(255,255,255,0.92); box-shadow: 0 18px 45px rgba(0,0,0,0.27); backdrop-filter: blur(14px); transform: rotate(-3deg); }
          .labs-insight span, .labs-insight b, .labs-insight small { display: block; }
          .labs-insight span { color: #7d8b91; font-size: 7px; }
          .labs-insight b { margin: 5px 0 4px; font-size: 11px; }
          .labs-insight small { color: #00aabd; font-size: 7px; font-weight: 700; }
          .labs-frame-phone { width: 205px; height: 440px; border: 5px solid #171b1e; border-radius: 34px; }
          .labs-frame-phone img { height: 100%; object-position: top center; }
          @media (hover: hover) and (pointer: fine) { .labs-card:hover .labs-frame { transform: translateY(-8px) rotate(0deg) !important; } }
          @media (max-width: 800px) { .labs-card { min-height: 520px; border-radius: 24px !important; } }
          @media (hover: hover) and (pointer: fine) { .labs-bento-link:hover .labs-card-cta { background: var(--color-primary-text-hover); border-color: transparent; } }
        `}</style>

        <div className="labs-bento">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={0.05 * i} style={{ height: '100%' }}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="labs-bento-link">
                  <LabCard item={item} index={i} cardClass={cardClass} />
                </a>
              ) : (
                <LabCard item={item} index={i} cardClass={cardClass} />
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Enquadramento do mockup por posição (os 4 estilos se repetem). */
const FRAMES = [
  { kind: 'browser', style: { right: '-3%', bottom: '-15%', width: '86%', height: '91%', transform: 'rotate(-1deg)' } },
  { kind: 'browser', style: { right: '3%', bottom: '-6%', width: '77%', height: '70%', transform: 'rotate(1.5deg)' } },
  { kind: 'phone', style: { right: '7%', top: '-2%', transform: 'rotate(-2deg)' } },
  { kind: 'browser', style: { right: '-3%', bottom: '-14%', width: '88%', height: '92%', transform: 'rotate(0.8deg)' } },
] as const;

const hostOf = (href: string) => {
  try { return new URL(href).host; } catch { return ''; }
};

function LabCard({ item, index, cardClass }: { item: LabItem; index: number; cardClass?: string }) {
  const { t } = useLang();
  const frame = FRAMES[index % FRAMES.length];
  return (
    <div
      className={`labs-card ${cardClass ?? 'theme-card-outline'}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        borderRadius: '30px',
        border: '1px solid var(--color-border)',
        background: 'radial-gradient(circle at 78% 84%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 42%), var(--color-bg-card)',
        boxShadow: 'inset 0 1px rgba(255,255,255,0.035)',
        height: '100%',
      }}
    >
      <div style={{ position: 'relative', zIndex: 20, padding: '2.35rem 2.35rem 0', maxWidth: '96%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 'clamp(1.45rem, 2.1vw, 1.8rem)', lineHeight: 1.1, fontWeight: 720, letterSpacing: '-0.035em', color: 'var(--color-text)', margin: 0 }}>{item.title}</h3>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 750,
              letterSpacing: '0.055em',
              textTransform: 'uppercase',
              lineHeight: 1,
              color: 'var(--color-primary-text)',
              border: '1px solid var(--color-primary-text)',
              padding: '6px 10px 5px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
            }}
          >
            {item.status}
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.55, letterSpacing: '-0.01em', margin: '0.9rem 0 0', maxWidth: '37rem' }}>{item.tagline}</p>
      </div>

      {item.image && (
        <div style={{ position: 'absolute', inset: '9.2rem 0 0' }}>
          {frame.kind === 'browser' ? (
            <div className="labs-frame labs-frame-browser" aria-hidden="true" style={frame.style}>
              <div className="labs-frame-bar">
                <i /><i /><i />
                <span>{hostOf(item.href)}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" />
            </div>
          ) : (
            <div className="labs-frame labs-frame-phone" aria-hidden="true" style={frame.style}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" />
            </div>
          )}
          {item.image && frame.kind === 'phone' && (
            <div className="labs-insight" aria-hidden="true">
              <span>{t('labs.insight.label')}</span>
              <b>{t('labs.insight.value')}</b>
              <small>{t('labs.insight.note')}</small>
            </div>
          )}
        </div>
      )}

      {item.href && (
        <span
          className="labs-card-cta"
          style={{
            position: 'absolute',
            zIndex: 20,
            left: '2.35rem',
            bottom: '2.2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#ffffff',
            padding: '0.7rem 1rem',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(9,9,8,0.42)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {t('labs.access')}
          <ArrowUpRight size={15} style={{ opacity: 0.6 }} />
        </span>
      )}
    </div>
  );
}
