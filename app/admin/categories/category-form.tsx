'use client';
import { useActionState, useState } from 'react';
import type { CategoryRecord } from '@/lib/server/categories';
import type { CategoryActionState } from './actions';

const initial: CategoryActionState = { message: '' };
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function CategoryForm({ action, category }: { action: (state: CategoryActionState, formData: FormData) => Promise<CategoryActionState>; category?: CategoryRecord }) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [edited, setEdited] = useState(Boolean(category));
  const error = (field: string) => state.errors?.[field]?.[0];
  return <form action={formAction} className="admin-product-form"><div className="admin-field"><label htmlFor="category-name">Name *</label><input id="category-name" name="name" required maxLength={120} defaultValue={category?.name ?? ''} aria-invalid={Boolean(error('name'))} onChange={event => { if (!edited) setSlug(slugify(event.target.value)); }} />{error('name') ? <p className="admin-field-error">{error('name')}</p> : null}</div><div className="admin-field"><label htmlFor="category-slug">Slug</label><input id="category-slug" name="slug" required maxLength={120} value={slug} aria-invalid={Boolean(error('slug'))} onChange={event => { setEdited(true); setSlug(event.target.value); }} />{error('slug') ? <p className="admin-field-error">{error('slug')}</p> : null}</div><div className="admin-field"><label htmlFor="category-sort">Sort Order</label><input id="category-sort" name="sort_order" type="number" min="0" max="1000000" required defaultValue={category?.sort_order ?? 0} /></div><div className="admin-checks"><label><input name="active" type="checkbox" defaultChecked={category?.active ?? true} /> Active</label></div><div className="admin-form-actions"><button className="button" disabled={pending}>{pending ? 'Saving…' : 'Save Category'}</button><a href="/admin/categories">Cancel</a></div>{state.message ? <p className="admin-status admin-status-error" role="alert">{state.message}</p> : null}</form>;
}
