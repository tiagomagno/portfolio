'use client';

import FooterBar from './FooterBar';
import { GRADIENT } from '@/lib/surfaces';

export default function Footer() {
  return (
    <footer style={{ background: GRADIENT.rtl, padding: '48px 0 32px' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FooterBar />
      </div>
    </footer>
  );
}
