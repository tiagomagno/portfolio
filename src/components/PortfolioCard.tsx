import Image from 'next/image';
import type { PortfolioItem } from '@/data/portfolio';
import { SURFACE } from '@/lib/surfaces';

export default function PortfolioCard({
  item,
  coverImage,
  categoryLabel,
  priority,
  comingSoonLabel,
}: {
  item: PortfolioItem;
  coverImage?: string;
  categoryLabel: (cat: string) => string;
  priority?: boolean;
  comingSoonLabel?: string;
}) {
  return (
    <div className="portfolio-card-v2">
      <div
        className="portfolio-card-v2-image"
        style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: '16px', overflow: 'hidden', background: SURFACE.card }}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={item.empresa}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            priority={priority}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'rgba(26,26,26,0.15)' }}>
              photo_camera
            </span>
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
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(26,26,26,0.65)', marginBottom: '4px' }}>
          {item.atuacao.map(categoryLabel).join(' · ')}
        </span>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1a1a1a', margin: 0, lineHeight: 1.3 }}>
          {item.empresa}
        </h3>
      </div>
    </div>
  );
}
