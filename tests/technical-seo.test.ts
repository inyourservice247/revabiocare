import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { absoluteUrl, productDescription, publicMetadata, SITE_URL } from '../lib/site';

describe('technical SEO and indexability', () => {
  it('allows public crawling while excluding admin and API routes', () => {
    const source = readFileSync('app/robots.ts', 'utf8');
    expect(source).toContain("allow: '/'");
    expect(source).toContain("disallow: ['/admin', '/api/']");
    expect(source).toContain("absoluteUrl('/sitemap.xml')");
  });

  it('generates absolute static and active-product sitemap URLs', async () => {
    const source = readFileSync('app/sitemap.ts', 'utf8');
    expect(source).toContain("['/', '/about', '/products', '/services', '/quality-compliance', '/contact', '/privacy']");
    expect(source).toContain('getActiveProductSitemapEntries()');
    expect(source).toContain('absoluteUrl(`/products/${product.slug}`)');
    expect(source).not.toContain("'/admin'");
    expect(source).not.toContain("'/api/'");
  });

  it('uses one centralized origin for canonical URLs', () => {
    expect(SITE_URL.origin).toBe('https://revabiocare.vercel.app');
    expect(absoluteUrl('/products/example')).toBe('https://revabiocare.vercel.app/products/example');
    expect(publicMetadata({ title: 'Products', description: 'Catalogue', path: '/products' }).alternates?.canonical)
      .toBe('https://revabiocare.vercel.app/products');
  });

  it('builds factual product descriptions from verified names and categories', () => {
    expect(productDescription('Example Product', ['Category A', 'Category B']))
      .toBe('Example Product listed by Reva Biocare under Category A, Category B. Contact us for product enquiries and availability.');
  });

  it('queries only active products and retains inactive/not-found boundaries', () => {
    const products = readFileSync('lib/server/products.ts', 'utf8');
    const detail = readFileSync('app/(public)/products/[slug]/page.tsx', 'utf8');
    expect(products).toContain("SELECT slug, updated_at FROM products WHERE active = true");
    expect(products).toContain('WHERE p.slug = $1 AND p.active = true');
    expect(detail).toContain("robots: { index: false, follow: false }");
    expect(detail).toContain('notFound()');
  });

  it('publishes dynamic product metadata, canonical and breadcrumb data', () => {
    const detail = readFileSync('app/(public)/products/[slug]/page.tsx', 'utf8');
    expect(detail).toContain('export async function generateMetadata');
    expect(detail).toContain('`/products/${product.slug}`');
    expect(detail).toContain("'@type': 'BreadcrumbList'");
    expect(detail).not.toContain("'@type': 'Product'");
  });
});
