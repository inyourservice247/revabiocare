import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0005_human_api_catalogue.sql', 'utf8');
const sourceBlocks = [...migration.matchAll(/\$human_api\$\r?\n([\s\S]*?)\r?\n\$human_api\$/g)];
const names = sourceBlocks[0][1].split(/\r?\n/).filter(Boolean);

describe('Human API catalogue import', () => {
  it('contains the complete source list exactly once per import statement', () => {
    expect(sourceBlocks).toHaveLength(2);
    expect(names).toHaveLength(425);
    expect(new Set(names).size).toBe(425);
    expect(sourceBlocks[1][1]).toBe(sourceBlocks[0][1]);
  });

  it('preserves existing product data and relationships', () => {
    expect(migration.match(/WHERE btrim\(value\) <> ''/g)).toHaveLength(2);
    expect(migration).not.toMatch(/UPDATE products/i);
    expect(migration).not.toMatch(/DELETE FROM product_categories/i);
    expect(migration).toContain('ON CONFLICT (slug) DO NOTHING');
    expect(migration).toContain('ON CONFLICT DO NOTHING');
  });

  it.each(['ACEBROPHYLLINE', 'AZITHROMYCIN', 'GABAPENTIN', 'IBUPROFEN', 'NEBIVOLOL HCL', 'TOPIRAMATE', 'VILDAGLIPTIN'])(
    'contains verification product %s',
    (name) => expect(names).toContain(name),
  );
});
