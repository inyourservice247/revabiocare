import { z } from 'zod';
import type { CategoryInput } from './categories';
import { slugifyProductName } from './product-validation';

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120),
  slug: z.string().trim().min(1, 'Slug is required.').max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(1_000_000),
});

export function parseCategoryForm(formData: FormData): CategoryInput {
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  return categorySchema.parse({ name, slug: slug || slugifyProductName(name), active: formData.get('active') === 'on', sort_order: Number(formData.get('sort_order') ?? 0) });
}
