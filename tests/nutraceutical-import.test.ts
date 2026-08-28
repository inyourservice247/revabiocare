import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0008_nutraceutical_portfolio.sql', 'utf8');
const sourceBlocks = [...migration.matchAll(/\$nutraceutical\$\r?\n([\s\S]*?)\r?\n\$nutraceutical\$/g)];
const entries = sourceBlocks[0][1].split(/\r?\n/).filter(Boolean);
const countFor = (slug: string) => entries.filter((entry) => entry.startsWith(slug + '|')).length;

describe('Nutraceutical Ingredients Portfolio import', () => {
  it('contains the complete deduplicated source dataset', () => {
    expect(sourceBlocks).toHaveLength(2);
    expect(entries).toHaveLength(64);
    expect(new Set(entries).size).toBe(64);
    expect(sourceBlocks[1][1]).toBe(sourceBlocks[0][1]);
    expect(countFor('specialty-ingredients')).toBe(8);
    expect(countFor('vitamins-coenzymes')).toBe(6);
    expect(countFor('amino-acids-protein-derivatives')).toBe(17);
    expect(countFor('phytochemicals-herbal-extracts')).toBe(10);
    expect(countFor('joint-skin-bone-health')).toBe(3);
    expect(countFor('digestive-urinary-health-ingredients')).toBe(1);
    expect(countFor('sweeteners-food-beverage-applications')).toBe(3);
    expect(countFor('antioxidants-specialty-nutraceuticals')).toBe(4);
    expect(countFor('sports-nutrition-ingredients')).toBe(2);
    expect(countFor('eye-health-ingredients')).toBe(3);
    expect(countFor('excipients-functional-ingredients')).toBe(6);
    expect(countFor('omega-specialty-lipids')).toBe(1);
  });

  it('preserves existing products, categories, and relationships', () => {
    expect(migration).not.toMatch(/UPDATE products/i);
    expect(migration).not.toMatch(/DELETE FROM product_categories/i);
    expect(migration).not.toContain("('Herbal Extracts & Phytochemicals'");
    expect(migration).not.toContain("('Nutraceutical Ingredients Portfolio'");
    expect(migration).toContain("('Excipients & Functional Ingredients', 'excipients-functional-ingredients'");
    expect(migration).toContain('ON CONFLICT (slug) DO NOTHING');
    expect(migration).toContain('ON CONFLICT DO NOTHING');
  });

  it('handles source duplicates and multi-category reuse explicitly', () => {
    expect(entries.filter((entry) => entry.endsWith('|L-Tyrosine'))).toHaveLength(1);
    expect(entries.filter((entry) => entry.endsWith('|D Xylose'))).toHaveLength(1);
    expect(entries.filter((entry) => entry.endsWith('|D-Xylose'))).toHaveLength(0);
    expect(entries.filter((entry) => entry.endsWith('|Alpha Lipoic Acid'))).toHaveLength(2);
  });

  it('keeps protected near-duplicate forms as separate source products', () => {
    expect(entries).toContain('specialty-ingredients|Berberine Extract 97%');
    expect(entries).toContain('joint-skin-bone-health|Glucosamine HCL / Sulphate');
    expect(entries).toContain('phytochemicals-herbal-extracts|Resveratrol');
    expect(entries).toContain('phytochemicals-herbal-extracts|Trans Resveratrol');
    expect(entries).toContain('phytochemicals-herbal-extracts|Resveratrol 50%');
    expect(entries).toContain('amino-acids-protein-derivatives|L-Arginine Base');
    expect(entries).toContain('amino-acids-protein-derivatives|L-Arginine HCL');
  });
});
