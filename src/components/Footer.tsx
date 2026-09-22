'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SURFACE } from '@/lib/surfaces';
import { Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useLang();
  const { brandName, linkedinUrl, whatsappNumber } = useSiteSettings();
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
            .footer-social:hover { color: #fff !important; }
          `}</style>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '20px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.9)' }}>
              {brandName}
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="footer-social"
                style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', transition: 'color 0.15s' }}
              >
                <Linkedin size={18} strokeWidth={1.75} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="footer-social"
                style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', transition: 'color 0.15s' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.82L4.43 19.64L5.27 16.6L5.07 16.29C4.24 15 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.32 4.53 17.87 6.09C19.42 7.65 20.28 9.71 20.28 11.92C20.27 16.46 16.58 20.15 12.04 20.15ZM16.56 13.99C16.31 13.87 15.11 13.27 14.88 13.19C14.65 13.1 14.48 13.06 14.31 13.31C14.14 13.56 13.66 14.13 13.51 14.3C13.36 14.47 13.22 14.49 12.97 14.37C12.72 14.24 11.93 13.98 10.99 13.14C10.26 12.49 9.77 11.69 9.63 11.44C9.49 11.19 9.61 11.06 9.74 10.93C9.85 10.82 9.99 10.64 10.11 10.5C10.24 10.36 10.28 10.26 10.36 10.09C10.44 9.92 10.4 9.78 10.34 9.65C10.28 9.52 9.79 8.32 9.58 7.83C9.38 7.35 9.18 7.42 9.03 7.41C8.89 7.4 8.72 7.4 8.55 7.4C8.38 7.4 8.11 7.46 7.87 7.71C7.63 7.96 6.97 8.58 6.97 9.78C6.97 10.98 7.89 12.14 8.01 12.31C8.14 12.48 9.78 15.02 12.3 16.08C12.9 16.33 13.37 16.48 13.74 16.6C14.34 16.79 14.89 16.76 15.32 16.7C15.8 16.63 16.81 16.09 17.02 15.5C17.23 14.91 17.23 14.41 17.17 14.3C17.11 14.19 16.81 14.11 16.56 13.99Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: 0 }}>
              © {year} {brandName} · {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
