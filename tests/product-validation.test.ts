import { describe, expect, it } from 'vitest';
import { parseProductForm, productSchema, slugifyProductName } from '../lib/server/product-validation';

describe('product validation', () => {
  it('creates a stable slug from a product name', () => {
    expect(slugifyProductName(' Sample Product HCl 10% ')).toBe('sample-product-hcl-10');
  });

  it('parses repeated fields without requiring JSON', () => {
    const form = new FormData();
    form.set('name', 'Test Product');
    form.set('category', 'API');
    form.append('category_ids', '11111111-1111-4111-8111-111111111111');
    form.set('grade', 'USP, EP');
    form.set('sort_order', '13');
    form.set('active', 'on');
    form.append('applications', 'Application one');
    form.append('applications', 'Application two');
    form.append('documentation', 'COA');
    expect(parseProductForm(form)).toMatchObject({
      slug: 'test-product',
      grade: ['USP', 'EP'],
      applications: ['Application one', 'Application two'],
      documentation: ['COA'],
      active: true,
      featured: false,
    });
  });

  it('rejects an invalid slug', () => {
    expect(productSchema.safeParse({ name: 'A', slug: 'Not Valid', category_ids: ['11111111-1111-4111-8111-111111111111'], grade: [], cas_number: null, overview: '', applications: [], documentation: [], featured: false, active: true, sort_order: 0 }).success).toBe(false);
  });
});
