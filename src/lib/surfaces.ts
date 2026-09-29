/**
 * Section-background tones for the dark redesign (Home, Portfólio, Case Details).
 * Fixed values, not theme-reactive. Site background is pure black (#000000);
 * alternating sections use #1a1a1a.
 */
export const SURFACE = {
  /** Site background — pure black (Hero, Portfólio preview, Lab, CTA banners...) */
  base: '#000000',
  /** Alternating section tone (Sobre, Soluções, grade do Portfólio, Contato...) */
  raised: '#1a1a1a',
  /** Image/input card tone sitting on a `raised` section */
  card: '#262626',
  /** Subtle tone for floating cards/icon chips that shouldn't compete with content */
  subtle: '#1a1a1a',
  /** ProcessCard tone (Processo section) — pair with a border */
  processCard: '#1a1a1a',
  /** Footer tone */
  footer: '#000000',
} as const;

/**
 * Gradientes das seções "pretas" da home: do preto puro ao tom mais escuro do retrato
 * (rgb(0,4,7) nas bordas da foto), pra foto do Hero se fundir com o fundo sem emenda.
 * As seções alternam a direção (esquerda→direita / direita→esquerda).
 */
export const GRADIENT = {
  ltr: 'linear-gradient(90deg, #000000 0%, #000407 100%)',
  rtl: 'linear-gradient(270deg, #000000 0%, #000407 100%)',
} as const;
