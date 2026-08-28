'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCategoryAction } from './actions';

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false); const [message, setMessage] = useState(''); const [pending, startTransition] = useTransition(); const router = useRouter();
  const remove = () => startTransition(async () => { const result = await deleteCategoryAction(id); setMessage(result.message); if (result.ok) { setConfirming(false); router.replace('/admin/categories?status=deleted'); router.refresh(); } });
  return <><button className="admin-link-button danger" onClick={() => { setConfirming(true); setMessage(''); }}>Delete</button>{confirming ? <div className="admin-dialog-backdrop"><div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby={`delete-category-${id}`}><h2 id={`delete-category-${id}`}>Delete “{name}”?</h2>{message ? <p className="admin-status admin-status-error" role="alert">{message}</p> : <p>The category can be deleted only when no products are assigned.</p>}<div className="admin-form-actions"><button disabled={pending} onClick={() => setConfirming(false)}>Cancel</button><button className="button danger-button" disabled={pending} onClick={remove}>{pending ? 'Deleting…' : 'Delete Category'}</button></div></div></div> : null}</>;
}
