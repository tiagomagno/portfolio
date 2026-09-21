import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseStudyPage from '@/components/CaseStudyPage';
import { getAllCases, getVisibleCases, getCaseBySlug, getCaseBySlugIncludingHidden } from '@/data/cases';

// Reflete imagens/textos atualizados pelo admin (/admin/cases) sem precisar de novo deploy.
export const revalidate = 60;

export async function generateStaticParams() {
  const cases = await getAllCases();
  return cases.filter((item) => item.caseStudy).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCaseBySlugIncludingHidden(slug);
  if (!item?.caseStudy) return { title: 'Case não encontrado - Tiago Magno' };

  const title = `${item.empresa} - Tiago Magno`;
  const description = item.caseStudy.heroSubtitle;

  return {
    title,
    description,
    alternates: { canonical: `/portfolio/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/portfolio/${slug}`,
      images: item.image ? [{ url: item.image, alt: item.empresa }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: item.image ? [item.image] : undefined,
    },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // getCaseBySlug já retorna null tanto pra "não existe" quanto pra "desativado/excluído" —
  // um case escondido no admin não deve mais ser acessível, mesmo por link direto.
  const [item, visibleCases] = await Promise.all([getCaseBySlug(slug), getVisibleCases()]);
  if (!item?.caseStudy) {
    notFound();
  }

  // Lista de navegação "próximo case" só com cases visíveis e com narrativa completa —
  // nunca aponta pra um case desativado/excluído (levaria a um 404).
  const casesWithStudy = visibleCases.filter((c) => c.caseStudy);

  return (
    <>
      <Header />
      <main id="main-content">
        <CaseStudyPage item={item} allCases={casesWithStudy} />
      </main>
      <Footer />
    </>
  );
}
