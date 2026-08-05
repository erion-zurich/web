const RESEND_API_URL = "https://api.resend.com/emails";
const MAX_FIELD_LENGTH = 4000;

function json(response, status, body) {
  response
    .status(status)
    .setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  return response.end(JSON.stringify(body));
}

function clean(value, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

async function sendEmail(apiKey, payload) {
  const result = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await result.json().catch(() => ({}));
  if (!result.ok) {
    const error = new Error(data.message || "Resend request failed");
    error.status = result.status;
    throw error;
  }
  return data;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: "Method not allowed." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
    return json(response, 503, {
      error: "Der Nachrichtendienst ist noch nicht konfiguriert.",
    });
  }

  let body;
  try {
    body =
      typeof request.body === "string"
        ? JSON.parse(request.body)
        : request.body || {};
  } catch {
    return json(response, 400, { error: "Ungültige Anfrage." });
  }

  if (JSON.stringify(body).length > 12000) {
    return json(response, 413, { error: "Die Anfrage ist zu gross." });
  }
  const submittedAt = Number(body.submittedAt || 0);

  // Honeypot and timing checks reject common automated submissions silently.
  if (
    clean(body.website, 200) ||
    !submittedAt ||
    Date.now() - submittedAt < 2500
  ) {
    return json(response, 200, { ok: true });
  }

  const lead = {
    requestType: clean(body.requestType, 40) || "Kontaktanfrage",
    name: clean(body.name, 160),
    email: clean(body.email, 254).toLowerCase(),
    phone: clean(body.phone, 60),
    postcode: clean(body.postcode, 20),
    service: clean(body.service, 120),
    preferredContact: clean(body.preferredContact, 40),
    message: clean(body.message),
  };

  if (
    !lead.name ||
    !isEmail(lead.email) ||
    !lead.phone ||
    !lead.service ||
    lead.message.length < 10 ||
    body.privacyAccepted !== "on"
  ) {
    return json(response, 400, {
      error: "Bitte füllen Sie alle Pflichtfelder korrekt aus.",
    });
  }

  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Fugenmeister Website <onboarding@resend.dev>";
  const rows = [
    ["Anfrage", lead.requestType],
    ["Name / Firma", lead.name],
    ["E-Mail", lead.email],
    ["Telefon", lead.phone],
    ["PLZ / Ort", lead.postcode || "–"],
    ["Leistung", lead.service],
    ["Bevorzugter Kontakt", lead.preferredContact || "–"],
  ]
    .map(
      ([label, value]) =>
        `<tr><th style="text-align:left;padding:8px 16px 8px 0;color:#5d6570">${escapeHtml(label)}</th><td style="padding:8px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  try {
    await sendEmail(process.env.RESEND_API_KEY, {
      from,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: lead.email,
      subject: `${lead.requestType}: ${lead.name} – ${lead.service}`,
      html: `<div style="font-family:Arial,sans-serif;color:#17202a;max-width:680px"><h1 style="color:#003e7a">Neue Website-Anfrage</h1><table>${rows}</table><h2 style="color:#003e7a;margin-top:28px">Nachricht</h2><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(lead.message)}</p></div>`,
    });

    // Acknowledgement failures should not lose an otherwise delivered lead.
    try {
      await sendEmail(process.env.RESEND_API_KEY, {
        from,
        to: [lead.email],
        reply_to: process.env.CONTACT_TO_EMAIL,
        subject: "Wir haben Ihre Anfrage erhalten – Fugenmeister GmbH",
        html: `<div style="font-family:Arial,sans-serif;color:#17202a;max-width:640px"><h1 style="color:#003e7a">Vielen Dank für Ihre Anfrage</h1><p>Guten Tag ${escapeHtml(lead.name)},</p><p>wir haben Ihre Anfrage erhalten und melden uns so bald wie möglich bei Ihnen.</p><p>Freundliche Grüsse<br><strong>Fugenmeister GmbH</strong><br>Kaiserstuhlstrasse 55<br>8154 Oberglatt</p></div>`,
      });
    } catch (acknowledgementError) {
      console.error("Acknowledgement email failed", acknowledgementError);
    }

    return json(response, 200, { ok: true });
  } catch (error) {
    console.error("Contact submission failed", error);
    return json(response, 502, {
      error:
        "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    });
  }
};
