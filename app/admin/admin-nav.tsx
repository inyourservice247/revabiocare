'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  async function logout() {
    const response = await fetch('/api/admin/logout', { method: 'POST' });
    if (response.ok) location.href = '/admin/login';
  }

  return (
    <header className="admin-header">
      <p className="admin-brand">Reva Biocare — Admin</p>
      <nav aria-label="Admin navigation" className="admin-nav">
        <Link aria-current={pathname === '/admin' || pathname.startsWith('/admin/enquiries') ? 'page' : undefined} href="/admin">Enquiry Dashboard</Link>
        <Link aria-current={pathname.startsWith('/admin/products') ? 'page' : undefined} href="/admin/products">Edit Product List</Link>
        <Link aria-current={pathname.startsWith('/admin/categories') ? 'page' : undefined} href="/admin/categories">Manage Categories</Link>
        <button type="button" onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}
