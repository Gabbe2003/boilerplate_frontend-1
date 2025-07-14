'use client';

import React, { useState } from 'react';
import { z } from 'zod';


const PurchaseFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name is too short' })
    .max(50, { message: 'Name is too long' })
    .regex(/^[a-zA-Z0-9 .,'-]+$/, { message: 'Name contains invalid characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  link: z.string()
    .url({ message: 'Invalid URL' })
    .refine((val) => /^https?:\/\/.+\..+/.test(val), { message: 'Link must start with http or https' }),
  message: z.string()
    .max(1000, { message: 'Message too long' })
    .refine(val => !/<script|<\/script/i.test(val), { message: 'Malicious content detected' }),
});

type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;

const INITIAL_FORM: PurchaseFormData = {
  name: '',
  email: '',
  link: '',
  message: '',
};

export default function LinkPurchasePage() {
  const [form, setForm] = useState<PurchaseFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PurchaseFormData, string>>>({});
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Controlled input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setStatus(null);
    setGlobalError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);
    setGlobalError(null);

    // Zod validation
    const result = PurchaseFormSchema.safeParse(form);

    if (!result.success) {
      // Map errors per-field
      const fieldErrors: typeof errors = {};
      for (const err of result.error.errors) {
        const field = err.path[0] as keyof PurchaseFormData;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Submit
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm(INITIAL_FORM);
        setErrors({});
      } else {
        setStatus('error');
        setGlobalError('Submission failed. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setGlobalError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Purchase a Link</h1>
      <section className="space-y-6 text-lg leading-relaxed text-gray-800">
        {/* Status & global errors */}
        {status === 'success' && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md border border-green-300 shadow-sm">
            ✅ Your request has been successfully submitted!
          </div>
        )}
        {(status === 'error' || globalError) && (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded-md border border-red-300 shadow-sm">
            ❌ {globalError || 'Something went wrong. Please try again.'}
          </div>
        )}

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-8 bg-white p-6 rounded-2xl shadow-lg border"
          noValidate
        >
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && (
              <span id="name-error" className="text-red-600 text-sm">{errors.name}</span>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && (
              <span id="email-error" className="text-red-600 text-sm">{errors.email}</span>
            )}
          </div>
          <div>
            <label htmlFor="link" className="block font-medium text-gray-700 mb-1">Link URL</label>
            <input
              type="url"
              id="link"
              name="link"
              value={form.link}
              onChange={handleChange}
              required
              aria-invalid={!!errors.link}
              aria-describedby={errors.link ? 'link-error' : undefined}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.link && (
              <span id="link-error" className="text-red-600 text-sm">{errors.link}</span>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block font-medium text-gray-700 mb-1">What do you want to purchase</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.message && (
              <span id="message-error" className="text-red-600 text-sm">{errors.message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold transition ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </section>
    </div>
  );
}
