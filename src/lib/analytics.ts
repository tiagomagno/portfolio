// Medição de audiência e atribuição de leads. Nada aqui roda no servidor além das
// constantes: as funções tocam em window/localStorage e são seguras para SSR (no-op).

export const CONSENT_KEY = 'analyticsConsent';
const ATTRIBUTION_KEY = 'attribution';

/** Campos de atribuição gravados junto de cada lead (chaves planas p/ aparecerem no admin). */
export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'referrer',
  'landing_page',
] as const;

export type AttributionFields = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type Consent = 'granted' | 'denied' | null;

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/** Dispara um evento de conversão/engajamento. Sem consentimento (ou sem IDs), não faz nada. */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined' || getConsent() !== 'granted') return;
  window.gtag?.('event', event, params);
  // Meta Pixel: só os eventos padrão que alimentam otimização de campanha.
  if (event === 'briefing_submit' || event === 'contact_submit') window.fbq?.('track', 'Lead');
  if (event === 'click_whatsapp') window.fbq?.('track', 'Contact');
}

/**
 * Guarda a origem da visita (primeiro toque; uma nova UTM sobrescreve). É armazenamento
 * próprio, sem identificador de terceiros — serve para saber de qual canal veio cada lead.
 */
export function captureAttribution() {
  try {
    const p = new URLSearchParams(window.location.search);
    const fromUrl: AttributionFields = {};
    for (const k of ATTRIBUTION_KEYS) {
      const v = p.get(k);
      if (v) fromUrl[k] = v.slice(0, 200);
    }
    const hasCampaign = Object.keys(fromUrl).length > 0;
    if (!hasCampaign && localStorage.getItem(ATTRIBUTION_KEY)) return;

    let referrer = '';
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.hostname !== window.location.hostname) referrer = ref.hostname;
    } catch {
      /* referrer inválido: ignora */
    }

    const data: AttributionFields = {
      ...fromUrl,
      ...(referrer ? { referrer } : {}),
      landing_page: window.location.pathname,
    };
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {
    /* storage bloqueado: segue sem atribuição */
  }
}

export function getAttribution(): AttributionFields {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as AttributionFields) : {};
  } catch {
    return {};
  }
}

/** Filtra um objeto qualquer deixando só campos de atribuição (usado no server). */
export function pickAttribution(input: Record<string, unknown>): AttributionFields {
  const out: AttributionFields = {};
  for (const k of ATTRIBUTION_KEYS) {
    const v = input[k];
    if (typeof v === 'string' && v) out[k] = v.slice(0, 200);
  }
  return out;
}
