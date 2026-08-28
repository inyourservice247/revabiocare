'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProductAction } from './actions';

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function remove() {
    startTransition(async () => {
      const result = await deleteProductAction(id);
      setMessage(result.message);
      if (result.ok) {
        setConfirming(false);
        router.replace('/admin/products?status=deleted');
        router.refresh();
      }
    });
  }

  return (
    <>
      <button className="admin-link-button danger" type="button" onClick={() => { setConfirming(true); setMessage(''); }}>Delete</button>
      {confirming ? (
        <div className="admin-dialog-backdrop" role="presentation">
          <div aria-labelledby={`delete-title-${id}`} aria-modal="true" className="admin-dialog" role="dialog">
            <h2 id={`delete-title-${id}`}>Delete “{name}”?</h2>
            <p>This removes the product from Neon.</p>
            {message ? <p className="admin-status admin-status-error" role="alert">{message}</p> : null}
            <div className="admin-form-actions">
              <button type="button" disabled={pending} onClick={() => setConfirming(false)}>Cancel</button>
              <button className="button danger-button" type="button" disabled={pending} onClick={remove}>{pending ? 'Deleting…' : 'Delete Product'}</button>
            </div>
          </div>
        </div>
      ) : null}
      {!confirming && message ? <span className="admin-inline-status" role="status">{message}</span> : null}
    </>
  );
}
