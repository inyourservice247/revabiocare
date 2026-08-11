'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const submittedKey = 'reva-submitted-enquiries';
type FieldName = 'name' | 'email' | 'phone' | 'requirement';
type FieldErrors = Partial<Record<FieldName, string>>;

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

function ContactForm() {
  const searchParams = useSearchParams();
  const selectedProduct = normalize(searchParams.get('requirement') || '');
  const [requirement, setRequirement] = useState(selectedProduct ? `Enquiry for ${selectedProduct}` : '');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'duplicate' | 'limited'>('idle');
  const [cooldown, setCooldown] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending' || cooldown > 0) return;
    const form = event.currentTarget;
    const fields: Array<{ element: HTMLInputElement | HTMLTextAreaElement; name: FieldName; message: string }> = [
      { element: form.elements.namedItem('name') as HTMLInputElement, name: 'name', message: 'Please enter your name.' },
      { element: form.elements.namedItem('email') as HTMLInputElement, name: 'email', message: 'Please enter a valid email address.' },
      { element: form.elements.namedItem('phone') as HTMLInputElement, name: 'phone', message: 'Please enter your phone or WhatsApp number.' },
      { element: form.elements.namedItem('requirement') as HTMLTextAreaElement, name: 'requirement', message: 'Please describe what you are looking for.' },
    ];
    const errors = fields.reduce<FieldErrors>((result, field) => {
      if (!field.element.validity.valid) result[field.name] = field.message;
      return result;
    }, {});
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      fields.find((field) => errors[field.name])?.element.focus();
      return;
    }
    setFieldErrors({});
    const data = new FormData(form);
    const hash = await fingerprint(data);
    const sent: Record<string, number> = JSON.parse(sessionStorage.getItem(submittedKey) || '{}');
    if (sent[hash]) {
      setStatus('duplicate');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', body: data });
      if (response.status === 429) {
        setStatus('limited');
        return;
      }
      if (!response.ok) throw new Error('Submission failed');
      sent[hash] = Date.now();
      sessionStorage.setItem(submittedKey, JSON.stringify(sent));
      setRequirement('');
      setCooldown(3);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const disabled = status === 'sending' || cooldown > 0;
  const clearFieldError = (field: FieldName) => {
    if (!fieldErrors[field]) return;
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <main className="shell page contact-page">
      <h1>Send a Requirement</h1>
      <p className="lede">Tell us what you&apos;re looking for.</p>
      <form className="form contact-form" onSubmit={submit} noValidate aria-busy={status === 'sending'}>
        <div className="form-field">
          <label htmlFor="enquiry-name">Name</label>
          <input id="enquiry-name" name="name" required autoComplete="name" placeholder="Your name" aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'name-error' : undefined} onInput={() => clearFieldError('name')} />
          {fieldErrors.name && <p className="field-error" id="name-error">{fieldErrors.name}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-email">Email</label>
          <input id="enquiry-email" name="email" required type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'email-error' : undefined} onInput={() => clearFieldError('email')} />
          {fieldErrors.email && <p className="field-error" id="email-error">{fieldErrors.email}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-phone">Phone / WhatsApp</label>
          <input id="enquiry-phone" name="phone" required type="tel" autoComplete="tel" inputMode="tel" placeholder="Phone or WhatsApp number" aria-invalid={!!fieldErrors.phone} aria-describedby={fieldErrors.phone ? 'phone-error' : undefined} onInput={() => clearFieldError('phone')} />
          {fieldErrors.phone && <p className="field-error" id="phone-error">{fieldErrors.phone}</p>}
        </div>
        <div className="form-field requirement-field">
          {selectedProduct && <div className="product-context"><span>Selected product</span><strong>{selectedProduct}</strong></div>}
          <label htmlFor="enquiry-requirement">What are you looking for?</label>
          <textarea id="enquiry-requirement" name="requirement" required value={requirement} onChange={(event) => { setRequirement(event.target.value); clearFieldError('requirement'); }} placeholder="Quantity, grade, documentation, destination or other details" aria-invalid={!!fieldErrors.requirement} aria-describedby={fieldErrors.requirement ? 'requirement-error' : undefined} />
          {fieldErrors.requirement && <p className="field-error" id="requirement-error">{fieldErrors.requirement}</p>}
        </div>
        <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
        <button className="button" disabled={disabled}>
          {status === 'sending' ? 'Sending...' : 'Send enquiry'}
        </button>
        {status === 'success' && (
          <div className="notice" role="status" aria-live="polite">
            <strong>Thank you. Your enquiry has been received.</strong>
            <br />
            We will contact you shortly.
            {cooldown > 0 && (
              <>
                <br />
                You can send another enquiry in {cooldown} {cooldown === 1 ? 'second' : 'seconds'}.
              </>
            )}
          </div>
        )}
        {status === 'limited' && (
          <p className="error" role="alert">
            You’ve sent several enquiries recently. Please wait a few minutes before trying again.
          </p>
        )}
        {status === 'duplicate' && <p className="error" role="alert">You already sent this enquiry.</p>}
        {status === 'error' && (
          <p className="error" role="alert">
            We couldn&apos;t send your enquiry. Please try again or contact us directly.
          </p>
        )}
      </form>
    </main>
  );
}

export default function Contact() {
  return <Suspense fallback={null}><ContactForm /></Suspense>;
}
