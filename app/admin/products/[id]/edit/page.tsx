import { notFound, redirect } from 'next/navigation';
import { hasSession } from '@/lib/server/auth';
import { getProductById } from '@/lib/server/products';
import ProductForm from '../../product-form';
import { updateProductAction } from '../../actions';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!await hasSession()) redirect('/admin/login');
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const action = updateProductAction.bind(null, id);
  return <main className="admin admin-products"><a href="/admin/products">← Products</a><h1>Edit Product</h1><ProductForm action={action} product={product} /></main>;
}
