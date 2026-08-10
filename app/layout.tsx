import './globals.css';import './prototype.css';import './responsive-fixes.css'; import type { Metadata } from 'next';
export const metadata:Metadata={title:'Reva Biocare',description:'B2B pharmaceutical requirements and enquiries.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
