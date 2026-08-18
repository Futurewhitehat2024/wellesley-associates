# Wellesley and Associates LLC

Professional marketing website for Wellesley and Associates LLC — a licensed firm providing **insurance**, **commercial lending**, and **residential mortgage** solutions in one place.

## Pages

- Home
- Insurance hub (Personal Lines + Commercial Lines) and individual product pages
- Commercial Loans hub and individual product pages
- Residential Mortgages (coming soon)
- About, Contact, Request a Quote
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

- Forms validate in the browser and show a confirmation state. They are ready to connect to a form backend (Formspree, Netlify Forms, etc.) when you have an endpoint.
- Product pages are informational and route inquiries to a quote form.
- No standalone Real Estate practice is included. Commercial real estate financing lives under Commercial Loans.
