import Image from 'next/image';
import type { PortfolioItem } from '@/data/portfolio';
import { portfolioSummary, TBD } from '@/data/portfolio';
import { SURFACE } from '@/lib/surfaces';
import { ArrowUpRight, Camera } from 'lucide-react';

export default function PortfolioCard({
  item,
  coverImage,
  categoryLabel,
  priority,
  comingSoonLabel,
  variant = 'default',
  index,
  viewProjectLabel,
  cardClass,
}: {
  item: PortfolioItem;
  coverImage?: string;
  categoryLabel: (cat: string) => string;
  priority?: boolean;
  comingSoonLabel?: string;
  /** 'feature' = card do carrossel da Home (imagem com número/seta, depois categoria·ano, título, resumo e link). */
  variant?: 'default' | 'feature';
  /** Posição (1-based) exibida em destaque na imagem — só no variant 'feature'. */
  index?: number;
  viewProjectLabel?: string;
  /** Classe de tema do card (admin → Seções). Vazio = preto. */
  cardClass?: string;
}) {
  if (variant === 'feature') {
    const categories = item.atuacao.map(categoryLabel).join(' · ');
    const summary = portfolioSummary(item);
    return (
      <div
        className={`portfolio-card-v2 portfolio-card-feature ${cardClass ?? 'theme-dark'}`}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', background: cardClass === 'theme-card-outline' ? 'transparent' : 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '20px', overflow: 'hidden' }}
      >
        <div className="portfolio-card-v2-image" style={{ position: 'relative', background: SURFACE.card }}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={item.empresa}
              fill
              draggable={false}
              sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 40vw"
              style={{ objectFit: 'cover', objectPosition: 'top', userSelect: 'none' }}
              priority={priority}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={32} color="rgba(255,255,255,0.15)" />
            </div>
          )}
          {index !== undefined && (
            <span
              aria-hidden
              style={{ position: 'absolute', right: '16px', bottom: '-10px', fontSize: 'clamp(64px, 7vw, 104px)', fontWeight: 900, lineHeight: 1, color: 'rgba(255,255,255,0.14)', zIndex: 1, pointerEvents: 'none' }}
            >
              {String(index).padStart(2, '0')}
            </span>
          )}
        </div>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>
            <span>{categories}</span>
            {item.caseStudy?.year && item.caseStudy.year !== TBD && <span style={{ flexShrink: 0 }}>{item.caseStudy.year}</span>}
          </div>
          <h3 style={{ fontSize: 'clamp(22px, 2vw, 28px)', fontWeight: 900, color: 'var(--color-text)', margin: '0 0 10px', lineHeight: 1.15 }}>{item.empresa}</h3>
          {summary && (
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-muted)', margin: '0 0 20px' }}>{summary}</p>
          )}
          <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-text)' }}>
            {viewProjectLabel}
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-card-v2">
      <div
        className="portfolio-card-v2-image"
        style={{ position: 'relative', aspectRatio: '4 / 3.6', borderRadius: '16px', overflow: 'hidden', background: SURFACE.card }}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={item.empresa}
            fill
            draggable={false}
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw"
            style={{ objectFit: 'cover', objectPosition: 'top', userSelect: 'none' }}
            priority={priority}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={32} color="rgba(255,255,255,0.15)" />
          </div>
        )}

        {comingSoonLabel && !item.caseStudy && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(30,32,33,0.75)',
              color: 'rgba(245,243,240,0.85)',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              padding: '3px 8px',
              borderRadius: '100px',
            }}
          >
            {comingSoonLabel}
          </span>
        )}
      </div>

      <div style={{ marginTop: '14px' }}>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
          {item.atuacao.map(categoryLabel).join(' · ')}
        </span>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text)', margin: 0, lineHeight: 1.3 }}>
          {item.empresa}
        </h3>
      </div>
    </div>
  );
}
