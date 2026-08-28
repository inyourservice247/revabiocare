import { db } from '@/lib/server/db';

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  category: string;
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
  | 'category'
  | 'grade'
  | 'cas_number'
  | 'overview'
  | 'applications'
  | 'documentation'
  | 'featured'
  | 'active'
  | 'sort_order'
>;

const productColumns = `
  id, name, slug, category, grade, cas_number, overview, applications,
  documentation, featured, active, sort_order, created_at, updated_at
`;

export async function getAllProducts(): Promise<ProductRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${productColumns} FROM products ORDER BY sort_order ASC, name ASC`) as ProductRecord[];
}

export async function getActiveProducts(): Promise<ProductRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${productColumns} FROM products WHERE active = true ORDER BY sort_order ASC, name ASC`) as ProductRecord[];
}

export async function getFeaturedActiveProducts(): Promise<ProductRecord[]> {
  const sql = db();
  return await sql.query(`SELECT ${productColumns} FROM products WHERE active = true AND featured = true ORDER BY sort_order ASC, name ASC`) as ProductRecord[];
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const sql = db();
  const rows = await sql.query(`SELECT ${productColumns} FROM products WHERE id = $1 LIMIT 1`, [id]) as ProductRecord[];
  return rows[0] ?? null;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const sql = db();
  const rows = await sql.query(`SELECT ${productColumns} FROM products WHERE slug = $1 LIMIT 1`, [slug]) as ProductRecord[];
  return rows[0] ?? null;
}

export async function createProduct(product: ProductInput): Promise<ProductRecord> {
  const sql = db();
  const rows = await sql.query(
    `INSERT INTO products (
      name, slug, category, grade, cas_number, overview, applications,
      documentation, featured, active, sort_order
    ) VALUES ($1, $2, $3, $4::text[], $5, $6, $7::text[], $8::text[], $9, $10, $11)
    RETURNING ${productColumns}`,
    [
      product.name,
      product.slug,
      product.category,
      product.grade,
      product.cas_number,
      product.overview,
      product.applications,
      product.documentation,
      product.featured,
      product.active,
      product.sort_order,
    ],
  ) as ProductRecord[];
  return rows[0];
}

export async function updateProduct(id: string, product: ProductInput): Promise<ProductRecord | null> {
  const sql = db();
  const rows = await sql.query(
    `UPDATE products SET
      name = $2, slug = $3, category = $4, grade = $5::text[], cas_number = $6,
      overview = $7, applications = $8::text[], documentation = $9::text[],
      featured = $10, active = $11, sort_order = $12, updated_at = now()
    WHERE id = $1
    RETURNING ${productColumns}`,
    [
      id,
      product.name,
      product.slug,
      product.category,
      product.grade,
      product.cas_number,
      product.overview,
      product.applications,
      product.documentation,
      product.featured,
      product.active,
      product.sort_order,
    ],
  ) as ProductRecord[];
  return rows[0] ?? null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const sql = db();
  const rows = await sql.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]) as Array<{ id: string }>;
  return rows.length === 1;
}
