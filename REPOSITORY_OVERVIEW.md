# Repository overview

Scanned: 15 November 2026. This document records the current website structure as a reference for future change requests. No website functionality was changed during this scan.

## Website and stack

The repository contains the German-language Fugenmeister GmbH website for waterproofing and sealing services in Switzerland.

- Five standalone HTML pages, with no frontend framework or build step.
- Tailwind CSS loaded in the browser from its CDN, with theme configuration embedded in each page.
- Shared CSS and vanilla JavaScript, alongside page-specific inline styling and scripts.
- Inter and Material Symbols Outlined loaded from Google Fonts.
- Many photographs hosted externally on Google image URLs; the shared logo is stored locally as SVG.
- Vercel hosting configuration and a Node.js serverless contact endpoint using Resend.
- `package.json` declares development commands but no dependencies, test script, or build script.

## File map

| File | Purpose |
| --- | --- |
| `index.html` | Homepage, service introduction, trust content, and calls to action. |
| `leistungen.html` | Services page. |
| `projekte.html` | Project portfolio and case studies. |
| `uber-uns.html` | Company profile and values. |
| `kontakt.html` | Contact details, inquiry form, and FAQ content. |
| `brand.css` | Shared branding, responsive navigation, mobile typography, and form styles. |
| `brand.js` | Replaces header branding, updates footer logos, creates the mobile menu, and routes quote calls to action. |
| `contact-form.js` | Contact form submission, quote mode, loading states, and success/error feedback. |
| `api/contact.js` | Validates inquiries and sends lead and acknowledgement emails through Resend. |
| `assets/fugenmeister-logo-v2.svg` | Shared company logo. |
| `design_system.md` | Documented colors, typography, spacing, and design direction. |
| `vercel.json` | Clean URLs, trailing slash behavior, and response headers. |
| `package.json` | Project metadata and local server commands. |
| `README.md` | Existing project, deployment, and email configuration instructions. |

## Shared behavior and design

The visual theme uses dark blue (`#003e7a`), brand blue (`#0055a4`), pale gray surfaces, and Inter typography. Tailwind theme settings are repeated across the HTML files, so changes to those settings may require edits in all five pages. Consult the actual HTML and `brand.css` as well as the design document when changing the design.

Headers and footers are repeated in the HTML. `brand.js` changes parts of that markup at runtime, including the company logo/name and quote links. Future header changes should account for both the source HTML and this script.

The shared navigation switches to a mobile menu below 1024px. Additional mobile layout and typography rules apply below 640px, with a further brand-name adjustment below 381px.

Quote links route to `kontakt.html?type=quote#contactForm`. The contact script reads that query parameter and changes the inquiry type and heading.

## Contact flow

1. The visitor completes `#contactForm` on `kontakt.html`.
2. `contact-form.js` posts JSON to `/api/contact`.
3. The endpoint checks the payload, required fields, email format, privacy consent, a honeypot field, and submission timing.
4. Resend delivers the inquiry to the configured business recipient.
5. The endpoint attempts a separate acknowledgement email to the visitor. A failed acknowledgement does not invalidate a successfully delivered inquiry.

Deployment configuration uses these environment variables:

- `RESEND_API_KEY`: Resend credentials.
- `CONTACT_TO_EMAIL`: Business recipient for inquiries.
- `CONTACT_FROM_EMAIL`: Sender identity; the code falls back to a Resend onboarding address when omitted.

No environment variable values or deployment settings were inspected in this scan.

## Local preview and validation

Run `npm run dev` or `npm start` from the repository root. Both execute `npx serve .`; the README documents `http://localhost:3000` for preview. The command may download the server through npx if it is not already available.

This static preview serves the frontend; it does not execute the Vercel contact function. End-to-end email verification requires an environment that runs that function with the relevant variables configured.

For future changes, check the affected pages at desktop and mobile widths, navigation behavior, quote links, and contact states where relevant. There is currently no automated test command declared in `package.json`.

## Notes for future requests

- Page content and section layout: edit the corresponding HTML file.
- Shared presentation and mobile behavior: inspect `brand.css` and the repeated Tailwind settings.
- Navigation, branding, and quote routing: inspect `brand.js` together with page headers and footers.
- Contact fields: keep `kontakt.html`, `contact-form.js`, and `api/contact.js` consistent.
- Some source links use `href="#"`; quote links are rewritten by JavaScript, while other placeholder destinations should be reviewed when their sections change.
- Externally hosted fonts, icons, Tailwind, and images require network access.

This was a source review, not a browser, accessibility, security, or live email audit. No application was started, deployed, or submitted through the contact form. Future changes remain pending the user's requests.
