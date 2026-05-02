// Cloudflare Pages Function — POST /api/contact
// Receives the contact form, validates, and sends an email via Resend.

const TO_EMAIL = "bailey_dougie@yahoo.com";
const FROM_EMAIL = "Ex Machina Printing <forms@exmachinaprinting.com>";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const isValidEmail = (e) =>
  typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "Email service not configured." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const name = (body.name || "").toString().trim();
  const email = (body.email || "").toString().trim();
  const type = (body.type || "Not specified").toString().trim();
  const message = (body.message || "").toString().trim();
  const honeypot = (body.website || "").toString().trim();

  // Honeypot: real users leave this blank; bots fill every field.
  if (honeypot) return json({ ok: true });

  if (!name || name.length > 200) return json({ ok: false, error: "Please enter your name." }, 400);
  if (!isValidEmail(email)) return json({ ok: false, error: "Please enter a valid email." }, 400);
  if (!message || message.length > 5000) return json({ ok: false, error: "Please include a short message." }, 400);

  const subject = `New project inquiry — ${name}`;
  const text =
    `New inquiry from the Ex Machina Printing website\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Project type: ${type}\n\n` +
    `Message:\n${message}\n`;

  const html = `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#0d1b2a;">
      <h2 style="color:#0a2540;margin:0 0 16px;">New project inquiry</h2>
      <p style="color:#5a6a7a;margin:0 0 24px;">Submitted via the Ex Machina Printing website.</p>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr><td style="padding:8px 0;color:#5a6a7a;width:140px;">Name</td><td style="padding:8px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#5a6a7a;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#1751a8;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#5a6a7a;">Project type</td><td style="padding:8px 0;">${escapeHtml(type)}</td></tr>
      </table>
      <h3 style="color:#0a2540;margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;">Message</h3>
      <div style="background:#f5f8fc;border:1px solid #e3e9f1;border-radius:12px;padding:16px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</div>
      <p style="color:#5a6a7a;font-size:13px;margin-top:24px;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
    </div>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => "");
    console.error("Resend error", resendRes.status, detail);
    return json({ ok: false, error: "Could not send right now — please try again or email us directly." }, 502);
  }

  return json({ ok: true });
}

// Block other methods cleanly.
export const onRequest = async ({ request }) => {
  if (request.method === "POST") return onRequestPost(arguments[0]);
  return json({ ok: false, error: "Method not allowed." }, 405);
};
