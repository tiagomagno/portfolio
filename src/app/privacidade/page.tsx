import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PrivacyPolicy from '@/components/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Política de Privacidade - Tiago Magno',
  description: 'Como os dados enviados pelos formulários do site são coletados, usados e protegidos.',
  alternates: { canonical: '/privacidade' },
};

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}
