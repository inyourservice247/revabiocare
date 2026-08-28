import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/server/auth';
import ProductForm from '../product-form';
import { createProductAction } from '../actions';

export default async function NewProductPage() {
  if (!await hasSession()) redirect('/admin/login');
  return <main className="admin admin-products"><a href="/admin/products">← Products</a><h1>Add Product</h1><ProductForm action={createProductAction} /></main>;
}
