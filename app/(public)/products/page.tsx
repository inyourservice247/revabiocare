import type { Metadata } from 'next';
import { getActiveProducts } from '@/lib/server/products';
import ProductCatalogue from './product-catalogue';
import { getActiveCategories } from '@/lib/server/categories';
import { publicMetadata } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = publicMetadata({
  title: 'Products',
  description: 'Browse the Reva Biocare catalogue and send a pharmaceutical product requirement.',
  path: '/products',
});

export default async function ProductsPage() {
  const [productRows, categories] = await Promise.all([getActiveProducts(), getActiveCategories()]);
  const products = productRows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    categories: product.categories.filter((category) => category.active).map((category) => ({ id: category.id, name: category.name, slug: category.slug })),
    cas: product.cas_number,
    grades: product.grade,
    description: product.overview,
  }));

  return <ProductCatalogue products={products} categories={categories.map(({ id, name, slug }) => ({ id, name, slug }))} />;
}
