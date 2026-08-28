import './globals.css';import './prototype.css';import './responsive-fixes.css'; import type { Metadata } from 'next';import{SITE_DESCRIPTION,SITE_NAME,SITE_URL}from'@/lib/site';
export const metadata:Metadata={metadataBase:SITE_URL,title:{default:SITE_NAME,template:`%s | ${SITE_NAME}`},description:SITE_DESCRIPTION};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
