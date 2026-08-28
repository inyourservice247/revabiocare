import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0009_phytochemicals_catalogue.sql', 'utf8');
const sourceBlocks = [...migration.matchAll(/\$phytochemicals\$\r?\n([\s\S]*?)\r?\n\$phytochemicals\$/g)];
const names = sourceBlocks[0][1].split(/\r?\n/).filter(Boolean);

describe('Phytochemicals & Herbal Extracts catalogue import', () => {
  it('contains all 24 authoritative supplied names', () => {
    expect(sourceBlocks).toHaveLength(2);
    expect(names).toHaveLength(24);
    expect(new Set(names).size).toBe(24);
    expect(sourceBlocks[1][1]).toBe(sourceBlocks[0][1]);
  });

  it('reuses the existing category and preserves all prior data', () => {
    expect(migration).not.toMatch(/INSERT INTO categories/i);
    expect(migration).not.toMatch(/UPDATE products/i);
    expect(migration).not.toMatch(/DELETE FROM product_categories/i);
    expect(migration).toContain("categories.slug = 'phytochemicals-herbal-extracts'");
    expect(migration).toContain('ON CONFLICT (slug) DO NOTHING');
    expect(migration).toContain('ON CONFLICT DO NOTHING');
  });

  it('preserves supplied spellings and distinct strengths', () => {
    expect(names).toContain('HOLI BASIL');
    expect(names).toContain('GARCINIA COMBOGIA');
    expect(names).toContain('CALCIUM SENNOSIDE 10%');
    expect(names).toContain('CALCIUM SENNOSIDE 60%');
    expect(names.filter((name) => name.startsWith('CALCIUM SENNOSIDE'))).toHaveLength(2);
  });

  it.each(['ASHWAGANDHA', 'CURCUMIN 95%', 'COLCHICINE', 'QUININE SULPHATE', 'GYMNEMA SYLVESTRE'])(
    'contains representative product %s',
    (name) => expect(names).toContain(name),
  );
});
