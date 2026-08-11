'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

function Navigation({ links }: { links: string[][] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) window.requestAnimationFrame(() => buttonRef.current?.focus());
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const updateMenuTop = () => {
      const header = buttonRef.current?.closest('header');
      if (header) document.documentElement.style.setProperty('--mobile-menu-top', `${header.getBoundingClientRect().bottom}px`);
    };
    const focusable = () => [buttonRef.current, ...Array.from(navRef.current?.querySelectorAll<HTMLAnchorElement>('a') || [])].filter(Boolean) as HTMLElement[];
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    updateMenuTop();
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', updateMenuTop);
    document.addEventListener('keydown', onKeyDown);
    window.requestAnimationFrame(() => navRef.current?.querySelector<HTMLAnchorElement>('a')?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.removeProperty('--mobile-menu-top');
      window.removeEventListener('resize', updateMenuTop);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <button
        ref={buttonRef}
        className="mobile-toggle"
        onClick={() => open ? closeMenu() : setOpen(true)}
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label={open ? 'Close primary navigation' : 'Open primary navigation'}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <nav ref={navRef} id="primary-nav" className={`nav ${open ? 'open' : ''}`} aria-label="Primary navigation">
        {links.map(([name, href]) => (
          <Link key={href} href={href} className={isActive(href) ? 'active' : undefined} aria-current={isActive(href) ? 'page' : undefined} onClick={() => closeMenu()}>
            {name}
          </Link>
        ))}
        <Link className={`mobile-nav-cta ${isActive('/contact') ? 'active' : ''}`} href="/contact" aria-current={isActive('/contact') ? 'page' : undefined} onClick={() => closeMenu()}>
          Send a Requirement
        </Link>
      </nav>
      <Link className={`button header-cta ${isActive('/contact') ? 'active' : ''}`} href="/contact" aria-current={isActive('/contact') ? 'page' : undefined}>
        Send a Requirement
      </Link>
      {open && <div className="menu-backdrop" aria-hidden="true" onClick={() => closeMenu()} />}
    </>
  );
}

export default function MobileNav({ links }: { links: string[][] }) {
  return <Suspense fallback={null}><Navigation links={links} /></Suspense>;
}
