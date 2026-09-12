import type { MetadataRoute } from 'next';
import { getCaseStudyItems, slugify } from '@/data/portfolio';
import { getHiddenPortfolioSlugs } from '@/data/portfolioVisibility';

const BASE_URL = 'https://tiagosmagno.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hiddenSlugs = await getHiddenPortfolioSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/consultoria`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/briefing`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const casePages: MetadataRoute.Sitemap = getCaseStudyItems()
    .filter((item) => !hiddenSlugs.has(slugify(item.empresa)))
    .map((item) => ({
      url: `${BASE_URL}/portfolio/${slugify(item.empresa)}`,
      changeFrequency: 'yearly',
      priority: 0.6,
    }));

  return [...staticPages, ...casePages];
}
