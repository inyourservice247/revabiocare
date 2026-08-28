import { db } from '@/lib/server/db';

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  product_count: number;
};

export type CategoryInput = Pick<CategoryRecord, 'name' | 'slug' | 'active' | 'sort_order'>;

const columns = 'c.id, c.name, c.slug, c.active, c.sort_order, c.created_at, c.updated_at';

export async function getAllCategories(): Promise<CategoryRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${columns}, count(pc.product_id)::int AS product_count FROM categories c LEFT JOIN product_categories pc ON pc.category_id = c.id GROUP BY c.id ORDER BY c.sort_order, c.name`) as CategoryRecord[];
}

export async function getActiveCategories(): Promise<CategoryRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${columns}, count(DISTINCT p.id)::int AS product_count FROM categories c JOIN product_categories pc ON pc.category_id = c.id JOIN products p ON p.id = pc.product_id AND p.active = true WHERE c.active = true GROUP BY c.id HAVING count(DISTINCT p.id) > 0 ORDER BY c.sort_order, c.name`) as CategoryRecord[];
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  const sql = db();
  const rows = await sql.query(`SELECT ${columns}, count(pc.product_id)::int AS product_count FROM categories c LEFT JOIN product_categories pc ON pc.category_id = c.id WHERE c.id = $1 GROUP BY c.id`, [id]) as CategoryRecord[];
  return rows[0] ?? null;
}

export async function createCategory(category: CategoryInput): Promise<CategoryRecord> {
  const sql = db();
  const rows = await sql.query('INSERT INTO categories (name, slug, active, sort_order) VALUES ($1, $2, $3, $4) RETURNING id, name, slug, active, sort_order, created_at, updated_at, 0::int AS product_count', [category.name, category.slug, category.active, category.sort_order]) as CategoryRecord[];
  return rows[0];
}

export async function updateCategory(id: string, category: CategoryInput): Promise<CategoryRecord | null> {
  const sql = db();
  const rows = await sql.query('UPDATE categories SET name=$2, slug=$3, active=$4, sort_order=$5, updated_at=now() WHERE id=$1 RETURNING id, name, slug, active, sort_order, created_at, updated_at, (SELECT count(*)::int FROM product_categories WHERE category_id=$1) AS product_count', [id, category.name, category.slug, category.active, category.sort_order]) as CategoryRecord[];
  if (rows[0]) await sql.query('UPDATE products SET category=$2, updated_at=now() WHERE id IN (SELECT product_id FROM product_categories WHERE category_id=$1)', [id, category.name]);
  return rows[0] ?? null;
}

export async function deleteCategory(id: string): Promise<{ deleted: boolean; productCount: number }> {
  const sql = db();
  const countRows = await sql.query('SELECT count(*)::int AS count FROM product_categories WHERE category_id=$1', [id]) as Array<{ count: number }>;
  const productCount = countRows[0]?.count ?? 0;
  if (productCount > 0) return { deleted: false, productCount };
  const rows = await sql.query('DELETE FROM categories WHERE id=$1 RETURNING id', [id]) as Array<{ id: string }>;
  return { deleted: rows.length === 1, productCount: 0 };
}

export async function getCategoriesForProduct(productId: string) {
  const sql = db();
  return await sql.query('SELECT c.id, c.name, c.slug, c.active, c.sort_order FROM categories c JOIN product_categories pc ON pc.category_id=c.id WHERE pc.product_id=$1 ORDER BY c.sort_order,c.name', [productId]) as Array<Pick<CategoryRecord, 'id' | 'name' | 'slug' | 'active' | 'sort_order'>>;
}

export async function updateProductCategories(productId: string, categoryIds: string[]) {
  const sql = db();
  await sql.query('DELETE FROM product_categories WHERE product_id=$1', [productId]);
  if (categoryIds.length) await sql.query('INSERT INTO product_categories (product_id, category_id) SELECT $1, unnest($2::uuid[]) ON CONFLICT DO NOTHING', [productId, categoryIds]);
}
