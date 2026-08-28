import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('db/migrations/0003_categories.sql', 'utf8');

describe('categories migration', () => {
  it('creates category and many-to-many relationship tables', () => {
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS categories');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS product_categories');
    expect(migration).toContain('PRIMARY KEY (product_id, category_id)');
  });

  it('migrates legacy categories idempotently', () => {
    expect(migration).toContain('SELECT category');
    expect(migration.match(/ON CONFLICT DO NOTHING/g)).toHaveLength(2);
  });
});
