'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import FadeIn from './ui/FadeIn';
import RevealHeading from './ui/RevealHeading';
import FooterBar from './FooterBar';
import WhatsappIcon from './ui/WhatsappIcon';
import { GRADIENT } from '@/lib/surfaces';

// CTA + rodapé numa seção só (home). Sem formulário: o contato é direto por WhatsApp
// (botão aqui + botão flutuante), e o e-mail/WhatsApp/LinkedIn ficam como links no rodapé.
// Também responde pelo âncora #contact do menu.
export default function CtaFooter() {
  const { t } = useLang();
  const { brandName, contactEmail, linkedinUrl, whatsappNumber } = useSiteSettings();
  const year = new Date().getFullYear();
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  return (
    <footer
      id="contact"
      style={{
        background: GRADIENT.rtl,
        padding: 'var(--section-pad-y) 0 32px',
      }}
    >
      <style>{`
        @media (max-width: 640px) { .ctaf-btns { flex-direction: column; } .ctaf-btns a { width: 100%; justify-content: center; } }
        @media (hover: hover) and (pointer: fine) { .ctaf-whatsapp:hover { background: #3be07b !important; } }
      `}</style>

      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1} direction="up">
          <div style={{ paddingBottom: '72px' }}>
            <RevealHeading style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.05, margin: '0 0 20px', textWrap: 'balance' }}>
              {t('work.cta.title')}
            </RevealHeading>
            <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 32px', maxWidth: '620px' }}>
              {t('work.cta.text')}
            </p>
            <div className="ctaf-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <a
                href="/briefing"
                data-track-location="cta_footer"
                className="cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-primary-text-hover)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  height: '52px',
                  boxSizing: 'border-box',
                  padding: '0 32px',
                  border: '1px solid transparent',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('nav.startProject')}
                <ArrowRight size={16} />
              </a>
              <a
                href={whatsappHref}
                data-track-location="cta_footer"
                target="_blank"
                rel="noopener noreferrer"
                className="ctaf-whatsapp"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#062b14',
                  fontSize: '14px',
                  fontWeight: 700,
                  height: '52px',
                  boxSizing: 'border-box',
                  padding: '0 32px',
                  border: '1px solid transparent',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <WhatsappIcon size={18} />
                {t('work.cta.button')}
              </a>
            </div>
          </div>
        </FadeIn>

        <FooterBar />
      </div>
    </footer>
  );
}
