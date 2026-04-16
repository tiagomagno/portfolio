'use client';

import { useLang } from '@/context/LangContext';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const navLinks = [
    { href: '/#about', label: t('nav.about') },
    { href: '/#services', label: t('nav.services') },
    { href: '/#work', label: t('nav.work') },
    { href: '/#cases', label: t('nav.cases') },
  ];

  const langs: { value: 'pt-BR' | 'en-US'; label: string }[] = [
    { value: 'pt-BR', label: 'PT' },
    { value: 'en-US', label: 'EN' },
  ];

  return (
    <>
      {/* ── Desktop Nav ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        className="hidden-mobile"
      >
        <div
          className="section-container"
          style={{
            maxWidth: '85vw',
            margin: '0 auto',
            padding: '0 24px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{
              color: 'var(--color-text)',
              fontWeight: 900,
              fontSize: '20px',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
          >
            TiagoMagno
          </a>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <style>{`.nav-link:hover { color: var(--color-text) !important; } .nav-cta:hover { background: var(--color-primary-hover) !important; }`}</style>
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link"
                style={{
                  color: 'var(--color-text-dim)',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                aria-label="Toggle Theme"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}

            <div
              style={{
                display: 'flex',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                padding: '4px',
              }}
            >
              {langs.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setLang(value)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: lang === value ? 'var(--color-primary)' : 'transparent',
                    color: lang === value ? '#fff' : 'var(--color-text-dim)',
                    transition: 'all 0.15s',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="/#contact"
                className="nav-link"
                style={{
                  color: 'var(--color-text)',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {t('nav.contactCTA')}
              </a>
              <a
                href="/briefing"
                className="nav-cta"
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >
                {t('nav.startProject')}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Top Bar ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        className="show-mobile"
      >
        <div
          style={{
            padding: '0 16px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Left: Hamburger + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setDrawerOpen((o) => !o)}
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {drawerOpen ? 'close' : 'menu'}
              </span>
            </button>
            <a
              href="/"
              style={{ color: 'var(--color-text)', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}
            >
              TM.
            </a>
          </div>

          {/* Right: Theme + Lang */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label="Toggle Theme"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}
            <div
              style={{
                display: 'flex',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                padding: '3px',
              }}
            >
              {langs.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setLang(value)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: lang === value ? 'var(--color-primary)' : 'transparent',
                    color: lang === value ? '#fff' : 'var(--color-text-dim)',
                    transition: 'all 0.15s',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Overlay ── */}
      {drawerOpen && (
        <div
          className="show-mobile"
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 190,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className="show-mobile"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 210,
          width: '75vw',
          maxWidth: '300px',
          background: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0 32px',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid var(--color-border)',
            flexShrink: 0,
          }}
        >
          <a
            href="/"
            onClick={() => setDrawerOpen(false)}
            style={{ color: 'var(--color-text)', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}
          >
            TM.
          </a>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              style={{
                color: 'var(--color-text)',
                fontSize: '17px',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '16px 20px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {label}
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-text-dim)' }}>
                chevron_right
              </span>
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
          <a
            href="/#contact"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              fontSize: '14px',
              fontWeight: 600,
              padding: '13px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              border: '1px solid var(--color-border)',
              background: 'transparent',
            }}
          >
            {t('nav.contactCTA')}
          </a>
          <a
            href="/briefing"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              padding: '13px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
            }}
          >
            {t('nav.startProject')}
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </a>
        </div>
      </div>

      {/* Responsive visibility styles */}
      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: block !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .show-mobile[style*="flex-direction: column"] { display: flex !important; }
        }
      `}</style>
    </>
  );
}

