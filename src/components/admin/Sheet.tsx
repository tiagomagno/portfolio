'use client';

import { useEffect } from 'react';

export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 50 }}
      />
      <div
        id="admin-sheet-scroll"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'min(768px, 95vw)',
          background: '#f5f3f0',
          boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
          zIndex: 51,
          overflowY: 'auto',
          padding: '0 28px 28px',
        }}
      >
        {/* Padding-top fica só aqui (não no container) — um filho com position:sticky
            gruda no topo exato do scrollport; se o container tivesse padding-top, sobraria
            uma faixa sem cobertura por onde o conteúdo rolado "vaza" por cima do sticky. */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '16px', paddingTop: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#1a1a1a',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
