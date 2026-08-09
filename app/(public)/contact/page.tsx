'use client';
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    setStatus('sending');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', body: new FormData(form) });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return <main className="shell page"><h1>Send a Requirement</h1><p className="lede">Tell us what you are looking for. Fields marked below are required.</p><form className="form" onSubmit={submit} aria-busy={status === 'sending'}><input name="name" required placeholder="Name"/><input name="email" required type="email" placeholder="Email"/><input name="phone" required placeholder="Phone / WhatsApp"/><textarea name="requirement" required placeholder="What are you looking for?"/><input name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}}/><button className="button" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send enquiry'}</button>{status === 'success' && <div className="notice" role="status" aria-live="polite"><strong>Thank you. Your enquiry has been received.</strong><br/>We will contact you shortly.</div>}{status === 'error' && <p className="error" role="alert">We couldn&apos;t send your enquiry. Please try again or contact us directly.</p>}</form></main>;
}
