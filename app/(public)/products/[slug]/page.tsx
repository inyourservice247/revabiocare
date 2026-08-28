import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getActiveProductBySlug } from '@/lib/server/products';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);
  if (!product) notFound();

  const categories = product.categories.filter((category) => category.active);
  const grades = product.grade.filter(Boolean);
  const applications = product.applications.filter(Boolean);
  const documentation = product.documentation.filter(Boolean);
  const enquiryHref = `/contact?requirement=${encodeURIComponent(product.name)}`;

  return (
    <main className="product-detail-page">
      <section className="product-detail-hero">
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/products">Products</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <div className="product-detail-heading">
            <div>
              <p className="eyebrow">Product</p>
              <h1>{product.name}</h1>
              {categories.length > 0 ? <div className="product-category-chips" aria-label="Product categories">{categories.map((category) => <span key={category.id}>{category.name}</span>)}</div> : null}
            </div>
            <Link className="button" href={enquiryHref}>Send Enquiry</Link>
          </div>
        </div>
      </section>

      <section className="product-detail-content">
        <div className="shell product-detail-body">
          {(product.cas_number || grades.length > 0) ? (
            <dl className="product-detail-meta">
              {product.cas_number ? <div><dt>CAS Number</dt><dd>{product.cas_number}</dd></div> : null}
              {grades.length > 0 ? <div><dt>Grade</dt><dd>{grades.join(', ')}</dd></div> : null}
            </dl>
          ) : null}
          {product.overview.trim() ? <section><h2>Overview</h2><p>{product.overview}</p></section> : null}
          {applications.length > 0 ? <section><h2>Applications</h2><ul>{applications.map((application) => <li key={application}>{application}</li>)}</ul></section> : null}
          {documentation.length > 0 ? <section><h2>Documentation</h2><ul>{documentation.map((document) => <li key={document}>{document}</li>)}</ul></section> : null}
        </div>
      </section>

      <section className="product-detail-cta">
        <div className="shell">
          <h2>Discuss this product requirement.</h2>
          <Link className="button" href={enquiryHref}>Send Enquiry</Link>
        </div>
      </section>
    </main>
  );
}
