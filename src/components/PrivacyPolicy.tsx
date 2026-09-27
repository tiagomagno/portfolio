'use client';

import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SURFACE } from '@/lib/surfaces';

// A estrutura (quantos parágrafos e itens cada bloco tem) é fixa aqui; os textos vêm das chaves
// privacy.<bloco>.heading / .p1.. / .i1.. de translations.ts, editáveis em /admin/pages/privacy.
const BLOCKS = [
  { id: 'controller', paragraphs: 1, items: 0 },
  { id: 'data', paragraphs: 1, items: 2 },
  { id: 'purpose', paragraphs: 1, items: 0 },
  { id: 'processors', paragraphs: 2, items: 0 },
  { id: 'retention', paragraphs: 1, items: 0 },
  { id: 'cookies', paragraphs: 1, items: 0 },
  { id: 'rights', paragraphs: 1, items: 5 },
  { id: 'exercise', paragraphs: 1, items: 0 },
  { id: 'changes', paragraphs: 1, items: 0 },
];

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export default function PrivacyPolicy() {
  const { t } = useLang();
  const { contactEmail } = useSiteSettings();
  const text = (key: string) => t(key).replace('{email}', contactEmail);

  return (
    <section style={{ background: SURFACE.base, padding: 'calc(var(--section-pad-y) + 72px) 0 var(--section-pad-y)' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ maxWidth: '760px' }}>
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
            {t('privacy.eyebrow')}
          </span>
          <h1 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, margin: '0 0 12px' }}>
            {t('privacy.title')}
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)', margin: '0 0 48px' }}>{t('privacy.updated')}</p>

          {BLOCKS.map((block) => (
            <div key={block.id} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', letterSpacing: 0, margin: '0 0 12px' }}>
                {t(`privacy.${block.id}.heading`)}
              </h2>
              {range(block.paragraphs).map((n) => (
                <p key={n} style={{ fontSize: 'var(--fs-body-lg)', lineHeight: 1.7, color: 'rgba(26,26,26,1)', margin: '0 0 12px' }}>
                  {text(`privacy.${block.id}.p${n}`)}
                </p>
              ))}
              {block.items > 0 && (
                <ul style={{ margin: '0 0 12px', paddingLeft: '20px' }}>
                  {range(block.items).map((n) => (
                    <li key={n} style={{ fontSize: 'var(--fs-body-lg)', lineHeight: 1.7, color: 'rgba(26,26,26,1)', marginBottom: '6px' }}>
                      {text(`privacy.${block.id}.i${n}`)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
