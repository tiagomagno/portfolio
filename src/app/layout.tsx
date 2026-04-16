import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/context/LangContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-body',
});

import { ThemeProvider } from '@/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'Tiago Magno - UX Designer Sênior | Product Design',
  description:
    'Transformo interações complexas em experiências digitais eficientes, escaláveis e centradas no usuário, conectando estratégia, UX, tecnologia e dados.',
  keywords: ['UX Designer', 'Product Designer', 'UX Design', 'Product Design', 'Design Thinking', 'UI Design', 'Design System'],
  authors: [{ name: 'Tiago Magno' }],
  metadataBase: new URL('https://tiagosmagno.com.br'),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#131313" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LangProvider>{children}</LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

