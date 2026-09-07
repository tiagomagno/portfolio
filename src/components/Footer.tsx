'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { SURFACE } from '@/lib/surfaces';

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: SURFACE.footer, padding: '32px 0' }}>
      <style>{`
        .footer-link:hover { color: #f5f3f0 !important; }
      `}</style>

      <div className="section-container" style={{ maxWidth: 'min(85vw, 1320px)', margin: '0 auto', padding: '0 24px' }}>
        <div
          className="footer-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <style>{`
            @media (max-width: 640px) {
              .footer-row { justify-content: center !important; text-align: center; }
            }
          `}</style>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '20px', textDecoration: 'none', opacity: 0.85 }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.01em', color: 'rgba(245,243,240,0.9)' }}>
              Tiago Magno
            </span>
          </Link>

          <p style={{ color: 'rgba(245,243,240,0.4)', fontSize: '12px', margin: 0 }}>
            © {year} Tiago Magno · {t('footer.rights')}
          </p>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a
              href="https://www.linkedin.com/in/tiagosmagno/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ color: 'rgba(245,243,240,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              LinkedIn
            </a>
            <a
              href="https://wa.me/5592981168163"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ color: 'rgba(245,243,240,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              WhatsApp
            </a>
            <a
              href="mailto:tiagosilvamagno@gmail.com"
              className="footer-link"
              style={{ color: 'rgba(245,243,240,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              E-mail
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
