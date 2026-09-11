/**
 * Section-background tones for the sober/light redesign (Home, Portfólio, Case Details).
 * Fixed values, not theme-reactive (mirrors the light tokens in globals.css :root).
 * Footer stays dark for contrast — every other section is light.
 */
export const SURFACE = {
  /** Alternating section tone (Hero, Processo, Portfólio preview, CTA banners...) */
  base: '#ffffff',
  /** Alternating section tone (Sobre, Soluções, grade do Portfólio, Contato...) */
  raised: '#ffffff',
  /** Image/input card tone sitting on a `raised` section */
  card: '#f3f1ee',
  /** ProcessCard tone (Processo section) — pair with a border, it's close to `base` */
  processCard: '#ffffff',
  /** Footer tone — stays dark by design */
  footer: '#1a1c1d',
} as const;
