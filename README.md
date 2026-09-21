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
RESEND_FROM=Sharif Window Tinting <quotes@sharifwindowtinting.com>
```

See `RESEND_SETUP.md` for more detail.

## Mobile site

The homepage renders the approved mobile design at widths up to 768px and the existing desktop site above that breakpoint. Mobile components live in `src/MobileSite.jsx`; `src/responsive.css` scopes the desktop and mobile styles to their respective screen widths. The original design preview remains at `/mobile-mockup.html`.

The mobile quote form posts to the existing `/api/lead` endpoint and includes selected film details in the message. It preserves entered details after an error, prevents duplicate submissions while sending, and supports property inquiries. Hero video playback respects reduced-motion preferences and includes a play/pause control.

With the development server running and Google Chrome installed, run `node scripts/check-mobile.mjs` to check responsive layouts and interactions. Lead requests are intercepted by this check; it does not send email or create real leads. Use the existing Resend/Supabase environment configuration for actual submissions.
