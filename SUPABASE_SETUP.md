# Supabase Lead Storage Setup

The quote form submits to `/api/lead`. The API route can save each lead to Supabase Cloud and send the email through Resend.

## 1. Create The Leads Table

In Supabase, open `SQL Editor`, paste the contents of `supabase/leads.sql`, and run it.

The table is `public.leads`.

## 2. Add Vercel Environment Variables

In Vercel, open the project, then go to `Settings -> Environment Variables`.

Add:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_LEADS_TABLE=leads
```

Use the service role key only in Vercel environment variables. Do not expose it in frontend code.

## 3. Keep Resend Enabled

Recommended production env vars:

```text
RESEND_API_KEY=your_resend_api_key
LEAD_NOTIFY_TO=sharifwindowtinting@gmail.com
RESEND_FROM=Sharif Window Tinting <contact@getproclix.com>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_LEADS_TABLE=leads
```

## Reliability Behavior

- If Resend sends and Supabase saves, the customer sees success.
- If Supabase saves but Resend has an email issue, the customer still sees success because the lead was captured.
- If Resend sends but Supabase is not configured, the customer sees success and the lead arrives by email.
- If both Resend and Supabase fail, the customer sees the phone/email fallback message.
