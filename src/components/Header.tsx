'use client';

import { useLang } from '@/context/LangContext';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#work', label: t('nav.work') },
    { href: '#cases', label: t('nav.cases') },
  ];

  const langs: { value: 'pt-BR' | 'en-US'; label: string }[] = [
    { value: 'pt-BR', label: 'PT' },
    { value: 'en-US', label: 'EN' },
  ];

  const mobileLinks = [
    { href: '#', icon: 'home', label: t('nav.home') },
    { href: '#services', icon: 'category', label: t('nav.services') },
    { href: '#cases', icon: 'view_cozy', label: t('nav.cases') },
    { href: '#contact', icon: 'mail', label: t('nav.contact') },
    { href: '/briefing', icon: 'description', label: 'Projeto' },
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
          style={{
            maxWidth: '1280px',
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
            href="#"
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
            {/* Theme Toggle */}
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

            {/* Language toggle */}
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
                href="#contact"
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
                Entre em contato
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
                Inicie um projeto
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
          zIndex: 100,
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        className="show-mobile"
      >
        <div
          style={{
            padding: '0 20px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a href="#" style={{ color: 'var(--color-text)', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}>
            {"TM."}
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
                aria-label="Toggle Theme"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
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
            <a
              href="#contact"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              {t('nav.contact')}
            </a>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        className="show-mobile"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '12px 8px 16px',
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          {mobileLinks.map(({ href, icon, label }) => (
            <a
              key={href + label}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--color-text-dim)',
                textDecoration: 'none',
                minWidth: '56px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Responsive visibility styles */}
      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: block !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}
