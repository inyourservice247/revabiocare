import type { Metadata } from 'next';
import { publicMetadata } from '@/lib/site';

export const metadata: Metadata = publicMetadata({
  title: 'Send a Requirement',
  description: 'Send Reva Biocare a pharmaceutical product or commercial requirement.',
  path: '/contact',
});

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
