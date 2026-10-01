'use client';

import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Download, Menu, X, ChevronRight, MoreVertical } from 'lucide-react';
import Logo from './ui/Logo';

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { brandName, resumeUrl } = useSiteSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('hero');
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // ── Gesto de fechar o drawer arrastando pra esquerda ──
  // Acompanha o dedo 1:1 (transform direto no elemento, sem re-render a cada move), resiste
  // com elástico se arrastar pro lado errado e, ao soltar, decide pela posição PROJETADA com a
  // velocidade (um "flick" curto basta) e anima o restante já na velocidade do dedo.
  const drawerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const [drawerCloseMs, setDrawerCloseMs] = useState(200);
  const drag = useRef({ id: -1, startX: 0, startY: 0, lastX: 0, lastT: 0, velocity: 0, axis: 'none' as 'none' | 'x' | 'y', dx: 0 });

  const handleDrawerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawerOpen || drag.current.id !== -1) return; // ignora dedos extras no meio do arrasto
    drag.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastT: e.timeStamp, velocity: 0, axis: 'none', dx: 0 };
  };

  const handleDrawerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = drawerRef.current;
    if (!el || e.pointerId !== d.id || d.axis === 'y') return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.axis === 'none') {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // histerese antes de escolher a direção
      if (Math.abs(dy) > Math.abs(dx)) {
        d.axis = 'y'; // rolagem vertical da lista: deixa o navegador cuidar
        return;
      }
      d.axis = 'x';
      d.startX += Math.sign(dx) * 10; // só o que passou da histerese conta, sem "pulo" e sem perder o movimento inicial
      el.setPointerCapture(e.pointerId);
      el.style.transition = 'none';
      if (scrimRef.current) scrimRef.current.style.transition = 'none';
    }
    const width = el.offsetWidth;
    const pull = e.clientX - d.startX;
    // Pra esquerda segue o dedo; pra direita (fora do limite) resiste progressivamente.
    const offset = pull <= 0 ? pull : (pull * width * 0.55) / (width + 0.55 * pull);
    d.dx = offset;
    el.style.transform = `translateX(${offset}px)`;
    if (scrimRef.current) scrimRef.current.style.opacity = String(1 - Math.min(Math.max(-offset / width, 0), 1));
    const dt = e.timeStamp - d.lastT;
    if (dt > 4) {
      d.velocity = (e.clientX - d.lastX) / dt; // px/ms
      d.lastT = e.timeStamp;
      d.lastX = e.clientX;
    }
  };

  const finishDrawerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (e.pointerId !== d.id) return;
    drag.current = { ...d, id: -1 };
    const el = drawerRef.current;
    if (!el || d.axis !== 'x') return;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

    const width = el.offsetWidth;
    const velocity = e.timeStamp - d.lastT > 100 ? 0 : d.velocity; // dedo parado antes de soltar = sem inércia
    const projected = d.dx + velocity * 499; // projeção de momento (desaceleração 0.998, como o scroll do iOS)
    const shouldClose = projected < -width * 0.5;
    const target = shouldClose ? -width : 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = reduceMotion ? 0 : Math.round(Math.min(Math.max(Math.abs(target - d.dx) / Math.max(Math.abs(velocity), 0.5), 150), 320));
    const transition = `${ms}ms var(--ease-out)`;
    el.style.transition = `transform ${transition}`;
    if (scrimRef.current) scrimRef.current.style.transition = `opacity ${transition}`;

    if (shouldClose) {
      setDrawerCloseMs(ms);
      setDrawerOpen(false);
    } else {
      el.style.transform = 'translateX(0)';
      if (scrimRef.current) scrimRef.current.style.opacity = '1';
    }
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Gestão de foco do drawer (WCAG 2.4.3 / 2.4.11): ao abrir, move o foco pro
  // primeiro item interativo; ao fechar, devolve pro botão que abriu o menu.
  useEffect(() => {
    if (drawerOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      hamburgerRef.current?.focus();
    }
  }, [drawerOpen]);

  // Fecha com Esc — o drawer se comporta como um diálogo modal na navegação por teclado.
  useEffect(() => {
    if (!drawerOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Header starts transparent; gains a background once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Item ativo do menu: na home, a seção mais próxima do topo; nas demais páginas, a rota atual.
  useEffect(() => {
    if (pathname !== '/') return;
    const ids = ['hero', 'cases', 'services', 'about', 'contact'];
    const update = () => {
      let current = 'hero';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
      setActiveSection(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' && activeSection === 'hero'
    : href === '/#cases' ? pathname.startsWith('/portfolio') || (pathname === '/' && activeSection === 'cases')
    : href.startsWith('/#') ? pathname === '/' && activeSection === href.slice(2)
    : pathname === href;

  const cvLabel = lang === 'en-US' ? 'Download résumé' : 'Baixar currículo';

  const defaultNavLinks = [
    { href: '/', label: lang === 'en-US' ? 'Home' : 'Início' },
    { href: '/#about', label: t('nav.about') },
    { href: '/#cases', label: t('nav.cases') },
    { href: '/consultoria', label: t('nav.consultoria') },
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
      {/* ── Skip link — invisível até receber foco por teclado (WCAG 2.4.1) ── */}
      <a href="#main-content" className="skip-link">
        {t('nav.skipToContent')}
      </a>

      {/* ── Floating language switcher — lives on the page edge, not inside the header row.
          Em mobile some daqui: vira uma opção no menu de 3 pontinhos da barra superior. ── */}
      <style>{`
        @media (max-width: 1024px) {
          .lang-switcher {
            display: none !important;
          }
        }
      `}</style>
      <div
        className="lang-switcher"
        style={{
          position: 'fixed',
          top: '50%',
          right: '14px',
          transform: 'translateY(-50%)',
          zIndex: 250,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {langs.map(({ value, label }) => (
          <button
            key={value}
            className="lang-btn"
            onClick={() => setLang(value)}
            aria-label={label}
            aria-pressed={lang === value}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: lang === value ? 'var(--color-primary-text)' : 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: lang === value ? '#fff' : 'var(--color-text-dim)',
              fontSize: '9px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s, border-color 0.15s, transform 0.12s',
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
          borderBottom: '1px solid transparent',
          background: scrolled ? 'color-mix(in srgb, var(--color-bg) 72%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          boxShadow: scrolled ? '0 10px 30px -18px rgba(0,0,0,0.18)' : 'none',
          transition: 'background-color 0.25s, box-shadow 0.25s',
        }}
        className="hidden-mobile site-header"
      >
        <div
          className="section-container"
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            padding: '0 24px',
            height: '72px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Logo (esquerda) */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', height: '32px', textDecoration: 'none' }}>
            <Logo height={26} alt={brandName} />
          </a>

          {/* Links (centro) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px' }}>
            <style>{`@media (hover: hover) and (pointer: fine) { .nav-link:hover { color: var(--color-primary) !important; } }`}</style>
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link"
                aria-current={isActive(href) ? 'page' : undefined}
                style={{
                  borderBottom: isActive(href) ? '2px solid var(--color-primary)' : '2px solid transparent',
                  paddingBottom: '6px',
                  color: 'var(--color-text)',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Actions (direita) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <a
              href={resumeUrl}
              download
              className="cta-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-text)',
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {cvLabel}
              <Download size={15} />
            </a>
            <a
              href="/briefing"
              className="nav-cta cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--color-primary-text)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 18px',
                borderRadius: '999px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t('nav.startProject')}
              <ArrowRight size={15} />
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
          borderBottom: '1px solid transparent',
          background: scrolled ? 'color-mix(in srgb, var(--color-bg) 72%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          boxShadow: scrolled ? '0 10px 30px -18px rgba(0,0,0,0.18)' : 'none',
          transition: 'background-color 0.25s, box-shadow 0.25s',
        }}
        className="show-mobile site-header"
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
            ref={hamburgerRef}
            onClick={() => setDrawerOpen((o) => !o)}
            style={{
              background: 'transparent',
              border: 'none',
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
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
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
            <Logo height={20} alt={brandName} />
          </a>

          {/* Language menu (3 pontinhos) */}
          <button
            onClick={() => setLangMenuOpen((o) => !o)}
            style={{
              background: 'transparent',
              border: 'none',
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
            aria-label={t('nav.openMenu')}
            aria-haspopup="menu"
            aria-expanded={langMenuOpen}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </nav>

      {/* ── Language dropdown (mobile) ── */}
      {/* Renderizado condicionalmente (não com display toggle): a regra global
          ".show-mobile { display: flex !important }" em mobile venceria um
          display:none inline, deixando o menu sempre visível por engano. */}
      {langMenuOpen && (
        <>
          <div
            className="show-mobile"
            onClick={() => setLangMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 220 }}
          />
          <div
            role="menu"
            className="show-mobile"
            style={{
              position: 'fixed',
              top: '64px',
              right: '16px',
              zIndex: 230,
              flexDirection: 'column',
              gap: '4px',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {langs.map(({ value, label }) => (
              <button
                key={value}
                role="menuitemradio"
                aria-checked={lang === value}
                onClick={() => {
                  setLang(value);
                  setLangMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: lang === value ? 'var(--color-primary-text)' : 'transparent',
                  color: lang === value ? '#fff' : 'var(--color-text)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {label === 'PT' ? 'Português' : 'English'}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Mobile Drawer Overlay ── */}
      <div
        ref={scrimRef}
        className="show-mobile drawer-scrim"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 190,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: drawerOpen ? 1 : 0,
          visibility: drawerOpen ? 'visible' : 'hidden',
          transition: `opacity ${drawerOpen ? 280 : drawerCloseMs}ms ease-out, visibility 0s linear ${drawerOpen ? 0 : drawerCloseMs}ms`,
        }}
      />

      {/* ── Mobile Drawer ── */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className="show-mobile"
        onPointerDown={handleDrawerPointerDown}
        onPointerMove={handleDrawerPointerMove}
        onPointerUp={finishDrawerDrag}
        onPointerCancel={finishDrawerDrag}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && !drawerOpen) setDrawerCloseMs(200);
        }}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.openMenu')}
        inert={!drawerOpen}
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
          transition: `transform ${drawerOpen ? '280ms' : `${drawerCloseMs}ms`} var(--ease-drawer)`,
          touchAction: 'pan-y',
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
            <Logo height={18} alt={brandName} />
          </a>
          <button
            ref={closeButtonRef}
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
            <X size={18} />
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
              <ChevronRight size={16} color="var(--color-text-dim)" />
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
              background: 'var(--color-primary-text)',
              color: '#fff',
              fontFamily: 'var(--font-headline)',
              fontSize: '14px',
              fontWeight: 700,
              padding: '14px 20px',
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            {t('nav.startProject')}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Responsive visibility styles */}
      <style>{`
        @media (min-width: 1025px) {
          .hidden-mobile { display: block !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .show-mobile[style*="flex-direction: column"] { display: flex !important; }
        }
      `}</style>
    </>
  );
}
