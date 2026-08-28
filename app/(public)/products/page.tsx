import { getActiveProducts } from '@/lib/server/products';
import ProductCatalogue from './product-catalogue';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = (await getActiveProducts()).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    cas: product.cas_number,
    grades: product.grade,
    description: product.overview,
  }));

  return <ProductCatalogue products={products} />;
}
