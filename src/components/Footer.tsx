export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#0e0e0e',
        borderTop: '1px solid #1c1b1b',
        padding: '56px 0 40px',
      }}
    >
      <style>{`
        .footer-link:hover { color: #fff !important; }
        .footer-back:hover { color: #ff5625 !important; }
      `}</style>

      <div className="section-container" style={{ maxWidth: '85vw', margin: '0 auto', padding: '0 24px' }}>
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          {/* Logo */}
          <div>
            <a
              href="#"
              className="footer-back"
              style={{
                color: '#fff',
                fontWeight: 900,
                fontSize: 'var(--fs-card-title)',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                transition: 'color 0.15s',
              }}
            >
              TM<span style={{ color: '#ff5625' }}>.</span>
            </a>
            <span
              style={{
                display: 'block',
                fontSize: 'var(--fs-tiny)',
                color: '#4a4a4a',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              Digital Product Architect
            </span>
          </div>

          {/* Back to top */}
          <a
            href="#"
            className="footer-back"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
              fontSize: 'var(--fs-eyebrow)',
              fontWeight: 700,
              letterSpacing: 'var(--ls-eyebrow)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
          >
            Voltar ao topo
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_upward
            </span>
          </a>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#1c1b1b', marginBottom: '32px' }} />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p style={{ color: '#4a4a4a', fontSize: 'var(--fs-small)', margin: 0 }}>
            © {year} Tiago Magno. Todos os direitos reservados.
          </p>

          <div style={{ display: 'flex', gap: '32px' }}>
            <a
              href="https://www.linkedin.com/in/tiagosmagno/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ color: '#666', fontSize: 'var(--fs-small)', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              LinkedIn
            </a>
            <a
              href="mailto:tiagosilvamagno@gmail.com"
              className="footer-link"
              style={{ color: '#666', fontSize: 'var(--fs-small)', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              Email
            </a>
            <a
              href="https://wa.me/5592981168163"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ color: '#666', fontSize: 'var(--fs-small)', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              WhatsApp
            </a>
            <a
              href="https://tiagosmagno.com.br/"
              className="footer-link"
              style={{ color: '#666', fontSize: 'var(--fs-small)', textDecoration: 'none', transition: 'color 0.15s' }}
            >
              Site
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


