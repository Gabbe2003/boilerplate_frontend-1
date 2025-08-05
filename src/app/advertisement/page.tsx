'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import User from '../components/icons/user';
import Email from '../components/icons/email';
import Doc from '../components/icons/doc';
import Dollar from '../components/icons/dollar';
import Sparkles from '../components/icons/sparks';
import News from '../components/icons/news';

// Form validation schema (no link field)
const PurchaseFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name is too short' })
    .max(50, { message: 'Name is too long' })
    .regex(/^[a-zA-Z0-9 .,'-]+$/, {
      message: 'Name contains invalid characters',
    }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z
    .string()
    .max(1000, { message: 'Message too long' })
    .refine((val) => !/<script|<\/script/i.test(val), {
      message: 'Malicious content detected',
    }),
});

type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;

const INITIAL_FORM: PurchaseFormData = {
  name: '',
  email: '',
  message: '',
};

export default function AdInquiryPage() {
  const [form, setForm] = useState<PurchaseFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PurchaseFormData, string>>
  >({});
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_HOSTNAME) {
      document.title = `${process.env.NEXT_PUBLIC_HOSTNAME} | Advertise`;
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const err of result.error.errors) {
        const field = err.path[0] as keyof PurchaseFormData;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const responseBody = await res.json().catch(() => null);

      if (res.ok) {
        setStatus('success');
        setForm(INITIAL_FORM);
        setErrors({});
      } else {
        setStatus('error');
        setGlobalError(
          responseBody?.message || 'Submission failed. Please try again.',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      setStatus('error');
      setGlobalError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-2 py-10">
      <div className="w-full max-w-6xl mx-auto">
        {/* Side-by-side layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Pricing & Info Card */}
          <div className="flex-1 mb-8 md:mb-0 rounded-2xl bg-white border border-blue-100 shadow-lg p-6 flex flex-col justify-between">
            {/* Pricing & Services */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-indigo-700 font-semibold">
                <Dollar width={22} color="#6366f1" className="mr-2" />
                <span className="text-lg">
                  {process.env.NEXT_PUBLIC_HOSTNAME || 'Our Site'} Article
                  Pricing
                </span>
              </div>
              <ul className="space-y-2 text-gray-700 text-base ml-1">
                <li className="flex items-center gap-2">
                  <Sparkles width={16} color="#6366f1" className="mt-0.5" />
                  <span>
                    <strong>€350</strong> per article{' '}
                    <span className="text-gray-500">(General Content)</span>
                    <br />
                    <span className="text-xs text-gray-400">
                      Business, finance, and other standard topics.
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles width={16} color="#f59e42" className="mt-0.5" />
                  <span>
                    <strong>€550</strong> per article{' '}
                    <span className="text-gray-500">
                      (Crypto, Forex, Loans &amp; Finance)
                    </span>
                    <br />
                    <span className="text-xs text-gray-400">
                      High-competition topics such as cryptocurrency, forex, or
                      loan services.
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles width={16} color="#fb7185" className="mt-0.5" />
                  <span>
                    <strong>€700</strong> per article{' '}
                    <span className="text-gray-500">
                      (Casino, Betting &amp; Gambling)
                    </span>
                    <br />
                    <span className="text-xs text-gray-400">
                      For casino, betting, and gambling topics.
                    </span>
                  </span>
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-600">
                <strong>Discounts:</strong> Bundle orders of{' '}
                <span className="font-semibold">3+ articles</span> get reduced
                pricing. <br />
                <span className="text-gray-400">
                  Contact us to discuss options tailored to your needs.
                </span>
              </div>
              <div className="mt-5 text-indigo-700 font-bold">
                Additional Writing Service
              </div>
              <div className="text-sm text-gray-600 mb-1">
                <strong>€200</strong> per article (optional add-on:
                high-quality, SEO-optimized writing by our team)
              </div>
            </div>
            {/* Info & Policies */}
            <div className="flex flex-col gap-3 w-full mt-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                <div className="text-indigo-700 font-semibold mb-1">
                  Content &amp; Link Guidelines
                </div>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 pl-1">
                  <li>
                    Language: <span className="font-semibold">Swedish</span>, up
                    to 1,000 words per article.
                  </li>
                  <li>
                    Up to{' '}
                    <span className="font-semibold">3 do-follow links</span> per
                    article.
                  </li>
                  <li>
                    All articles are{' '}
                    <span className="font-semibold">published permanently</span>{' '}
                    on {process.env.NEXT_PUBLIC_HOSTNAME || 'our site'}.
                  </li>
                  <li>
                    No “sponsored” tag in article text.
                    <br />
                    <span className="text-gray-400">
                      A small sponsorship indication appears on the cover image,
                      per Swedish law (does not affect links).
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <div className="text-amber-800 font-semibold mb-1">
                  We Do Not Accept Content Related To:
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 pl-1">
                  <li>Adult content</li>
                  <li>CBD or cannabis-related products</li>
                </ul>
                <span className="block text-xs text-gray-400 mt-1">
                  These restrictions help maintain platform quality.
                </span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <div className="text-green-800 font-semibold mb-0.5">
                  Payment Terms
                </div>
                <div className="text-sm text-gray-700">
                  Pay by <strong>bank transfer</strong> or{' '}
                  <strong>PayPal</strong>.<br />
                  Payment due{' '}
                  <span className="font-semibold">
                    within 5 working days
                  </span>{' '}
                  from publication date.
                </div>
              </div>
              <div className="mt-2 text-gray-500 text-xs">
                For bulk order discounts or further inquiries,
                <br />
                <a
                  href="mailto:publisheradsquestions@gmail.com"
                  className="font-medium text-indigo-700 underline hover:text-indigo-900 transition"
                >
                  contact us directly
                </a>
                .<br />
                We look forward to helping you achieve outstanding SEO results
                on{' '}
                <span className="font-semibold text-indigo-700">
                  {process.env.NEXT_PUBLIC_HOSTNAME || 'our site'}
                </span>
                !
              </div>
              {/* Newsletter Best Seller Highlight */}
              <div className="relative mt-4">
                <div className="absolute -top-3 -left-3">
                  <span className="bg-yellow-400 text-yellow-900 font-bold text-xs px-3 py-1 rounded-full shadow ring-2 ring-yellow-200 border border-yellow-300 animate-pulse">
                    Best Seller
                  </span>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 via-indigo-50 to-white border-2 border-yellow-400 shadow-lg rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center gap-4 text-indigo-900 ring-2 ring-yellow-200">
                  <News width={28} color="#fbbf24" className="flex-shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-lg font-bold text-yellow-700">
                      Newsletter Placement
                    </span>
                    <span className="text-sm text-indigo-900 font-semibold mb-1">
                      Get featured in our exclusive newsletter to{' '}
                      <span className="text-yellow-700 font-extrabold">
                        20,000+
                      </span>{' '}
                      engaged subscribers!
                    </span>
                    <span className="text-base">
                      <span className="font-semibold text-indigo-700">
                        Want to be in our newsletter?
                      </span>
                      <br />
                      <span className="font-bold text-yellow-700">
                        Contact us for a special offer on{' '}
                        {process.env.NEXT_PUBLIC_HOSTNAME || 'our site'}!
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section and Success/Error Messages */}
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8">
            <div className="mb-5 text-center">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
                Advertise / Partner With Us
              </h1>
              <p className="text-gray-500 text-base">
                For advertising, partnerships or collaborations. Let’s make
                something great together.
                <br />
                <span className="font-medium text-gray-400 text-sm">
                  All prices are in EUR.
                </span>
              </p>
            </div>
            <section className="space-y-5">
              {status === 'success' && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md border border-green-200 shadow-sm flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-base font-semibold">
                    Your request has been submitted!
                  </span>
                  <span className="text-sm text-green-800">
                    Keep an eye on your email, we will be in touch in 1-2 days.
                  </span>
                </div>
              )}
              {(status === 'error' || globalError) && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border border-red-200 shadow-sm flex items-center justify-center gap-2">
                  <span className="text-2xl">❌</span>
                  <span>
                    {globalError || 'Something went wrong. Please try again.'}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block font-medium text-gray-700 mb-1"
                  >
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
                    <span
                      id="name-error"
                      className="text-red-600 text-sm block mt-1"
                    >
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block font-medium text-gray-700 mb-1"
                  >
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
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    />
                  </div>
                  {errors.email && (
                    <span
                      id="email-error"
                      className="text-red-600 text-sm block mt-1"
                    >
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Tell us about your campaign or request. Please include all
                    the links here.
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
                      aria-describedby={
                        errors.message ? 'message-error' : undefined
                      }
                      className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    />
                  </div>
                  {errors.message && (
                    <span
                      id="message-error"
                      className="text-red-600 text-sm block mt-1"
                    >
                      {errors.message}
                    </span>
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
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Submitting...' : 'Send Request'}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-2">
                Need support? Email us at{' '}
                <a
                  href="mailto:ads@example.com"
                  className="text-indigo-600 underline"
                >
                  publisheradsquestions@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
