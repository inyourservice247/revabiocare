import type { Metadata } from 'next';
import { hasSession } from '@/lib/server/auth';
import AdminNav from './admin-nav';
import './admin.css';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await hasSession();
  return <>{authenticated ? <AdminNav /> : null}{children}</>;
}
