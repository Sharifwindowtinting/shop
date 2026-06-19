function clean(value, maxLength = 1200) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function splitName(name) {
  const parts = clean(name, 160).split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

function normalizePhone(value) {
  const raw = clean(value, 80);
  const digits = raw.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  return raw;
}

function parseContact(contact) {
  const value = clean(contact, 160);
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return {
    email: looksLikeEmail ? value : '',
    phone: looksLikeEmail ? '' : normalizePhone(value),
  };
}

function resolveCustomerContact(body) {
  const fallback = parseContact(body.contact);
  const email = clean(body.email || fallback.email, 160);
  const phone = normalizePhone(body.phone || fallback.phone);
  const contact = clean(body.contact || [phone, email].filter(Boolean).join(' / '), 220);

  return { contact, email, phone };
}

function escapeHtml(value) {
  return clean(value, 4000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function leadRows(lead) {
  return [
    ['Vehicle', lead.vehicle],
    ['Service interest', lead.serviceInterest],
    ['Notes', lead.notes],
    ['Page', lead.page],
    ['Submitted', lead.submittedAt],
  ];
}

function buildEmailHtml(lead) {
  const displayPhone = lead.phone || 'Not provided';
  const displayEmail = lead.email || 'Not provided';
  const callAction = lead.phone
    ? `<a href="tel:${escapeHtml(lead.phone)}" style="display:block;text-align:center;text-decoration:none;background:#ff5b1f;color:#ffffff;border-radius:14px;padding:15px 18px;font-size:15px;font-weight:800;">Call lead</a>`
    : '<span style="display:block;text-align:center;background:#f1f3f6;color:#8b92a1;border-radius:14px;padding:15px 18px;font-size:15px;font-weight:800;">No phone provided</span>';
  const emailAction = lead.email
    ? `<a href="mailto:${escapeHtml(lead.email)}" style="display:block;text-align:center;text-decoration:none;background:#111827;color:#ffffff;border-radius:14px;padding:15px 18px;font-size:15px;font-weight:800;">Email lead</a>`
    : '<span style="display:block;text-align:center;background:#f1f3f6;color:#8b92a1;border-radius:14px;padding:15px 18px;font-size:15px;font-weight:800;">No email provided</span>';

  const rows = leadRows(lead)
    .map(([label, value]) => `
      <tr>
        <td style="padding:14px 0;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid #eee7df;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:14px 0;color:#121721;font-size:16px;font-weight:700;line-height:1.45;border-bottom:1px solid #eee7df;vertical-align:top;">${escapeHtml(value || 'Not provided')}</td>
      </tr>
    `)
    .join('');

  return `
    <div style="margin:0;padding:0;background:#f4eee6;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:720px;margin:0 auto;padding:34px 18px;">
        <div style="background:#090b10;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(17,19,24,.18);">
          <div style="padding:34px 34px 30px;background:#0b0d12;background-image:linear-gradient(135deg,#11151d 0%,#08090d 55%,#2a1008 100%);color:#fff;">
            <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:top;">
                  <p style="margin:0 0 14px;color:#ff6a2a;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">New quote request</p>
                  <h1 style="margin:0;color:#ffffff;font-size:34px;line-height:1.05;font-weight:800;letter-spacing:-.03em;">Sharif Window Tinting</h1>
                </td>
                <td style="text-align:right;vertical-align:top;">
                  <span style="display:inline-block;padding:10px 14px;border:1px solid rgba(255,106,42,.45);border-radius:999px;color:#ffd5c3;background:rgba(255,106,42,.12);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Website lead</span>
                </td>
              </tr>
            </table>
            <div style="height:1px;background:linear-gradient(90deg,#ff6a2a,rgba(255,106,42,0));margin:26px 0 24px;"></div>
            <p style="margin:0;color:#d9dde7;font-size:18px;line-height:1.55;">A customer requested pricing for <strong style="color:#fff;">${escapeHtml(lead.serviceInterest || 'service')}</strong> on a <strong style="color:#fff;">${escapeHtml(lead.vehicle || 'vehicle')}</strong>.</p>
          </div>

          <div style="background:#ffffff;padding:28px 34px 32px;">
            <div style="margin:0 0 22px;padding:22px;border:1px solid #f0e3d8;border-radius:18px;background:#fff8f3;">
              <p style="margin:0 0 8px;color:#ff5b1f;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">Customer</p>
              <h2 style="margin:0 0 14px;color:#111827;font-size:30px;line-height:1.15;font-weight:800;letter-spacing:-.02em;">${escapeHtml(lead.name)}</h2>
              <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:0 10px 0 0;vertical-align:top;width:50%;">
                    <p style="margin:0 0 5px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Phone</p>
                    <p style="margin:0;color:#111827;font-size:16px;font-weight:800;line-height:1.4;">${escapeHtml(displayPhone)}</p>
                  </td>
                  <td style="padding:0 0 0 10px;vertical-align:top;width:50%;">
                    <p style="margin:0 0 5px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Email</p>
                    <p style="margin:0;color:#111827;font-size:16px;font-weight:800;line-height:1.4;word-break:break-word;">${escapeHtml(displayEmail)}</p>
                  </td>
                </tr>
              </table>
            </div>

            <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 24px;">
              <tr>
                <td style="padding:0 8px 0 0;width:50%;">
                  ${callAction}
                </td>
                <td style="padding:0 0 0 8px;width:50%;">
                  ${emailAction}
                </td>
              </tr>
            </table>

            <div style="margin:0 0 22px;">
              <p style="margin:0 0 12px;color:#111827;font-size:18px;font-weight:800;">Lead details</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
                ${rows}
              </table>
            </div>

            <div style="padding:18px 20px;border-radius:16px;background:#111827;">
              <p style="margin:0 0 6px;color:#ffb391;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">Follow-up note</p>
              <p style="margin:0;color:#f9fafb;font-size:15px;line-height:1.55;">Reply quickly with a quote range, ask for photos if needed, and confirm tint percentage or PPF coverage goals.</p>
            </div>
          </div>
        </div>
        <p style="margin:18px 0 0;text-align:center;color:#6b7280;font-size:13px;line-height:1.5;">This lead came from the quote form on the Sharif Window Tinting website.</p>
      </div>
    </div>
  `;
}

function buildEmailText(lead) {
  return [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ...leadRows(lead),
  ]
    .map(([label, value]) => `${label}: ${value || 'Not provided'}`)
    .join('\n');
}

async function readBody(request) {
  if (typeof request.body === 'string') {
    return JSON.parse(request.body || '{}');
  }

  if (Buffer.isBuffer(request.body)) {
    return JSON.parse(request.body.toString('utf8') || '{}');
  }

  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(raw || '{}');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.LEAD_NOTIFY_TO || 'sharifwindowtinting@gmail.com';
    const from = process.env.RESEND_FROM || 'Sharif Window Tinting <contact@getproclix.com>';
    const body = await readBody(request);

    if (clean(body.honey || body._honey)) {
      response.status(200).json({ ok: true });
      return;
    }

    const name = clean(body.name, 160);
    const vehicle = clean(body.vehicle, 180);
    const serviceInterest = clean(body.services || body.service_interest, 180);
    const notes = clean(body.message || body.notes, 2000);
    const page = clean(body.page, 800);
    const { contact, email, phone } = resolveCustomerContact(body);
    const submittedAt = new Date().toISOString();

    if (!name || (!phone && !email && !contact) || !vehicle) {
      response.status(400).json({ ok: false, error: 'Name, phone or email, and vehicle are required.' });
      return;
    }

    if (!resendApiKey) {
      response.status(503).json({
        ok: false,
        error: 'Resend API key is not configured yet.',
        code: 'missing_resend_api_key',
      });
      return;
    }

    const lead = {
      name,
      contact,
      email,
      phone,
      vehicle,
      serviceInterest,
      notes,
      page,
      submittedAt,
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Idempotency-Key': `sharif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
      body: JSON.stringify({
        from,
        to: [notifyTo],
        subject: `New quote request from ${name}`,
        html: buildEmailHtml(lead),
        text: buildEmailText(lead),
        reply_to: email || undefined,
        tags: [
          { name: 'source', value: 'website' },
          { name: 'type', value: 'quote_request' },
        ],
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      response.status(502).json({
        ok: false,
        error: 'Resend did not accept the lead email.',
        details: details.slice(0, 500),
      });
      return;
    }

    const result = await resendResponse.json();
    response.status(200).json({ ok: true, id: result.id });
  } catch (error) {
    response.status(500).json({ ok: false, error: 'Could not send lead email.' });
  }
}
