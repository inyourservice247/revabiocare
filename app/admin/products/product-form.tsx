'use client';

import { useActionState, useState } from 'react';
import type { ProductRecord } from '@/lib/server/products';
import type { ProductActionState } from './actions';

type Action = (state: ProductActionState, formData: FormData) => Promise<ProductActionState>;
const initialState: ProductActionState = { message: '' };
const slugify = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function RepeatingFields({ label, name, initial }: { label: string; name: string; initial: string[] }) {
  const [items, setItems] = useState(initial.length ? initial : ['']);
  return (
    <fieldset className="admin-repeat">
      <legend>{label}</legend>
      {items.map((item, index) => (
        <div className="admin-repeat-row" key={index}>
          <input aria-label={`${label} ${index + 1}`} defaultValue={item} name={name} />
          <button type="button" onClick={() => setItems((current) => current.length === 1 ? [''] : current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
        </div>
      ))}
      <button className="admin-text-button" type="button" onClick={() => setItems((current) => [...current, ''])}>+ Add {label === 'Applications' ? 'application' : 'documentation item'}</button>
    </fieldset>
  );
}

export default function ProductForm({ action, product }: { action: Action; product?: ProductRecord }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const error = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="admin-product-form">
      <div className="admin-field">
        <label htmlFor="product-name">Name *</label>
        <input id="product-name" name="name" required maxLength={200} defaultValue={product?.name ?? ''} aria-invalid={Boolean(error('name'))} onChange={(event) => { if (!slugEdited) setSlug(slugify(event.target.value)); }} />
        {error('name') ? <p className="admin-field-error">{error('name')}</p> : null}
      </div>
      <div className="admin-field">
        <label htmlFor="product-slug">Slug</label>
        <input id="product-slug" name="slug" required maxLength={200} value={slug} aria-invalid={Boolean(error('slug'))} onChange={(event) => { setSlugEdited(true); setSlug(event.target.value); }} />
        {error('slug') ? <p className="admin-field-error">{error('slug')}</p> : null}
      </div>
      <div className="admin-field">
        <label htmlFor="product-category">Category *</label>
        <input id="product-category" name="category" required maxLength={120} defaultValue={product?.category ?? ''} aria-invalid={Boolean(error('category'))} />
        {error('category') ? <p className="admin-field-error">{error('category')}</p> : null}
      </div>
      <div className="admin-field">
        <label htmlFor="product-grade">Grade <span>(separate multiple values with commas)</span></label>
        <input id="product-grade" name="grade" defaultValue={product?.grade.join(', ') ?? ''} />
      </div>
      <div className="admin-field">
        <label htmlFor="product-cas">CAS Number</label>
        <input id="product-cas" name="cas_number" maxLength={100} defaultValue={product?.cas_number ?? ''} />
      </div>
      <div className="admin-field admin-field-wide">
        <label htmlFor="product-overview">Overview</label>
        <textarea id="product-overview" name="overview" maxLength={3000} defaultValue={product?.overview ?? ''} />
      </div>
      <RepeatingFields label="Applications" name="applications" initial={product?.applications ?? []} />
      <RepeatingFields label="Documentation" name="documentation" initial={product?.documentation ?? []} />
      <div className="admin-field">
        <label htmlFor="product-sort">Sort Order</label>
        <input id="product-sort" name="sort_order" type="number" min="0" max="1000000" step="1" defaultValue={product?.sort_order ?? 0} required />
      </div>
      <div className="admin-checks">
        <label><input name="active" type="checkbox" defaultChecked={product?.active ?? true} /> Active</label>
        <label><input name="featured" type="checkbox" defaultChecked={product?.featured ?? false} /> Featured</label>
      </div>
      <div className="admin-form-actions">
        <button className="button" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save Product'}</button>
        <a href="/admin/products">Cancel</a>
      </div>
      {state.message ? <p className="admin-status admin-status-error" role="alert">{state.message}</p> : null}
    </form>
  );
}
