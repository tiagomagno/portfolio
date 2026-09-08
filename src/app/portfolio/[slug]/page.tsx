import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseStudyPage from '@/components/CaseStudyPage';
import { getCaseStudyItems, getPortfolioItemBySlug, slugify } from '@/data/portfolio';
import { getCaseAssetOverrides } from '@/data/caseAssets';

// Reflete imagens atualizadas pelo admin (/admin/cases) sem precisar de novo deploy.
export const revalidate = 60;

export function generateStaticParams() {
  return getCaseStudyItems().map((item) => ({ slug: slugify(item.empresa) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioItemBySlug(slug);
  if (!item?.caseStudy) return { title: 'Case não encontrado - Tiago Magno' };

  return {
    title: `${item.empresa} - Tiago Magno`,
    description: item.caseStudy.heroSubtitle,
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPortfolioItemBySlug(slug);

  if (!item?.caseStudy) {
    notFound();
  }

  const overrides = await getCaseAssetOverrides(slug);
  const resolvedItem = overrides
    ? {
        ...item,
        image: overrides.coverImage ?? item.image,
        heroImage: overrides.heroImage ?? item.heroImage,
        gallery: overrides.gallery.length > 0 ? overrides.gallery : item.gallery,
      }
    : item;

  return (
    <>
      <Header />
      <main>
        <CaseStudyPage item={resolvedItem} />
      </main>
      <Footer />
    </>
  );
}
