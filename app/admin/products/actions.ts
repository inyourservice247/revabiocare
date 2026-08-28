'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { hasSession } from '@/lib/server/auth';
import { createProduct, deleteProduct, updateProduct } from '@/lib/server/products';
import { parseProductForm } from '@/lib/server/product-validation';

export type ProductActionState = {
  message: string;
  errors?: Record<string, string[]>;
};

const unauthorized = async () => {
  if (!await hasSession()) throw new Error('Unauthorized');
};

function errorState(error: unknown): ProductActionState {
  if (error instanceof ZodError) return { message: 'Unable to save product.', errors: error.flatten().fieldErrors as Record<string, string[]> };
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
    return { message: 'Unable to save product.', errors: { slug: ['This slug is already in use.'] } };
  }
  console.error('Product save failed', error instanceof Error ? error.message : 'Unknown error');
  return { message: 'Unable to save product.' };
}

export async function createProductAction(_state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  await unauthorized();
  try {
    await createProduct(parseProductForm(formData));
  } catch (error) {
    return errorState(error);
  }
  revalidatePath('/admin/products');
  redirect('/admin/products?status=saved');
}

export async function updateProductAction(id: string, _state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  await unauthorized();
  try {
    const product = await updateProduct(id, parseProductForm(formData));
    if (!product) return { message: 'Unable to save product.' };
  } catch (error) {
    return errorState(error);
  }
  revalidatePath('/admin/products');
  redirect('/admin/products?status=saved');
}

export async function deleteProductAction(id: string): Promise<{ ok: boolean; message: string }> {
  await unauthorized();
  try {
    const deleted = await deleteProduct(id);
    if (!deleted) return { ok: false, message: 'Unable to delete product.' };
    revalidatePath('/admin/products');
    return { ok: true, message: 'Product deleted.' };
  } catch (error) {
    console.error('Product delete failed', error instanceof Error ? error.message : 'Unknown error');
    return { ok: false, message: 'Unable to delete product.' };
  }
}
