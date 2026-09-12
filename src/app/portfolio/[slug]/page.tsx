import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseStudyPage from '@/components/CaseStudyPage';
import { getCaseStudyItems, getPortfolioItemBySlug, slugify } from '@/data/portfolio';
import { getCaseAssetOverrides } from '@/data/caseAssets';
import { getHiddenPortfolioSlugs } from '@/data/portfolioVisibility';

// Reflete imagens atualizadas pelo admin (/admin/cases) sem precisar de novo deploy.
export const revalidate = 60;

export function generateStaticParams() {
  return getCaseStudyItems().map((item) => ({ slug: slugify(item.empresa) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioItemBySlug(slug);
  if (!item?.caseStudy) return { title: 'Case não encontrado - Tiago Magno' };

  const overrides = await getCaseAssetOverrides(slug);
  const coverImage = overrides?.coverImage ?? item.image;
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
      images: coverImage ? [{ url: coverImage, alt: item.empresa }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPortfolioItemBySlug(slug);

  if (!item?.caseStudy) {
    notFound();
  }

  const [overrides, hiddenSlugs] = await Promise.all([getCaseAssetOverrides(slug), getHiddenPortfolioSlugs()]);

  // Case desativado/excluído no admin (/admin/cases) — não deve mais ser acessível, mesmo por link direto.
  if (hiddenSlugs.has(slug)) {
    notFound();
  }

  const resolvedItem = overrides
    ? {
        ...item,
        image: overrides.coverImage ?? item.image,
        heroImage: overrides.heroImage ?? item.heroImage,
        heroColor: overrides.heroColor ?? item.heroColor,
        gallery: overrides.gallery.length > 0 ? overrides.gallery : item.gallery,
        atuacao: overrides.atuacao ?? item.atuacao,
      }
    : item;

  return (
    <>
      <Header />
      <main id="main-content">
        <CaseStudyPage item={resolvedItem} hiddenSlugs={[...hiddenSlugs]} />
      </main>
      <Footer />
    </>
  );
}
