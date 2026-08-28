import Link from 'next/link';
import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/server/auth';
import { getAllCategories } from '@/lib/server/categories';
import DeleteCategoryButton from './delete-button';

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!await hasSession()) redirect('/admin/login');
  const [{ status }, categories] = await Promise.all([searchParams, getAllCategories()]);
  return <main className="admin admin-products"><div className="admin-title-row"><div><p className="admin-kicker">Catalogue management</p><h1>Categories <span>{categories.length}</span></h1></div><Link className="button" href="/admin/categories/new">+ Add Category</Link></div>{status === 'saved' ? <p className="admin-status">Category saved.</p> : null}{status === 'deleted' ? <p className="admin-status">Category deleted.</p> : null}<div className="admin-table-wrap"><table className="admin-product-table"><thead><tr><th>Category Name</th><th>Slug</th><th>Active</th><th>Sort Order</th><th>Product Count</th><th>Actions</th></tr></thead><tbody>{categories.map(category => <tr key={category.id}><td data-label="Category Name"><strong>{category.name}</strong></td><td data-label="Slug">{category.slug}</td><td data-label="Active"><span className={`admin-pill ${category.active ? 'is-yes' : ''}`}>{category.active ? 'Yes' : 'No'}</span></td><td data-label="Sort Order">{category.sort_order}</td><td data-label="Product Count">{category.product_count}</td><td data-label="Actions"><div className="admin-actions"><Link href={`/admin/categories/${category.id}/edit`}>Edit</Link><DeleteCategoryButton id={category.id} name={category.name} /></div></td></tr>)}</tbody></table></div></main>;
}
