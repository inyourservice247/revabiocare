'use client';

import { useState } from 'react';

export default function ReadToggle({ id, initial }: { id: string; initial: boolean }) {
  const [isRead, setIsRead] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    const response = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isRead: !isRead }),
    });
    if (response.ok) setIsRead(!isRead);
    setPending(false);
  }

  return <button className="button" type="button" onClick={toggle} disabled={pending}>{pending ? 'Saving…' : `Mark ${isRead ? 'unread' : 'read'}`}</button>;
}
