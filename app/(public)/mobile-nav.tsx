'use client';
import Link from 'next/link'; import { useState } from 'react';
export default function MobileNav({links}:{links:string[][]}){const[open,setOpen]=useState(false);return <><button className="mobile-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="primary-nav">Menu</button><nav id="primary-nav" className={'nav '+(open?'open':'')}>{links.map(([n,h])=><Link key={h} href={h} onClick={()=>setOpen(false)}>{n}</Link>)}<Link className="mobile-nav-cta" href="/contact" onClick={()=>setOpen(false)}>Send a Requirement</Link></nav></>}
