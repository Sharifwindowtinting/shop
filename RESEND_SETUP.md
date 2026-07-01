# Resend Lead Form Setup

The quote form submits to `/api/lead`, and the Vercel API route sends the lead by email through Resend.
If Supabase env vars are configured, the same route also saves a backup copy of the lead.

## Required Environment Variables

Add these in Vercel under `Settings -> Environment Variables`, then redeploy:

```text
RESEND_API_KEY=your_resend_api_key
LEAD_NOTIFY_TO=sharifwindowtinting@gmail.com
RESEND_FROM=Sharif Window Tinting <contact@getproclix.com>
```

For launch, make sure the `getproclix.com` domain is verified in Resend. Resend will reject messages to Gmail recipients unless the `from` address uses a verified domain.

```text
RESEND_FROM=Sharif Window Tinting <contact@getproclix.com>
```

## Optional Supabase Backup

Add these only if you want every lead saved in Supabase too:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_LEADS_TABLE=leads
```

Recommended `leads` table columns:

```sql
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  contact text,
  vehicle text not null,
  service_interest text,
  notes text,
  page text,
  source text default 'website',
  submitted_at timestamptz not null,
  created_at timestamptz default now()
);
```

Supabase is treated as a backup. If the table is not ready, Resend can still send the lead email and the customer will not be blocked.

## Local Testing

Create `.env.local` with the same variables if you want local submissions from `127.0.0.1:5173` to send real emails.

## Fields Included In The Email

The lead email includes:

```text
name
phone
email
vehicle
service interest
notes
page
submitted time
```

The visitor stays on the website and sees an inline success message after Resend accepts the email.
