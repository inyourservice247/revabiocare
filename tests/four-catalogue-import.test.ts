import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0006_four_catalogue_categories.sql', 'utf8');
const sourceBlocks = [...migration.matchAll(/\$catalogue\$\r?\n([\s\S]*?)\r?\n\$catalogue\$/g)];
const entries = sourceBlocks[0][1].split(/\r?\n/).filter(Boolean);
const countFor = (slug: string) => entries.filter((entry) => entry.startsWith(slug + '|')).length;

describe('four-category catalogue import', () => {
  it('contains the complete authoritative source dataset', () => {
    expect(sourceBlocks).toHaveLength(2);
    expect(entries).toHaveLength(47);
    expect(new Set(entries).size).toBe(47);
    expect(sourceBlocks[1][1]).toBe(sourceBlocks[0][1]);
    expect(countFor('veterinary-apis')).toBe(16);
    expect(countFor('agro-chemicals')).toBe(16);
    expect(countFor('pellets')).toBe(9);
    expect(countFor('dc-granules')).toBe(6);
  });

  it('preserves existing product rows and category relationships', () => {
    expect(migration).not.toMatch(/UPDATE products/i);
    expect(migration).not.toMatch(/DELETE FROM product_categories/i);
    expect(migration).toContain('ON CONFLICT (slug) DO NOTHING');
    expect(migration).toContain('ON CONFLICT DO NOTHING');
  });

  it('keeps intentionally distinct source names', () => {
    expect(entries).toContain('pellets|LANSOPRAZOLE');
    expect(entries).toContain('pellets|PANTOPRAZOLE SODIUM');
    expect(entries).toContain('pellets|TAMSULOSIN');
    expect(entries).toContain('dc-granules|CIPROFLOXCIN');
  });
});

