import type { Metadata } from 'next';
import { Rethink_Sans } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/context/LangContext';

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-rethink',
});

export const metadata: Metadata = {
  title: 'Tiago Magno - UX Designer Sênior | Product Design',
  description:
    'Transformo interações complexas em experiências digitais eficientes, escaláveis e centradas no usuário, conectando estratégia, UX, tecnologia e dados.',
  keywords: ['UX Designer', 'Product Designer', 'UX Design', 'Product Design', 'Design Thinking'],
  authors: [{ name: 'Tiago Magno' }],
  openGraph: {
    type: 'website',
    title: 'Tiago Magno - UX Designer Sênior | Product Design',
    description:
      'Transformo interações complexas em experiências digitais eficientes e centradas no usuário.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={rethinkSans.variable}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
