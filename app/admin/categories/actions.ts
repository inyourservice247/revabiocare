'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { hasSession } from '@/lib/server/auth';
import { createCategory, deleteCategory, updateCategory } from '@/lib/server/categories';
import { parseCategoryForm } from '@/lib/server/category-validation';

export type CategoryActionState = { message: string; errors?: Record<string, string[]> };
const authorize = async () => { if (!await hasSession()) throw new Error('Unauthorized'); };
const refresh = () => { revalidatePath('/admin/categories'); revalidatePath('/admin/products'); revalidatePath('/products'); revalidatePath('/'); };

function failure(error: unknown): CategoryActionState {
  if (error instanceof ZodError) return { message: 'Unable to save category.', errors: error.flatten().fieldErrors as Record<string, string[]> };
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') return { message: 'Unable to save category.', errors: { name: ['Category name and slug must be unique.'], slug: ['Category name and slug must be unique.'] } };
  console.error('Category save failed', error instanceof Error ? error.message : 'Unknown error');
  return { message: 'Unable to save category.' };
}

export async function createCategoryAction(_state: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  await authorize();
  try { await createCategory(parseCategoryForm(formData)); } catch (error) { return failure(error); }
  refresh(); redirect('/admin/categories?status=saved');
}

export async function updateCategoryAction(id: string, _state: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  await authorize();
  try { if (!await updateCategory(id, parseCategoryForm(formData))) return { message: 'Unable to save category.' }; } catch (error) { return failure(error); }
  refresh(); redirect('/admin/categories?status=saved');
}

export async function deleteCategoryAction(id: string) {
  await authorize();
  try {
    const result = await deleteCategory(id);
    if (result.productCount > 0) return { ok: false, message: `This category is assigned to ${result.productCount} ${result.productCount === 1 ? 'product' : 'products'}. Reassign or remove those category assignments before deleting it.` };
    if (!result.deleted) return { ok: false, message: 'Unable to delete category.' };
    refresh(); return { ok: true, message: 'Category deleted.' };
  } catch (error) { console.error('Category delete failed', error instanceof Error ? error.message : 'Unknown error'); return { ok: false, message: 'Unable to delete category.' }; }
}
