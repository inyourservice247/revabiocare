import type { Metadata } from 'next';

export const SITE_NAME = 'Reva Biocare';
export const SITE_DESCRIPTION = 'B2B pharmaceutical product enquiries, sourcing discussions and documentation coordination.';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://revabiocare.vercel.app';
export const SITE_URL = new URL(configuredSiteUrl.endsWith('/') ? configuredSiteUrl : `${configuredSiteUrl}/`);

export function absoluteUrl(path = '/') {
  return new URL(path.replace(/^\//, ''), SITE_URL).toString();
}

export function publicMetadata({ title, description, path, absoluteTitle = false }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: absoluteTitle ? title : `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
    },
  };
}

export function productDescription(name: string, categories: string[]) {
  const categoryText = categories.length ? ` under ${categories.join(', ')}` : '';
  return `${name} listed by Reva Biocare${categoryText}. Contact us for product enquiries and availability.`;
}
