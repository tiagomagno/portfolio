'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin/cases', label: 'Imagens dos Cases' },
  { href: '/admin/leads', label: 'Leads' },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3f0' }}>
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
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>Admin</span>
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
        <button
          onClick={handleLogout}
          style={{ border: '1px solid var(--color-border)', background: 'transparent', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#1a1a1a' }}
        >
          Sair
        </button>
      </header>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>{children}</main>
    </div>
  );
}
