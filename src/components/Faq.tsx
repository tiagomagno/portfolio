'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

export default function Faq() {
  const { t } = useLang();

  const items = QUESTION_KEYS.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));

  return (
    <section id="faq" style={{ background: SURFACE.base, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .faq-item {
            border-bottom: 1px solid var(--color-border);
          }
          .faq-item summary {
            list-style: none;
            cursor: pointer;
            padding: 24px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            font-family: var(--font-headline);
            font-weight: 700;
            font-size: 17px;
            color: var(--color-text);
          }
          .faq-item summary::-webkit-details-marker { display: none; }
          .faq-item .faq-icon {
            flex-shrink: 0;
            transition: transform 0.2s;
            color: var(--color-primary);
          }
          .faq-item[open] .faq-icon { transform: rotate(45deg); }
          .faq-item .faq-answer {
            padding: 0 0 24px;
            margin: 0;
            font-size: var(--fs-body-lg);
            line-height: 1.7;
            color: var(--color-text-muted);
            max-width: 720px;
          }
        `}</style>

        <FadeIn delay={0.1}>
          <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
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
              {t('faq.eyebrow')}
            </span>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.15, margin: '0 0 12px' }}>
              {t('faq.title')}
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              {t('faq.subtitle')}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div>
            {items.map((item, i) => (
              <details key={i} className="faq-item">
                <summary>
                  <span>{item.question}</span>
                  <span className="faq-icon material-symbols-outlined" aria-hidden="true">add</span>
                </summary>
                <p className="faq-answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </FadeIn>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: items.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
