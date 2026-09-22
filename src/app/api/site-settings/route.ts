import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/data/siteSettings';

export const dynamic = 'force-dynamic';

/** Só os campos de exibição pública — os e-mails de destino de formulário não saem do server. */
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({
    brandName: settings.brandName,
    contactEmail: settings.contactEmail,
    whatsappNumber: settings.whatsappNumber,
    linkedinUrl: settings.linkedinUrl,
  });
}
