# Fugenmeister GmbH - Web Application

A modern, high-performance website for **Fugenmeister GmbH** (Swiss Waterproofing and Sealing Engineering) imported from Stitch MCP.

## 🚀 Features & Pages

- **[Home (`index.html`)](index.html)**: Hero section, market leadership badges, bento trust grid, call-to-action sections.
- **[Leistungen (`leistungen.html`)](leistungen.html)**: Comprehensive service list (Rissverpressung, Fugenabdichtung, Flüssigkunststoff, etc.).
- **[Projekte (`projekte.html`)](projekte.html)**: Project portfolio showcasing structural waterproofing case studies.
- **[Über Uns (`uber-uns.html`)](uber-uns.html)**: Company profile, Swiss quality standards, team values.
- **[Kontakt (`kontakt.html`)](kontakt.html)**: Interactive inquiry form, contact details, FAQ accordion.
- **[Design System (`design_system.md`)](design_system.md)**: Design tokens, color palette `#0055A4`, typography scales (Inter font).

---

## 🛠️ Deploy to Vercel

### Option 1: Via Vercel CLI

Run the following command from the root directory:

```bash
npx vercel
```

Follow the prompts to link your project and deploy. To deploy to production:

```bash
npx vercel --prod
```

### Option 2: Via GitHub / Git Repository

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Leave the Framework Preset as **Other** (Static Site).
5. Click **Deploy**.

---

## 💻 Local Development

To run the site locally:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## Contact form and Resend

The contact and quote form posts to the Vercel Function at `/api/contact`. Add these environment variables in **Vercel → Project Settings → Environment Variables** before deploying:

```text
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=the-address-that-receives-leads@example.ch
CONTACT_FROM_EMAIL=Fugenmeister Website <anfragen@your-verified-domain.ch>
```

`CONTACT_FROM_EMAIL` must use a domain verified in Resend. The fallback `onboarding@resend.dev` is useful only for initial Resend testing. Apply the variables to Production, Preview, and Development as appropriate, then redeploy the project.
