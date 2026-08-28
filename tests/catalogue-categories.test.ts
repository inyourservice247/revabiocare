import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0004_catalogue_categories.sql', 'utf8');
const required = [
  'Human Active Pharmaceutical Ingredients', 'Veterinary APIs', 'Agro Chemicals', 'Pellets',
  'DC Granules', 'Preservatives', 'Enzymes', 'Phytochemicals & Herbal Extracts',
  'Essential Oils', 'Colours & Flavours', 'Excipients',
];

describe('catalogue categories data migration', () => {
  it('contains all required categories in exact display order', () => {
    const positions = required.map(name => migration.indexOf(`('${name}'`));
    expect(positions.every(position => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('is idempotent and only removes unassigned legacy categories', () => {
    expect(migration).toContain('ON CONFLICT (slug) DO UPDATE SET');
    expect(migration).toContain("WHEN 'Pharmaceutical Intermediate' THEN 1001");
    expect(migration).toContain('NOT EXISTS (SELECT 1 FROM product_categories');
  });
});
