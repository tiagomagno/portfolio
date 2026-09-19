'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { SURFACE } from '@/lib/surfaces';

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: SURFACE.footer, padding: '32px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
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

          <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '20px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.9)' }}>
              Tiago Magno
            </span>
          </Link>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: 0 }}>
            © {year} Tiago Magno · {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
