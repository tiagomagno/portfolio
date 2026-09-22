import { prisma } from '@/lib/prisma';

export interface SiteSettingsData {
  brandName: string;
  contactEmail: string;
  whatsappNumber: string;
  linkedinUrl: string;
  contactFormRecipientEmail: string;
  briefingFormRecipientEmail: string;
}

/** Idênticos aos defaults do schema — usados sempre que a linha "global" ainda não existe
 * (antes do primeiro save em /admin/global) ou o banco falha, pro site nunca ficar sem marca/contato. */
export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  brandName: 'Tiago Magno',
  contactEmail: 'tiagosilvamagno@gmail.com',
  whatsappNumber: '5592981168163',
  linkedinUrl: 'https://www.linkedin.com/in/tiagosmagno/',
  contactFormRecipientEmail: 'tiagosilvamagno@gmail.com',
  briefingFormRecipientEmail: 'tiagosilvamagno@gmail.com',
};

/** Sempre falha em silêncio (retorna os defaults) — mesmo padrão de caseAssets.ts/
 * portfolioVisibility.ts: sem DATABASE_URL configurada, ou banco fora do ar, o site
 * continua no ar com os valores padrão. */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
    if (!row) return DEFAULT_SITE_SETTINGS;
    return {
      brandName: row.brandName,
      contactEmail: row.contactEmail,
      whatsappNumber: row.whatsappNumber,
      linkedinUrl: row.linkedinUrl,
      contactFormRecipientEmail: row.contactFormRecipientEmail,
      briefingFormRecipientEmail: row.briefingFormRecipientEmail,
    };
  } catch (err) {
    console.error('getSiteSettings falhou:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}
