'use client'

import React from 'react'

const ContactPage = () => {
  const host = process.env.NEXT_PUBLIC_HOSTNAME
  const contactEmail = `info@${host?.replace(/^https?:\/\//, '')}`

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Get in Touch</h1>

      <p className="text-lg mb-4">
        Whether you have a question, a business proposal, or just want to say hello — we’d love to hear from you. Our team is committed to providing thoughtful responses and timely communication.
      </p>

      <p className="text-lg mb-4">
        If you’re reaching out regarding link placements, collaborations, press, or advertising opportunities, please include relevant details and we’ll make sure it gets to the right person.
      </p>

      <p className="text-lg mb-4">
        📧 <strong>Email:</strong>{' '}
        <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
          {contactEmail}
        </a>
        <br />
        🕐 <strong>Response Time:</strong> We typically respond within 1–2 business days.
      </p>

      <p className="text-sm text-gray-500 mt-10">
        Please do not send unsolicited promotions or spam. All inquiries are reviewed carefully.
      </p>
    </div>
  )
}

export default ContactPage
