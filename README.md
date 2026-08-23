# Wellesley Collective

Professional marketing website for Wellesley Collective — a licensed firm providing **insurance** and **commercial financing** in one place.

## Pages

- Home
- Insurance hub (Personal Lines + Commercial Lines) and individual product pages
- Commercial Financing hub and individual product pages
- About, Contact, Get Started
- Blog
- Privacy Policy and Terms of Use

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
cd wellesley-associates
npx --yes serve .
```

Then visit the local URL printed in the terminal.

## Regenerate pages

Shared navigation and product copy live in `scripts/generate.mjs`.

```bash
node scripts/generate.mjs
```

## Notes

- Forms submit to `rasheed@wellesleycollective.com` via FormSubmit.
- Product pages are informational and route inquiries to Get Started.
- No standalone Real Estate practice is included. Commercial real estate financing lives under Commercial Financing.
