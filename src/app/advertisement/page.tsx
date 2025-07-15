'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import User from '../components/icons/user';
import Email from '../components/icons/email';
import Doc from '../components/icons/doc';
import Dollar from '../components/icons/dollar';
import Sparkles from '../components/icons/sparks';
import News from '../components/icons/news';

// --- Schema: No link field at all ---
const PurchaseFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name is too short' })
    .max(50, { message: 'Name is too long' })
    .regex(/^[a-zA-Z0-9 .,'-]+$/, { message: 'Name contains invalid characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string()
    .max(1000, { message: 'Message too long' })
    .refine(val => !/<script|<\/script/i.test(val), { message: 'Malicious content detected' }),
});

type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;

const INITIAL_FORM: PurchaseFormData = {
  name: '',
  email: '',
  message: '',
};

export default function AdInquiryPage() {
  const [form, setForm] = useState<PurchaseFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PurchaseFormData, string>>>({});
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_HOSTNAME) {
      document.title = `${process.env.NEXT_PUBLIC_HOSTNAME} | Advertise`;
    }
  }, []);

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

  const result = PurchaseFormSchema.safeParse(form);

  console.log('[AdInquiryPage] Submitting form:', form);
  console.log('[AdInquiryPage] Zod validation result:', result);

  if (!result.success) {
    const fieldErrors: typeof errors = {};
    for (const err of result.error.errors) {
      const field = err.path[0] as keyof PurchaseFormData;
      if (!fieldErrors[field]) fieldErrors[field] = err.message;
    }
    setErrors(fieldErrors);
    setIsSubmitting(false);
    console.log('[AdInquiryPage] Validation failed:', fieldErrors);
    return;
  }

  try {
    console.log('[AdInquiryPage] Sending fetch to /api with:', form);
    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    console.log('[AdInquiryPage] Fetch response status:', res.status);
    const responseBody = await res.json().catch(() => null);
    console.log('[AdInquiryPage] Fetch response body:', responseBody);

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
    console.log('[AdInquiryPage] Fetch/network error:', err);
  } finally {
    setIsSubmitting(false);
    console.log('[AdInquiryPage] Submit finished');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-2 py-10">
      <div className="w-full max-w-2xl mx-auto">
        {/* Pricing Card */}
        <div className="mb-8 rounded-2xl bg-white border border-blue-100 shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold">
              <Dollar width={22} color="#6366f1" className="mr-2" />
              <span className="text-lg">Pricing</span>
            </div>
            <ul className="space-y-1 text-gray-700 text-base ml-1">
              <li className="flex items-center gap-2">
                <Sparkles width={16} color="#6366f1" className="mt-0.5" />
                <span>
                  <strong>$250</strong> per link (standard niches)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles width={16} color="#fb7185" className="mt-0.5" />
                <span>
                  <strong>$500</strong> per link (casino/gambling)
                </span>
              </li>
            </ul>
          </div>

          <div className="sm:border-l border-blue-100 h-16 hidden sm:block mx-6"></div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 flex items-center gap-2 text-indigo-700">
              <News width={20} color="#6366f1" className="mr-2" />
              <span className="text-base">
                Want to be in our newsletter? <br />
                <span className="font-semibold">Contact us for an offer!</span>
              </span>
            </div>
          </div>
        </div>
        {/* End Pricing Card */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8">
          <div className="mb-5 text-center">
            <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">Advertise / Partner With Us</h1>
            <p className="text-gray-500 text-base">
              For advertising, partnerships or collaborations. Let’s make something great together.<br />
              <span className="font-medium text-gray-400 text-sm">All prices are in USD.</span>
            </p>
          </div>
          <section className="space-y-5">
            {status === 'success' && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md border border-green-200 shadow-sm flex items-center justify-center gap-2">
                <span className="text-2xl">✅</span>
                <span>Your request has been submitted!</span>
              </div>
            )}
            {(status === 'error' || globalError) && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border border-red-200 shadow-sm flex items-center justify-center gap-2">
                <span className="text-2xl">❌</span>
                <span>{globalError || 'Something went wrong. Please try again.'}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
              <div className="relative">
                <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-400 flex items-center">
                    <User width={20} color="#a3a3a3" />
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>
                {errors.name && (
                  <span id="name-error" className="text-red-600 text-sm block mt-1">{errors.name}</span>
                )}
              </div>

              <div className="relative">
                <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-400 flex items-center">
                    <Email width={20} color="#a3a3a3" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="ads@request.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>
                {errors.email && (
                  <span id="email-error" className="text-red-600 text-sm block mt-1">{errors.email}</span>
                )}
              </div>
              <div className="relative">
                <label htmlFor="message" className="block font-medium text-gray-700 mb-1">
                  Tell us about your campaign or request. Please include all the links here.
                </label>
                <div className="flex items-start">
                  <span className="mr-2 text-gray-400 pt-2 flex items-center">
                    <Doc width={20} color="#a3a3a3" />
                  </span>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>
                {errors.message && (
                  <span id="message-error" className="text-red-600 text-sm block mt-1">{errors.message}</span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold transition ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700 cursor-pointer'
                }`}
              >
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Submitting...' : 'Send Request'}
              </button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-2">
              Need support? Email us at <a href="mailto:ads@example.com" className="text-indigo-600 underline">publisheradsquestions@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
