'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  categories: Array<{ id: string; name: string; slug: string }>;
  cas: string | null;
  grades: string[];
  description: string;
};

type PublicCategory = { id: string; name: string; slug: string };

export default function ProductCatalogue({ products, categories }: { products: PublicProduct[]; categories: PublicCategory[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = category === 'All' || product.categories.some((item) => item.id === category);
      const searchable = [product.name, ...product.categories.map((item) => item.name), product.cas, ...product.grades].filter(Boolean).join(' ').toLowerCase();
      return inCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [products, query, category]);

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <main className="page catalogue-page">
      <div className="shell">
        <p className="eyebrow">PRODUCTS</p>
        <h1>Find the product. Start the conversation.</h1>
        <p className="lede">Search the product catalogue by name or category.</p>
        <div className="catalogue-controls">
          <label className="catalogue-search-label" htmlFor="catalogue-search">Search products</label>
          <input id="catalogue-search" className="catalogue-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
          <div className="filters" aria-label="Product categories">
            {[{ id: 'All', name: 'All', slug: 'all' }, ...categories].map((item) => {
              const selected = item.id === category;
              return <button key={item.id} className={selected ? 'filter-active' : undefined} aria-pressed={selected} onClick={() => setCategory(item.id)}>{item.name}</button>;
            })}
          </div>
        </div>
        <p className="result-count" role="status" aria-live="polite" aria-atomic="true">{rows.length} {rows.length === 1 ? 'product' : 'products'}</p>
        {rows.length > 0 ? (
          <div className="catalogue-grid" data-result-count={Math.min(rows.length, 3)}>
            {rows.map((product) => (
              <article className="card product-card" key={product.id} data-product-slug={product.slug}>
                <p className="eyebrow">{product.categories.map((item) => item.name).join(' · ')}</p>
                <h3>{product.name}</h3>
                {(product.cas || product.grades.length > 0) && <dl className="product-meta">{product.cas && <><dt>CAS</dt><dd>{product.cas}</dd></>}{product.grades.length > 0 && <><dt>Grades</dt><dd>{product.grades.join(', ')}</dd></>}</dl>}
                <p className="product-description">{product.description}</p>
                <Link className="product-action" href={`/contact?requirement=${encodeURIComponent(product.name)}`}>Send Requirement →</Link>
              </article>
            ))}
          </div>
        ) : <div className="no-results" role="status"><h2>No products match your search.</h2><button className="button" onClick={clearFilters}>Clear filters</button></div>}
      </div>
    </main>
  );
}
