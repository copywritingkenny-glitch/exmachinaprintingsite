# Scratch Works — Website

Marketing site for [Scratch Works](https://www.scratchworks.us), a veteran-owned custom 3D printing service in New Philadelphia, OH.

## Stack

Plain static HTML, CSS, and JS. No build step.

```
site/
├── index.html       Single-page site (nav, hero, services, gallery, process, why us, founders, contact, footer)
├── styles.css       Theme: white + deep navy + warm orange
├── script.js        Sticky-nav state, mobile menu toggle, reveal-on-scroll, contact-form mailto fallback
└── images/          Print photos and founder portraits
```

## Local preview

Any static server works:

```bash
python -m http.server 5173
# then open http://localhost:5173
```

## Deploy

Hosted on **Cloudflare Pages**. Every push to `main` auto-deploys to production. Branch pushes get preview URLs.

## Contact form

The form posts to a Cloudflare Pages Function (`functions/api/contact.js`) that sends the inquiry to `sales@scratchworks.us` via Resend. Requires the `RESEND_API_KEY` environment variable to be set in the Cloudflare Pages project settings.
