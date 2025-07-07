import { NextRequest } from 'next/server'
import validator from 'validator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, link, message } = body

    console.log('[API] Raw submission:', body)

    // Helper: sanitize + limit
    const sanitize = (str: string, maxLen = 1000) =>
      str.replace(/[<>]/g, '').trim().slice(0, maxLen)

    // Sanitize inputs
    const safeName = sanitize(name, 100)
    const safeEmail = sanitize(email, 100)
    const safeLink = sanitize(link, 300)
    const safeMessage = sanitize(message, 1000)

    // Validate presence
    if (!safeName || !safeEmail || !safeLink) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 })
    }

    // Validate email + URL
    if (!validator.isEmail(safeEmail) || !validator.isURL(safeLink)) {
      return new Response(JSON.stringify({ message: 'Invalid email or link' }), { status: 400 })
    }

    // Build Rule.io payload
    const plainText = `New link request from ${safeName} (${safeEmail})\n\nLink: ${safeLink}\nMessage: ${safeMessage}`
    const htmlText = `<p><strong>New link request from ${safeName} (${safeEmail})</strong></p><p>Link: ${safeLink}</p><p>Message: ${safeMessage}</p>`

    const recipients = (process.env.FORM_RECEIVER_EMAILS || '')
      .split(',')
      .map(email => email.trim())
      .filter(Boolean)
      .map(email => ({ name: 'Form Receiver', email }))

    const payload = {
      transaction_type: 'email',
      transaction_name: 'Link Purchase Request',
      subject: `New Link Request from ${process.env.HOSTNAME}`,
      from: {
        name: process.env.HOSTNAME,
        email: process.env.RULE_FROM_EMAIL,
      },
      to: recipients,
      content: {
        plain: Buffer.from(plainText).toString('base64'),
        html: Buffer.from(htmlText).toString('base64'),
      },
    }

    console.log('[API] Sending to Rule.io:', JSON.stringify(payload, null, 2))

    const response = await fetch('https://app.rule.io/api/v2/transactionals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RULE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    let result
    try {
      result = await response.json()
    } catch (err) {
      console.error('[API] Failed to parse Rule.io response:', err)
      return new Response(JSON.stringify({ message: 'Invalid response from Rule.io' }), { status: 500 })
    }

    if (!response.ok) {
      console.error('[Rule.io Error]', { status: response.status, result })
      return new Response(JSON.stringify({ message: 'Failed to send email via Rule.io' }), { status: 500 })
    }

    console.log('[API] Email sent successfully via Rule.io')
    return new Response(JSON.stringify({ message: 'Email sent successfully via Rule.io' }), { status: 200 })
  } catch (err) {
    console.error('[API] Unexpected server error:', err)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 })
  }
}
