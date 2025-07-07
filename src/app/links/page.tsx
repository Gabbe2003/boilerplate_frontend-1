'use client'

import React, { useState } from 'react'

const LinkPurchasePage = () => {
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    const form = e.currentTarget

    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      link: (form.elements.namedItem('link') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        console.log('✅ Submission successful')
        setStatus('success')
        form.reset()
      } else {
        console.error('❌ Submission failed')
        setStatus('error')
      }
    } catch (error) {
      console.error('🚨 Error submitting form:', error)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Purchase a Link</h1>

      <section className="space-y-6 text-lg leading-relaxed text-gray-800">
        <p>
          Interested in publishing a link on <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong>? We are happy to offer link placements for businesses, agencies, and individuals looking to enhance their visibility through our platform.
        </p>

        <p>
          <strong>Pricing:</strong> Each link placement costs <span className="font-semibold">$250 USD</span>. This includes permanent placement, relevant categorization, and editorial formatting.
        </p>

        <p>
          Please note: Links related to <strong>casino or gaming content</strong> are subject to a higher rate due to industry sensitivity and editorial handling. These are priced at <span className="font-semibold">$500 USD</span> per link.
        </p>

        <p>
          After purchasing, our team will review your request and schedule your link for publication within a reasonable timeframe. We reserve the right to reject submissions that do not meet our quality or compliance standards.
        </p>

        <p>
          To proceed with a link placement, please use the form below or reach out via our dedicated email. We’ll guide you through the next steps including invoice, content requirements, and timelines.
        </p>

        {/* ✅ Status Messages */}
        {status === 'success' && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md border border-green-300 shadow-sm">
            ✅ Your request has been successfully submitted!
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded-md border border-red-300 shadow-sm">
            ❌ Something went wrong. Please try again.
          </div>
        )}

        {/* ✅ Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-8 bg-white p-6 rounded-2xl shadow-lg border"
        >
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='email@Google.se'
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="link" className="block font-medium text-gray-700 mb-1">Link URL</label>
            <input
              type="url"
              id="link"
              name="link"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-medium text-gray-700 mb-1">What do you want to purchase</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default LinkPurchasePage
