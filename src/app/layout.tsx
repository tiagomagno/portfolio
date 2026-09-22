import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/context/LangContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-body',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-headline',
});

import { ThemeProvider } from '@/providers/ThemeProvider';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { getSeoOverride, withSeoOverride } from '@/lib/seo';
import { getSiteSettings } from '@/data/siteSettings';

const DEFAULT_METADATA: Metadata = {
  title: 'Tiago Magno - UX Designer Sênior | Product Design',
  description:
    'Transformo interações complexas em experiências digitais eficientes, escaláveis e centradas no usuário, conectando estratégia, UX, tecnologia e dados.',
  keywords: ['UX Designer', 'Product Designer', 'UX Design', 'Product Design', 'Design Thinking', 'UI Design', 'Design System'],
  authors: [{ name: 'Tiago Magno' }],
  metadataBase: new URL('https://tiagosmagno.com.br'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://tiagosmagno.com.br',
    title: 'Tiago Magno - UX Designer Sênior | Product Design',
    description:
      'Transformo interações complexas em experiências digitais eficientes e centradas no usuário.',
    siteName: 'Tiago Magno',
    images: [{
      url: '/eu.jpg',
      width: 800,
      height: 600,
      alt: 'Tiago Magno Profile',
    }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getSeoOverride('home');
  return withSeoOverride(DEFAULT_METADATA, override);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  // Schema.org Person: declara a entidade "Tiago Magno" pra buscadores tradicionais
  // e mecanismos de busca por IA (GEO) — sem isso o site tinha zero dados estruturados.
  // Precisa ser calculado no server (não via SiteSettingsContext, que só resolve
  // client-side) pra o e-mail/LinkedIn configurados em /admin/global chegarem certos
  // no HTML inicial.
  const PERSON_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.brandName,
    jobTitle: 'UX Designer Sênior',
    description:
      'UX Designer Sênior com mais de 20 anos de experiência em Product Design, UI Design, Design Systems e consultoria de produto.',
    url: 'https://tiagosmagno.com.br',
    image: 'https://tiagosmagno.com.br/eu.jpg',
    email: `mailto:${settings.contactEmail}`,
    sameAs: [settings.linkedinUrl],
    address: { '@type': 'PostalAddress', addressLocality: 'Manaus', addressRegion: 'AM', addressCountry: 'BR' },
    knowsAbout: ['UX Design', 'UI Design', 'Design Systems', 'Product Design', 'Arquitetura da Informação', 'UX Research'],
  };

  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <LangProvider>
            <SiteSettingsProvider>
              {children}
              <WhatsAppFloat />
            </SiteSettingsProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

