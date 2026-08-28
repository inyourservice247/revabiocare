import { z } from 'zod';
import type { ProductInput } from '@/lib/server/products';

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(200),
  slug: z.string().trim().min(1, 'Slug is required.').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  category_ids: z.array(z.string().uuid()).min(1, 'Select at least one category.').max(30),
  grade: z.array(z.string().trim().min(1).max(120)).max(30),
  cas_number: z.string().trim().max(100).nullable(),
  overview: z.string().trim().max(3000),
  applications: z.array(z.string().trim().min(1).max(500)).max(50),
  documentation: z.array(z.string().trim().min(1).max(500)).max(50),
  featured: z.boolean(),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(1_000_000),
});

export function slugifyProductName(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function values(formData: FormData, name: string) {
  return formData.getAll(name).map(String).map((value) => value.trim()).filter(Boolean);
}

export function parseProductForm(formData: FormData): ProductInput {
  const name = String(formData.get('name') ?? '').trim();
  const rawSlug = String(formData.get('slug') ?? '').trim();
  const result = productSchema.parse({
    name,
    slug: rawSlug || slugifyProductName(name),
    category_ids: formData.getAll('category_ids').map(String),
    grade: String(formData.get('grade') ?? '').split(/[\n,]+/).map((value) => value.trim()).filter(Boolean),
    cas_number: String(formData.get('cas_number') ?? '').trim() || null,
    overview: String(formData.get('overview') ?? ''),
    applications: values(formData, 'applications'),
    documentation: values(formData, 'documentation'),
    featured: formData.get('featured') === 'on',
    active: formData.get('active') === 'on',
    sort_order: Number(formData.get('sort_order') ?? 0),
  });
  return result;
}
