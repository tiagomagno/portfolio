'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PublicSiteSettings {
  brandName: string;
  contactEmail: string;
  whatsappNumber: string;
  linkedinUrl: string;
}

/** Idênticos aos defaults do schema (src/data/siteSettings.ts) — usados até o fetch resolver. */
const DEFAULT_SETTINGS: PublicSiteSettings = {
  brandName: 'Tiago Magno',
  contactEmail: 'tiagosilvamagno@gmail.com',
  whatsappNumber: '5592981168163',
  linkedinUrl: 'https://www.linkedin.com/in/tiagosmagno/',
};

const SiteSettingsContext = createContext<PublicSiteSettings>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings>(DEFAULT_SETTINGS);

  // Config global editada em /admin/global. Sem override (ou banco fora do ar), o site
  // usa os defaults acima normalmente — mesmo padrão de LangContext + /api/content.
  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
