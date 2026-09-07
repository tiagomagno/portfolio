'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

export default function Insights() {
  const { t } = useLang();

  const INSIGHTS = [
    {
      tag: t('insights.post1.tag'),
      readTime: '5 min',
      title: t('insights.post1.title'),
      desc: t('insights.post1.desc'),
    },
    {
      tag: t('insights.post2.tag'),
      readTime: '7 min',
      title: t('insights.post2.title'),
      desc: t('insights.post2.desc'),
    },
  ];

  return (
    <section id="insights" style={{ background: '#0e0e0e', padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'min(85vw, 1320px)', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <FadeIn delay={0.1}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '16px',
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
              {t('insights.eyebrow')}
            </span>
            <h2
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 900,
                color: '#fff',
                margin: 0,
                lineHeight: 1,
              }}
            >
              INSIGHTS
            </h2>
          </div>
          <a
            href="#"
            style={{ fontSize: '14px', fontWeight: 700, color: '#a8a29e', textDecoration: 'none' }}
          >
            {t('insights.viewAll')}
          </a>
        </div>
        </FadeIn>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {INSIGHTS.map((post, i) => (
            <FadeIn key={post.title} delay={0.2 + i * 0.1} direction="up" style={{ height: '100%' }}>
            <a
              href="#"
              style={{
                background: '#1c1b1b',
                border: '1px solid #2a2a2a',
                borderRadius: '20px',
                padding: '32px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#ff5625',
                    background: 'rgba(255,86,37,0.1)',
                    border: '1px solid rgba(255,86,37,0.2)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                  }}
                >
                  {post.tag}
                </span>
                <span style={{ fontSize: '12px', color: '#a8a29e' }}>{post.readTime} {t('insights.readSuffix')}</span>
              </div>
              <h3
                style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 12px', lineHeight: 1.4 }}
              >
                {post.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#a8a29e', lineHeight: 1.7, margin: '0 0 20px', flex: 1 }}>
                {post.desc}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#ff5625',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {t('insights.readArticle')}
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </div>
            </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

