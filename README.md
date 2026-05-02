# Ex Machina Printing — Website

Marketing site for [Ex Machina Printing](https://www.exmachinaprinting.com), a veteran-owned custom 3D printing service in New Philadelphia, OH.

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

The form currently uses a `mailto:` fallback (opens the visitor's email client to send to `bailey_dougie@yahoo.com`). To switch to backend-handled submissions, wire a Cloudflare Pages Function or a service like Resend / Web3Forms.
