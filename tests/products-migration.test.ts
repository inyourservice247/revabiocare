import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { products } from '../data/demo-content';

const migration = readFileSync('db/migrations/0002_products.sql', 'utf8');

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

describe('products migration', () => {
  it('contains every current catalogue product exactly once in display order', () => {
    const insertSection = migration.slice(migration.indexOf('VALUES'), migration.indexOf('ON CONFLICT'));
    const positions = products.map((product) => insertSection.indexOf(`'${slugify(product.name)}'`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect((insertSection.match(/^  \('/gm) ?? []).length).toBe(products.length);
  });

  it('is duplicate-safe on slug', () => {
    expect(migration).toContain('slug text NOT NULL UNIQUE');
    expect(migration).toContain('ON CONFLICT (slug) DO UPDATE SET');
  });
});
