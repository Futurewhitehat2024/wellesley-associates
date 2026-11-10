# Wellesley Collective

Professional marketing website for Wellesley Collective — a licensed firm providing **insurance**, **commercial financing**, and **real estate** in one place.

## Pages

- Home
- Insurance hub (Personal Lines + Commercial Lines) and individual product pages
- Commercial Financing hub and individual product pages
- Real Estate hub (Buy, Sell, Invest) with live listings on Rasheed’s London Foster Realty site
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
- Real estate brokerage is offered through London Foster Realty. MLS search lives at https://rasheedwellesley.londonfosternaples.com/ (Lofty blocks iframes, so the site links out).
- Commercial real estate financing lives under Commercial Financing. Do not market residential mortgages.
