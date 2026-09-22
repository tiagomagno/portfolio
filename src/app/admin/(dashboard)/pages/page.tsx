import Link from 'next/link';

const PAGES = [
  { href: '/admin/pages/home', title: 'Página Home', desc: 'Seções, textos por seção e SEO da página inicial.' },
  { href: '/admin/pages/cases', title: 'Página Cases', desc: 'Hero, "Próximo Passo" e SEO da listagem de cases (/portfolio).' },
  { href: '/admin/pages/case-detail', title: 'Página Detalhamento dos Cases', desc: 'Textos padrão de exibição de qualquer case (/portfolio/[slug]).' },
  { href: '/admin/pages/briefing', title: 'Página Briefing', desc: 'Textos do formulário, destinatário do e-mail e SEO.' },
];

export default function AdminPagesIndex() {
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Pages</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Organização de conteúdo das páginas do site.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              display: 'block',
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '20px',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px' }}>{p.title}</h2>
            <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
