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
import { getSeoOverride, withSeoOverride } from '@/lib/seo';

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

// Schema.org Person: declara a entidade "Tiago Magno" pra buscadores tradicionais
// e mecanismos de busca por IA (GEO) — sem isso o site tinha zero dados estruturados.
const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tiago Magno',
  jobTitle: 'UX Designer Sênior',
  description:
    'UX Designer Sênior com mais de 20 anos de experiência em Product Design, UI Design, Design Systems e consultoria de produto.',
  url: 'https://tiagosmagno.com.br',
  image: 'https://tiagosmagno.com.br/eu.jpg',
  email: 'mailto:tiagosilvamagno@gmail.com',
  sameAs: ['https://www.linkedin.com/in/tiagosmagno/'],
  address: { '@type': 'PostalAddress', addressLocality: 'Manaus', addressRegion: 'AM', addressCountry: 'BR' },
  knowsAbout: ['UX Design', 'UI Design', 'Design Systems', 'Product Design', 'Arquitetura da Informação', 'UX Research'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Encurta a conexão TCP/TLS até o Google Fonts antes do <link rel="stylesheet">
            abaixo — sem isso ele é 100% do tempo de handshake um recurso bloqueando
            a renderização (apontado pelo PageSpeed). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
            {children}
            <WhatsAppFloat />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

