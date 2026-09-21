import type { MetadataRoute } from 'next';
import { getVisibleCases } from '@/data/cases';

const BASE_URL = 'https://tiagosmagno.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getVisibleCases();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/consultoria`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/briefing`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const casePages: MetadataRoute.Sitemap = cases
    .filter((item) => item.caseStudy)
    .map((item) => ({
      url: `${BASE_URL}/portfolio/${item.slug}`,
      changeFrequency: 'yearly',
      priority: 0.6,
    }));

  return [...staticPages, ...casePages];
}
