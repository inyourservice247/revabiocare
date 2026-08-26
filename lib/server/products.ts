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
