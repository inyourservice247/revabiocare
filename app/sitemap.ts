import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { getActiveProductSitemapEntries } from '@/lib/server/products';

export const dynamic = 'force-dynamic';

export const publicSitemapPaths = ['/', '/about', '/products', '/services', '/quality-compliance', '/contact', '/privacy'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProductSitemapEntries();
  return [
    ...publicSitemapPaths.map((path) => ({ url: absoluteUrl(path) })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.updated_at,
    })),
  ];
}
