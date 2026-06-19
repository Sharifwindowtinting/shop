# Sharif Window Tinting

React/Vite website for Sharif Window Tinting with service sections, quote form, legal pages, and Resend lead email delivery.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Lead Form

The quote form posts to `/api/lead` and sends lead notifications through Resend.

Required environment variables:

```text
RESEND_API_KEY=
LEAD_NOTIFY_TO=sharifwindowtinting@gmail.com
RESEND_FROM=Sharif Window Tinting <contact@getproclix.com>
```

See `RESEND_SETUP.md` for more detail.
