import { NextRequest } from 'next/server';
import validator from 'validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    console.log('[API] Raw submission:', body);

    // Helper: sanitize + limit
    const sanitize = (str: string, maxLen = 1000) =>
      (str || '').replace(/[<>]/g, '').trim().slice(0, maxLen);

    // Sanitize inputs
    const safeName = sanitize(name, 100);
    const safeEmail = sanitize(email, 100);
    const safeMessage = sanitize(message, 1000);

    // Validate presence
    if (!safeName || !safeEmail || !safeMessage) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 },
      );
    }

    // Validate email
    if (!validator.isEmail(safeEmail)) {
      return new Response(JSON.stringify({ message: 'Invalid email' }), {
        status: 400,
      });
    }

    // Get the first valid recipient from env (only ONE!)
    const recipientEmail = (process.env.FORM_RECEIVER_EMAILS || '')
      .split(',')
      .map((email) => email.trim())
      .find((email) => validator.isEmail(email));

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ message: 'No valid recipient email' }),
        { status: 500 },
      );
    }

    // Build Rule.io payload (use "to" field)
    const plainText = `New ad inquiry from ${safeName} (${safeEmail})\n\nMessage: ${safeMessage}`;
    const htmlText = `<p><strong>New ad inquiry from ${safeName} (${safeEmail})</strong></p><p>Message:</p><p>${safeMessage}</p>`;

    const payload = {
      transaction_type: 'email',
      transaction_name: 'Ad Inquiry',
      subject: `New Ad Inquiry from ${process.env.HOSTNAME || 'Website'}`,
      from: {
        name: process.env.HOSTNAME || 'Website',
        email: process.env.RULE_FROM_EMAIL || 'noreply@rule.se',
      },
      to: { email: recipientEmail }, // <-- CORRECT FIELD
      content: {
        plain: Buffer.from(plainText).toString('base64'),
        html: Buffer.from(htmlText).toString('base64'),
      },
    };

    console.log('[API] Sending to Rule.io:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://app.rule.io/api/v2/transactionals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RULE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    let result;
    try {
      result = await response.json();
    } catch (err) {
      console.error('[API] Failed to parse Rule.io response:', err);
      return new Response(
        JSON.stringify({ message: 'Invalid response from Rule.io' }),
        { status: 500 },
      );
    }

    if (!response.ok) {
      console.error('[Rule.io Error]', JSON.stringify(result, null, 2));
      return new Response(
        JSON.stringify({
          message: 'Failed to send email via Rule.io',
          details: result,
        }),
        { status: 500 },
      );
    }

    console.log('[API] Email sent successfully via Rule.io');
    return new Response(
      JSON.stringify({ message: 'Email sent successfully via Rule.io' }),
      { status: 200 },
    );
  } catch (err) {
    console.error('[API] Unexpected server error:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
