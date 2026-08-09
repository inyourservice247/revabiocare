import crypto from 'node:crypto';
import { cookies } from 'next/headers';
const cookieName = 'reva_admin_session';
const secret = () => Buffer.from(process.env.ADMIN_SESSION_SECRET || '', 'utf8');
const sign = (value: string) => crypto.createHmac('sha256', secret()).update(value).digest('base64url');
export const safeEqual = (a:string,b:string) => { const x=Buffer.from(a), y=Buffer.from(b); return x.length===y.length && crypto.timingSafeEqual(x,y); };
export async function createSession() { const payload=Buffer.from(JSON.stringify({admin:true,exp:Date.now()+7*864e5})).toString('base64url'); const jar=await cookies(); jar.set(cookieName, `${payload}.${sign(payload)}`, {httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:7*86400}); }
export async function hasSession() { const value=(await cookies()).get(cookieName)?.value; if(!value || !secret().length) return false; const [payload,mac]=value.split('.'); if(!payload||!mac||!safeEqual(mac,sign(payload))) return false; try { return JSON.parse(Buffer.from(payload,'base64url').toString()).exp>Date.now(); } catch { return false; } }
export async function clearSession() { (await cookies()).delete(cookieName); }
