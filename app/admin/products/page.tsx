import Link from 'next/link';
import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/server/auth';
import { getAllProducts } from '@/lib/server/products';
import DeleteButton from './delete-button';

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  if (!await hasSession()) redirect('/admin/login');
  const { q: rawQuery, status } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const products = await getAllProducts();
  const filtered = query ? products.filter((product) => product.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : products;

  return (
    <main className="admin admin-products">
      <div className="admin-title-row">
        <div><p className="admin-kicker">Catalogue management</p><h1>Products <span>{products.length}</span></h1></div>
        <Link className="button" href="/admin/products/new">+ Add Product</Link>
      </div>
      {status === 'saved' ? <p className="admin-status" role="status">Product saved.</p> : null}
      {status === 'deleted' ? <p className="admin-status" role="status">Product deleted.</p> : null}
      <form className="admin-search" role="search">
        <label className="sr-only" htmlFor="product-search">Search products</label>
        <input id="product-search" name="q" defaultValue={query} placeholder="Search products..." />
        <button type="submit">Search</button>
        {query ? <Link href="/admin/products">Clear</Link> : null}
      </form>
      <p className="admin-result-count">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</p>
      <div className="admin-table-wrap">
        <table className="admin-product-table">
          <thead><tr><th>Product Name</th><th>Category</th><th>Grade</th><th>Active</th><th>Featured</th><th>Sort Order</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td data-label="Product Name"><strong>{product.name}</strong></td>
                <td data-label="Category">{product.categories.map((category) => category.name).join(', ') || '—'}</td>
                <td data-label="Grade">{product.grade.join(', ') || '—'}</td>
                <td data-label="Active"><span className={`admin-pill ${product.active ? 'is-yes' : ''}`}>{product.active ? 'Yes' : 'No'}</span></td>
                <td data-label="Featured"><span className={`admin-pill ${product.featured ? 'is-yes' : ''}`}>{product.featured ? 'Yes' : 'No'}</span></td>
                <td data-label="Sort Order">{product.sort_order}</td>
                <td data-label="Actions"><div className="admin-actions"><Link href={`/admin/products/${product.id}/edit`}>Edit</Link><DeleteButton id={product.id} name={product.name} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length ? <p className="admin-empty">No products match “{query}”.</p> : null}
    </main>
  );
}
