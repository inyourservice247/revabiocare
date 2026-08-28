import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public product detail pages', () => {
  const page = readFileSync('app/(public)/products/[slug]/page.tsx', 'utf8');

  it('loads only an active Neon product and returns a proper 404 otherwise', () => {
    const products = readFileSync('lib/server/products.ts', 'utf8');
    expect(page).toContain('getActiveProductBySlug');
    expect(page).toContain('notFound()');
    expect(products).toMatch(/WHERE p\.slug = \$1 AND p\.active = true/);
  });

  it('renders only populated optional product fields and active category chips', () => {
    expect(page).toContain('category.active');
    expect(page).toContain('product.cas_number ?');
    expect(page).toContain('grades.length > 0');
    expect(page).toContain('product.overview.trim()');
    expect(page).toContain('applications.length > 0');
    expect(page).toContain('documentation.length > 0');
  });

  it('keeps product details and enquiry actions separate', () => {
    const catalogue = readFileSync('app/(public)/products/product-catalogue.tsx', 'utf8');
    const home = readFileSync('app/(public)/page.tsx', 'utf8');
    expect(catalogue).toContain('href={`/products/${product.slug}`}');
    expect(catalogue).toContain('/contact?requirement=');
    expect(home).toContain('href={`/products/${x.slug}`}');
    expect(page).toContain('/contact?requirement=');
  });
});
