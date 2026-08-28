import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0007_remaining_original_catalogue.sql', 'utf8');
const sourceBlocks = [...migration.matchAll(/\$catalogue\$\r?\n([\s\S]*?)\r?\n\$catalogue\$/g)];
const entries = sourceBlocks[0][1].split(/\r?\n/).filter(Boolean);
const countFor = (slug: string) => entries.filter((entry) => entry.startsWith(slug + '|')).length;

describe('remaining original catalogue import', () => {
  it('imports only the five complete supplied categories', () => {
    expect(sourceBlocks).toHaveLength(2);
    expect(entries).toHaveLength(69);
    expect(sourceBlocks[1][1]).toBe(sourceBlocks[0][1]);
    expect(countFor('preservatives')).toBe(10);
    expect(countFor('enzymes')).toBe(5);
    expect(countFor('essential-oils')).toBe(7);
    expect(countFor('colours-flavours')).toBe(7);
    expect(countFor('excipients')).toBe(40);
    expect(countFor('phytochemicals-herbal-extracts')).toBe(0);
  });

  it('preserves existing products and relationships', () => {
    expect(migration).not.toMatch(/UPDATE products/i);
    expect(migration).not.toMatch(/DELETE FROM product_categories/i);
    expect(migration).toContain('ON CONFLICT (slug) DO NOTHING');
    expect(migration).toContain('ON CONFLICT DO NOTHING');
  });

  it('keeps multi-category source entries without duplicate product rows', () => {
    expect(entries.filter((entry) => entry.endsWith('|METHYL PARABEN'))).toHaveLength(2);
    expect(entries.filter((entry) => entry.endsWith('|PROPYL PARABEN'))).toHaveLength(2);
  });
});

