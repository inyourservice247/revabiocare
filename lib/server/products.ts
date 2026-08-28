import { db } from '@/lib/server/db';

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categories: Array<{ id: string; name: string; slug: string; active: boolean; sort_order: number }>;
  grade: string[];
  cas_number: string | null;
  overview: string;
  applications: string[];
  documentation: string[];
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export type ProductInput = Pick<
  ProductRecord,
  | 'name'
  | 'slug'
  | 'grade'
  | 'cas_number'
  | 'overview'
  | 'applications'
  | 'documentation'
  | 'featured'
  | 'active'
  | 'sort_order'
> & { category_ids: string[] };

const productColumns = `
  p.id, p.name, p.slug, p.category, p.grade, p.cas_number, p.overview, p.applications,
  p.documentation, p.featured, p.active, p.sort_order, p.created_at, p.updated_at,
  COALESCE(jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'active', c.active, 'sort_order', c.sort_order) ORDER BY c.sort_order, c.name) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS categories
`;

const productJoins = 'FROM products p LEFT JOIN product_categories pc ON pc.product_id=p.id LEFT JOIN categories c ON c.id=pc.category_id';

export async function getAllProducts(): Promise<ProductRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${productColumns} ${productJoins} GROUP BY p.id ORDER BY p.sort_order ASC, p.name ASC`) as ProductRecord[];
}

export async function getActiveProducts(): Promise<ProductRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${productColumns} ${productJoins} WHERE p.active = true GROUP BY p.id ORDER BY p.sort_order ASC, p.name ASC`) as ProductRecord[];
}

export async function getActiveProductSitemapEntries(): Promise<Array<{ slug: string; updated_at: Date }>> {
  const sql = db();
  return await sql.query('SELECT slug, updated_at FROM products WHERE active = true ORDER BY slug ASC') as Array<{ slug: string; updated_at: Date }>;
}

export async function getFeaturedActiveProducts(): Promise<ProductRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${productColumns} ${productJoins} WHERE p.active = true AND p.featured = true GROUP BY p.id ORDER BY p.sort_order ASC, p.name ASC`) as ProductRecord[];
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const sql = db();
  const rows = await sql.query(`SELECT ${productColumns} ${productJoins} WHERE p.id = $1 GROUP BY p.id LIMIT 1`, [id]) as ProductRecord[];
  return rows[0] ?? null;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const sql = db();
  const rows = await sql.query(`SELECT ${productColumns} ${productJoins} WHERE p.slug = $1 GROUP BY p.id LIMIT 1`, [slug]) as ProductRecord[];
  return rows[0] ?? null;
}

export async function getActiveProductBySlug(slug: string): Promise<ProductRecord | null> {
  const sql = db();
  const rows = await sql.query(`SELECT ${productColumns} ${productJoins} WHERE p.slug = $1 AND p.active = true GROUP BY p.id LIMIT 1`, [slug]) as ProductRecord[];
  return rows[0] ?? null;
}

export async function createProduct(product: ProductInput): Promise<ProductRecord> {
  const sql = db();
  const categoryRows = await sql.query('SELECT name FROM categories WHERE id = ANY($1::uuid[]) ORDER BY array_position($1::uuid[], id) LIMIT 1', [product.category_ids]) as Array<{ name: string }>;
  const rows = await sql.query(
    `INSERT INTO products (
      name, slug, category, grade, cas_number, overview, applications,
      documentation, featured, active, sort_order
    ) VALUES ($1, $2, $3, $4::text[], $5, $6, $7::text[], $8::text[], $9, $10, $11)
    RETURNING id`,
    [
      product.name,
      product.slug,
      categoryRows[0]?.name ?? '',
      product.grade,
      product.cas_number,
      product.overview,
      product.applications,
      product.documentation,
      product.featured,
      product.active,
      product.sort_order,
    ],
  ) as Array<{ id: string }>;
  await updateProductCategories(rows[0].id, product.category_ids);
  return (await getProductById(rows[0].id))!;
}

export async function updateProduct(id: string, product: ProductInput): Promise<ProductRecord | null> {
  const sql = db();
  const categoryRows = await sql.query('SELECT name FROM categories WHERE id = ANY($1::uuid[]) ORDER BY array_position($1::uuid[], id) LIMIT 1', [product.category_ids]) as Array<{ name: string }>;
  const rows = await sql.query(
    `UPDATE products SET
      name = $2, slug = $3, category = $4, grade = $5::text[], cas_number = $6,
      overview = $7, applications = $8::text[], documentation = $9::text[],
      featured = $10, active = $11, sort_order = $12, updated_at = now()
    WHERE id = $1
    RETURNING id`,
    [
      id,
      product.name,
      product.slug,
      categoryRows[0]?.name ?? '',
      product.grade,
      product.cas_number,
      product.overview,
      product.applications,
      product.documentation,
      product.featured,
      product.active,
      product.sort_order,
    ],
  ) as Array<{ id: string }>;
  if (!rows[0]) return null;
  await updateProductCategories(id, product.category_ids);
  return await getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const sql = db();
  const rows = await sql.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]) as Array<{ id: string }>;
  return rows.length === 1;
}

async function updateProductCategories(productId: string, categoryIds: string[]) {
  const sql = db();
  await sql.query('DELETE FROM product_categories WHERE product_id=$1', [productId]);
  if (categoryIds.length) await sql.query('INSERT INTO product_categories (product_id, category_id) SELECT $1, unnest($2::uuid[]) ON CONFLICT DO NOTHING', [productId, categoryIds]);
}
