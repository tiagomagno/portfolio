'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useLang } from '@/context/LangContext';
import { CONSENT_KEY, captureAttribution, getConsent, track, type Consent } from '@/lib/analytics';

interface Config {
  gaId: string;
  metaPixelId: string;
  clarityId: string;
}

export const OPEN_CONSENT_EVENT = 'open-cookie-preferences';

// Carrega GA4, Meta Pixel e Clarity somente após o aceite (LGPD) e mostra o banner de
// consentimento. Os IDs vêm de /api/analytics-config; sem nenhum ID configurado, o
// componente não carrega nada e nem exibe o banner.
export default function Analytics() {
  const { lang } = useLang();
  const [config, setConfig] = useState<Config | null>(null);
  const [consent, setConsent] = useState<Consent>(null);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    captureAttribution();
    // localStorage só existe no client: ler o consentimento aqui evita divergência de hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(getConsent());
    fetch('/api/analytics-config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  const hasTools = !!(config && (config.gaId || config.metaPixelId || config.clarityId));
  const bannerOpen = hasTools && (consent === null || reopened);

  // Permite reabrir a escolha (link "Preferências de cookies" no rodapé).
  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  // Cliques de conversão por delegação: cobre todos os botões sem tocar em cada componente.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const location = a.dataset.trackLocation || 'other';
      const page = window.location.pathname;
      if (href.includes('wa.me')) track('click_whatsapp', { location, page });
      else if (href.startsWith('/briefing')) track('click_briefing_cta', { location, page });
      else if (href.startsWith('mailto:')) track('click_email', { location, page });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const decide = (value: 'granted' | 'denied') => {
    const previous = getConsent();
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* storage bloqueado */
    }
    setConsent(value);
    setReopened(false);
    // Revogar após as ferramentas já terem carregado exige recarregar para descarregá-las.
    if (previous === 'granted' && value === 'denied') window.location.reload();
  };

  const pt = lang === 'pt-BR';

  return (
    <>
      {consent === 'granted' && config?.gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${config.gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${config.gaId}');
          `}</Script>
        </>
      )}
      {consent === 'granted' && config?.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${config.metaPixelId}');
          fbq('track', 'PageView');
        `}</Script>
      )}
      {consent === 'granted' && config?.clarityId && (
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${config.clarityId}");
        `}</Script>
      )}

      {bannerOpen && hasTools && (
        <div
          role="dialog"
          aria-label={pt ? 'Preferências de cookies' : 'Cookie preferences'}
          style={{
            position: 'fixed',
            left: '16px',
            right: '16px',
            bottom: '16px',
            maxWidth: '520px',
            zIndex: 200,
            background: '#fff',
            color: '#1a1a1a',
            border: '1px solid rgba(26,26,26,0.12)',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            padding: '20px',
          }}
        >
          <p style={{ margin: '0 0 14px', fontSize: '13px', lineHeight: 1.6 }}>
            {pt
              ? 'Uso cookies de medição (Google Analytics, Meta e Microsoft Clarity) para entender como o site é usado e melhorar a experiência. Só ativam se você aceitar.'
              : 'I use measurement cookies (Google Analytics, Meta and Microsoft Clarity) to understand how the site is used and improve the experience. They only run if you accept.'}{' '}
            <Link href="/privacidade" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {pt ? 'Política de Privacidade' : 'Privacy Policy'}
            </Link>
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => decide('granted')}
              style={{
                background: 'var(--color-primary-text-hover)',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                height: '40px',
                padding: '0 22px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {pt ? 'Aceitar' : 'Accept'}
            </button>
            <button
              type="button"
              onClick={() => decide('denied')}
              style={{
                background: 'transparent',
                color: '#1a1a1a',
                border: '1px solid rgba(26,26,26,0.25)',
                borderRadius: '999px',
                height: '40px',
                padding: '0 22px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {pt ? 'Recusar' : 'Decline'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
