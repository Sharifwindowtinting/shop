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
  const phoneHref = escapeHtml(lead.phone);
  const emailHref = escapeHtml(lead.email);
  const callAction = lead.phone
    ? `<a href="tel:${phoneHref}" style="display:block;text-align:center;text-decoration:none;background:#f05a28;color:#ffffff;border-radius:12px;padding:14px 12px;font-size:16px;font-weight:800;">Call ${escapeHtml(displayPhone)}</a>`
    : '<span style="display:block;text-align:center;background:#eef0f3;color:#7a828f;border-radius:12px;padding:14px 12px;font-size:16px;font-weight:800;">No phone provided</span>';
  const textAction = lead.phone
    ? `<a href="sms:${phoneHref}" style="display:block;text-align:center;text-decoration:none;background:#111827;color:#ffffff;border-radius:12px;padding:14px 12px;font-size:16px;font-weight:800;">Text lead</a>`
    : '';
  const emailAction = lead.email
    ? `<a href="mailto:${emailHref}" style="display:block;text-align:center;text-decoration:none;background:#ffffff;color:#111827;border:1px solid #d8dde5;border-radius:12px;padding:13px 12px;font-size:16px;font-weight:800;">Email lead</a>`
    : '';

  const rows = leadRows(lead)
    .map(([label, value]) => `
      <div style="padding:14px 0;border-bottom:1px solid #e8edf3;">
        <div style="margin:0 0 5px;color:#6b7280;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(label)}</div>
        <div style="margin:0;color:#111827;font-size:17px;font-weight:800;line-height:1.45;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(value || 'Not provided')}</div>
      </div>
    `)
    .join('');

  return `
    <div style="margin:0;padding:0;background:#f6f1eb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(lead.name)} requested ${escapeHtml(lead.serviceInterest || 'a quote')} for ${escapeHtml(lead.vehicle || 'a vehicle')}.</div>
      <div style="width:100%;max-width:560px;margin:0 auto;padding:14px 10px;box-sizing:border-box;">
        <div style="background:#ffffff;border:1px solid #eadfd5;border-radius:18px;overflow:hidden;">
          <div style="padding:20px 18px;background:#0b0d12;color:#ffffff;">
            <p style="margin:0 0 8px;color:#ff6a2a;font-size:13px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;">New quote request</p>
            <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.18;font-weight:900;">${escapeHtml(lead.name)}</h1>
            <p style="margin:9px 0 0;color:#d6dce5;font-size:15px;line-height:1.45;">Sharif Window Tinting website lead</p>
          </div>

          <div style="padding:18px;">
            <div style="padding:14px;border:1px solid #f1ded2;border-radius:14px;background:#fff8f3;">
              <div style="margin:0 0 4px;color:#6b7280;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Phone</div>
              <div style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:900;line-height:1.25;word-break:break-word;">${escapeHtml(displayPhone)}</div>

              <div style="margin:0 0 4px;color:#6b7280;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Service</div>
              <div style="margin:0 0 12px;color:#111827;font-size:19px;font-weight:900;line-height:1.3;">${escapeHtml(lead.serviceInterest || 'Not provided')}</div>

              <div style="margin:0 0 4px;color:#6b7280;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Vehicle</div>
              <div style="margin:0;color:#111827;font-size:19px;font-weight:900;line-height:1.3;">${escapeHtml(lead.vehicle || 'Not provided')}</div>
            </div>

            <div style="margin:14px 0 16px;">
              ${callAction}
              ${textAction ? `<div style="height:10px;line-height:10px;">&nbsp;</div>${textAction}` : ''}
              ${emailAction ? `<div style="height:10px;line-height:10px;">&nbsp;</div>${emailAction}` : ''}
            </div>

            <div style="margin:0 0 16px;padding:14px;border:1px solid #e8edf3;border-radius:14px;background:#ffffff;">
              <div style="margin:0 0 4px;color:#6b7280;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Email</div>
              <div style="margin:0;color:#111827;font-size:16px;font-weight:800;line-height:1.45;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(displayEmail)}</div>
            </div>

            <div style="margin:0 0 16px;">
              <p style="margin:0 0 2px;color:#111827;font-size:18px;font-weight:900;">Lead details</p>
              ${rows}
            </div>

            <div style="padding:14px;border-radius:14px;background:#111827;">
              <p style="margin:0;color:#f9fafb;font-size:14px;line-height:1.5;">Reply quickly with a quote range, ask for photos if needed, and confirm tint percentage or PPF coverage goals.</p>
            </div>
          </div>
        </div>
        <p style="margin:12px 4px 0;text-align:center;color:#6b7280;font-size:12px;line-height:1.45;">Lead received from sharifwindowtinting.com</p>
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

function buildSupabasePayload(lead) {
  return {
    name: lead.name,
    phone: lead.phone || null,
    email: lead.email || null,
    contact: lead.contact || null,
    vehicle: lead.vehicle,
    service_interest: lead.serviceInterest,
    notes: lead.notes || null,
    page: lead.page || null,
    submitted_at: lead.submittedAt,
    source: 'website',
  };
}

async function saveLeadToSupabase(lead) {
  const supabaseUrl = clean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, 500);
  const supabaseKey = clean(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    2000,
  );
  const table = clean(process.env.SUPABASE_LEADS_TABLE || 'leads', 80);

  if (!supabaseUrl || !supabaseKey || !table) {
    return { ok: false, skipped: true, reason: 'missing_supabase_env' };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${encodeURIComponent(table)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  let supabaseResponse;

  try {
    supabaseResponse = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(buildSupabasePayload(lead)),
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!supabaseResponse.ok) {
    const details = await supabaseResponse.text();
    return {
      ok: false,
      skipped: false,
      reason: 'supabase_insert_failed',
      details: details.slice(0, 500),
    };
  }

  return { ok: true };
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
    const from = process.env.RESEND_FROM || 'Sharif Window Tinting <quotes@sharifwindowtinting.com>';
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

    const storage = await saveLeadToSupabase(lead).catch((error) => ({
      ok: false,
      skipped: false,
      reason: 'supabase_request_failed',
      details: String(error?.message || error).slice(0, 500),
    }));

    if (!resendApiKey) {
      if (storage.ok) {
        response.status(200).json({
          ok: true,
          storage,
          email: { ok: false, skipped: true, reason: 'missing_resend_api_key' },
        });
        return;
      }

      response.status(503).json({
        ok: false,
        error: 'Resend API key is not configured yet, and Supabase did not save the lead.',
        code: 'missing_resend_api_key',
        storage,
      });
      return;
    }

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
      if (storage.ok) {
        response.status(200).json({
          ok: true,
          storage,
          email: {
            ok: false,
            reason: 'resend_rejected',
            details: details.slice(0, 500),
          },
        });
        return;
      }

      response.status(502).json({
        ok: false,
        error: 'Resend did not accept the lead email, and Supabase did not save the lead.',
        details: details.slice(0, 500),
        storage,
      });
      return;
    }

    const result = await resendResponse.json();
    response.status(200).json({ ok: true, id: result.id, email: { ok: true, id: result.id }, storage });
  } catch (error) {
    response.status(500).json({ ok: false, error: 'Could not send lead email.' });
  }
}
