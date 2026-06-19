# Resend Lead Form Setup

The quote form submits to `/api/lead`, and the Vercel API route sends the lead by email through Resend.

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
