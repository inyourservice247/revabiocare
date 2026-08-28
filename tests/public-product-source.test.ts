import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public product data source', () => {
  it('loads the catalogue from active Neon products', () => {
    const page = readFileSync('app/(public)/products/page.tsx', 'utf8');
    expect(page).toContain('getActiveProducts');
    expect(page).not.toContain("@/data/demo-content");
  });

  it('loads homepage featured products from Neon', () => {
    const page = readFileSync('app/(public)/page.tsx', 'utf8');
    expect(page).toContain('getFeaturedActiveProducts');
    expect(page).not.toMatch(/import\s*{[^}]*products[^}]*}\s*from\s*['"]@\/data\/demo-content/);
  });
});
