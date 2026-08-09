'use client';
import { useEffect, useState } from 'react';

const submittedKey = 'reva-submitted-enquiries';
const normalize = (value: string, lower = false) => {
  const normalized = value.trim().replace(/\s+/g, ' ');
  return lower ? normalized.toLowerCase() : normalized;
};

async function fingerprint(form: FormData) {
  const content = ['name', 'email', 'phone', 'requirement']
    .map((key) => normalize(String(form.get(key) || ''), key === 'email'))
    .join('\n');
  const bytes = new TextEncoder().encode(content);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'duplicate' | 'limited'>('idle');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending' || cooldown > 0) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const hash = await fingerprint(data);
    const sent: Record<string, number> = JSON.parse(sessionStorage.getItem(submittedKey) || '{}');
    if (sent[hash]) { setStatus('duplicate'); return; }
    setStatus('sending');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', body: data });
      if (response.status === 429) { setStatus('limited'); return; }
      if (!response.ok) throw new Error('Submission failed');
      sent[hash] = Date.now();
      sessionStorage.setItem(submittedKey, JSON.stringify(sent));
      const requirement = form.elements.namedItem('requirement') as HTMLTextAreaElement;
      requirement.value = '';
      setCooldown(3);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const disabled = status === 'sending' || cooldown > 0;
  return <main className="shell page"><h1>Send a Requirement</h1><p className="lede">Tell us what you are looking for. Fields marked below are required.</p><form className="form" onSubmit={submit} aria-busy={status === 'sending'}><input name="name" required placeholder="Name"/><input name="email" required type="email" placeholder="Email"/><input name="phone" required placeholder="Phone / WhatsApp"/><textarea name="requirement" required placeholder="What are you looking for?"/><input name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}}/><button className="button" disabled={disabled}>{status === 'sending' ? 'Sending...' : 'Send enquiry'}</button>{status === 'success' && <div className="notice" role="status" aria-live="polite"><strong>Thank you. Your enquiry has been received.</strong><br/>We will contact you shortly.{cooldown > 0 && <><br/>You can send another enquiry in {cooldown} {cooldown === 1 ? 'second' : 'seconds'}.</>}</div>}{status === 'limited' && <p className="error" role="alert">You’ve sent several enquiries recently. Please wait a few minutes before trying again.</p>}{status === 'duplicate' && <p className="error" role="alert">You already sent this enquiry.</p>}{status === 'error' && <p className="error" role="alert">We couldn&apos;t send your enquiry. Please try again or contact us directly.</p>}</form></main>;
}
