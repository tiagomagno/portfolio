const SOURCES = {
  /** Assinatura horizontal completa (símbolo + tipografia), laranja de marca. Uso padrão. */
  full: '/brand/magno-color-symbol.svg',
  /** Só o símbolo, sem tipografia — espaços apertados. */
  symbol: '/brand/magno-symbol.svg',
  /** Só a tipografia, sem símbolo, laranja. */
  wordmark: '/brand/magno-color.svg',
  /** Só a tipografia, sem símbolo, branca — não existe versão completa em branco. */
  wordmarkWhite: '/brand/magno-white.svg',
} as const;

const ASPECT_RATIO = {
  full: 332 / 64,
  symbol: 84 / 56,
  wordmark: 221 / 55,
  wordmarkWhite: 221 / 55,
} as const;

import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function Logo({ variant = 'full', height = 24, alt = 'Tiago Magno' }: { variant?: keyof typeof SOURCES; height?: number; alt?: string }) {
  // Logo definida no admin (Seções → Header) substitui as versões de assinatura/wordmark; o símbolo isolado fica.
  const { logoUrl } = useSiteSettings();
  const src = logoUrl && variant !== 'symbol' ? logoUrl : SOURCES[variant];
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} height={height} width={height * ASPECT_RATIO[variant]} style={{ display: 'block', height, width: 'auto' }} />;
}
