import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0010_catalogue_integrity_cleanup.sql', 'utf8');

describe('catalogue integrity cleanup', () => {
  it('targets only the two verified-empty legacy categories', () => {
    expect(migration).toContain("'pharmaceutical-intermediate'");
    expect(migration).toContain("'nutraceutical-ingredient'");
    expect(migration.match(/DELETE FROM categories/gi)).toHaveLength(1);
  });

  it('refuses to remove categories used by relationships or legacy product references', () => {
    expect(migration).toContain('FROM product_categories relationship');
    expect(migration).toContain('relationship.category_id = category.id');
    expect(migration).toContain('FROM products product');
    expect(migration).toContain('product.category = category.name');
  });

  it('never deletes or updates products and relationships', () => {
    expect(migration).not.toMatch(/DELETE FROM products/i);
    expect(migration).not.toMatch(/DELETE FROM product_categories/i);
    expect(migration).not.toMatch(/UPDATE products/i);
  });
});
