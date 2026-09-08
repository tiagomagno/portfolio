'use client';

import { useLang } from '@/context/LangContext';
import { useEffect, useState } from 'react';

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Header starts transparent; gains a background once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const defaultNavLinks = [
    { href: '/#about', label: t('nav.about') },
    { href: '/#work', label: t('nav.services') },
    { href: '/portfolio', label: t('nav.cases') },
    { href: '/#services', label: t('nav.process') },
    { href: '/#consulting', label: t('nav.consultoria') },
    { href: '/#contact', label: t('nav.contact') },
  ];

  // Menu editável pelo admin (/admin/menu). Sem itens no banco (ou banco fora do ar),
  // cai de volta pra lista fixa acima.
  const [customNav, setCustomNav] = useState<{ href: string; label: string }[] | null>(null);
  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          setCustomNav(data.items.map((i: { href: string; labelPt: string; labelEn: string }) => ({
            href: i.href,
            label: lang === 'en-US' ? i.labelEn : i.labelPt,
          })));
        }
      })
      .catch(() => {});
  }, [lang]);

  const navLinks = customNav ?? defaultNavLinks;

  const langs: { value: 'pt-BR' | 'en-US'; label: string }[] = [
    { value: 'pt-BR', label: 'PT' },
    { value: 'en-US', label: 'EN' },
  ];

  return (
    <>
      {/* ── Floating language switcher — lives on the page edge, not inside the header row ── */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          right: '14px',
          transform: 'translateY(-50%)',
          zIndex: 250,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {langs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setLang(value)}
            aria-label={label}
            aria-pressed={lang === value}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: lang === value ? 'var(--color-primary)' : 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: lang === value ? '#fff' : 'var(--color-text-dim)',
              fontSize: '9px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Desktop Nav ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          background: scrolled ? 'var(--color-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background 0.25s, border-color 0.25s',
        }}
        className="hidden-mobile"
      >
        <div
          className="section-container"
          style={{
            maxWidth: 'min(85vw, 1320px)',
            margin: '0 auto',
            padding: '0 24px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', height: '32px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '19px', letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
              Tiago Magno
            </span>
          </a>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <style>{`.nav-link:hover { color: var(--color-text) !important; } .nav-cta:hover { color: var(--color-primary-hover) !important; }`}</style>
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link"
                style={{
                  color: 'var(--color-text-dim)',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.15s',
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="/briefing"
              className="nav-cta"
              style={{
                color: 'var(--color-primary)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              {t('nav.startProject')}
            </a>
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
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          background: scrolled ? 'var(--color-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background 0.25s, border-color 0.25s',
        }}
        className="show-mobile"
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            boxSizing: 'border-box',
            padding: '0 16px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Hamburger (far left) */}
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
            aria-label={drawerOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {drawerOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Logo (centered) */}
          <a
            href="/"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              height: '22px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
              Tiago Magno
            </span>
          </a>

          {/* spacer to balance the hamburger on the left */}
          <div style={{ width: '44px', flexShrink: 0 }} />
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
          <a href="/" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', height: '20px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
              Tiago Magno
            </span>
          </a>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label={t('nav.closeMenu')}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
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

        {/* CTA */}
        <div style={{ padding: '16px 20px', flexShrink: 0 }}>
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
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '14px 20px',
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
