'use client';

import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import Logo from './ui/Logo';
import WhatsappIcon from './ui/WhatsappIcon';
import { OPEN_CONSENT_EVENT } from './Analytics';

/** Formata "5592981168163" como "+55 92 98116-8163" — best-effort, só pra exibição. */
function formatWhatsapp(digits: string): string {
  const m = digits.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]}-${m[4]}` : digits;
}

// Linha do rodapé usada em todas as páginas: logo | e-mail, WhatsApp e LinkedIn | copyright.
export default function FooterBar() {
  const { t, lang } = useLang();
  const { brandName, contactEmail, linkedinUrl, whatsappNumber } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <div className="ctaf-bottom" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '28px' }}>
      <style>{`
        .ctaf-link { color: rgba(255,255,255,0.65); display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-size: 13px; transition: color 0.15s; }
        @media (hover: hover) and (pointer: fine) { .ctaf-link:hover { color: var(--color-primary); } }
        .ctaf-info { display: flex; align-items: center; justify-content: center; gap: 12px 24px; flex-wrap: wrap; }
        .ctaf-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px 24px; }
        @media (max-width: 1100px) { .ctaf-bottom { justify-content: center; text-align: center; } }
      `}</style>

      <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '26px', textDecoration: 'none' }}>
        <Logo variant="wordmarkWhite" height={26} alt={brandName} />
      </Link>

      <div className="ctaf-info">
        <a href={`mailto:${contactEmail}`} className="ctaf-link">
          <Mail size={16} />
          {contactEmail}
        </a>
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="ctaf-link">
          <WhatsappIcon size={16} />
          {formatWhatsapp(whatsappNumber)}
        </a>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="ctaf-link">
          <Linkedin size={16} strokeWidth={1.75} />
          LinkedIn
        </a>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: 0 }}>
        © {year} {brandName} · {t('footer.rights')} ·{' '}
        <Link href="/privacidade" style={{ color: 'inherit', textDecoration: 'underline' }}>
          {t('footer.privacy')}
        </Link>
        {' · '}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
          style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {lang === 'pt-BR' ? 'Preferências de cookies' : 'Cookie preferences'}
        </button>
      </p>
    </div>
  );
}
