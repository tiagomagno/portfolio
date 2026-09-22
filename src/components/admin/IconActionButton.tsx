'use client';

import Link from 'next/link';

/** Botão circular de ação com ícone (Material Symbols) — mesmo visual usado nas linhas
 * da tabela de Cases (editar/ocultar/excluir), reaproveitado nas listagens de Global e
 * Pages pra manter o mesmo padrão visual entre as telas do admin. */
export default function IconActionButton({
  icon,
  label,
  onClick,
  href,
  disabled,
  tone = 'default',
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  tone?: 'default' | 'danger';
}) {
  const color = tone === 'danger' ? '#b91c1c' : '#1a1a1a';
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: tone === 'danger' ? '1px solid rgba(185,28,28,0.25)' : '1px solid var(--color-border)',
    background: '#fff',
    color,
    textDecoration: 'none',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
  };
  const iconEl = (
    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
      {icon}
    </span>
  );

  if (href) {
    return (
      <Link href={href} title={label} aria-label={label} style={style}>
        {iconEl}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} type="button" title={label} aria-label={label} style={style}>
      {iconEl}
    </button>
  );
}
