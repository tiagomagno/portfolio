'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

const NAV = [
  { href: '/admin/pages', label: 'Seções' },
  { href: '/admin/cases', label: 'Cases' },
  { href: '/admin/leads', label: 'Leads' },
];

// O site público passou pro tema escuro (tokens em globals.css); o admin continua claro.
const ADMIN_VARS = {
  '--color-bg': '#ffffff',
  '--color-bg-low': '#ffffff',
  '--color-bg-card': '#ffffff',
  '--color-bg-high': '#f0f0f0',
  '--color-border': '#e2e2e2',
  '--color-border-subtle': '#d0d0d0',
  '--color-text': '#1a1a1a',
  '--color-text-muted': '#5a5a5a',
  '--color-primary-text': '#c9431a',
  '--color-primary-text-hover': '#a83614',
  '--pill-bg': 'rgba(26,26,26,0.05)',
  '--pill-active-text': '#ffffff',
  '--pill-inactive-text': 'rgba(26,26,26,0.6)',
  color: '#1a1a1a',
} as React.CSSProperties;

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3f0', ...ADMIN_VARS }}>
      {/* Ícones do admin (CasesTable) usam Material Symbols. Carregado só aqui —
          não no layout raiz — pra não pesar o carregamento das páginas públicas
          com um recurso bloqueando a renderização (era o maior gargalo do PageSpeed). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Logo height={22} />
          <nav style={{ display: 'flex', gap: '4px' }}>
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: active ? '#fff' : '#1a1a1a',
                    background: active ? 'var(--color-primary)' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#1a1a1a',
              textDecoration: 'none',
            }}
          >
            Ver site
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
          </a>
          <button
            onClick={handleLogout}
            style={{ border: '1px solid var(--color-border)', background: 'transparent', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#1a1a1a' }}
          >
            Sair
          </button>
        </div>
      </header>
      <main style={{ padding: '32px 24px' }}>{children}</main>
    </div>
  );
}
