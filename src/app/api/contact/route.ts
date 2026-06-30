import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
const TO = "info@miaretailsolutions.com";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, "<br>");
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254 && !e.includes("\r") && !e.includes("\n");
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email servis nije konfigurisan." }, { status: 503 });
  }
  const resend = new Resend(apiKey);

  try {
    const body = await req.json();
    const { name, company, email, phone, subject, message } = body;

    if (!name || typeof name !== "string" || name.length > 200)
      return NextResponse.json({ error: "Ime je obavezno." }, { status: 400 });
    if (!email || !isValidEmail(String(email)))
      return NextResponse.json({ error: "Neispravna email adresa." }, { status: 400 });
    if (message && message.length > 5000)
      return NextResponse.json({ error: "Poruka je predugačka (max 5000 znakova)." }, { status: 400 });

    const safeName = esc(String(name));
    const safeCompany = company ? esc(String(company)) : null;
    const safeEmail = esc(String(email));
    const safePhone = phone ? esc(String(phone)) : null;
    const safeSubject = subject ? esc(String(subject)) : null;
    const safeMessage = message ? esc(String(message)) : null;

    const { error } = await resend.emails.send({
      from: "MIA Retail Solutions <kontakt@miaretailsolutions.com>",
      to: TO,
      replyTo: email,
      subject: `Novi upit: ${safeSubject || "Kontakt forma"} — ${safeName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafb;border-radius:12px;">
          <div style="background:#0B1D33;padding:20px 24px;border-radius:8px 8px 0 0;margin-bottom:0;">
            <img src="https://miaretailsolutions.com/assets/images/logo/mia-retail-solutions-vectorized-clean.svg" alt="MIA" style="height:28px;filter:brightness(0) invert(1);" />
          </div>
          <div style="background:#fff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8ed;border-top:none;">
            <h2 style="color:#0B1D33;margin:0 0 20px;font-size:20px;">Novi upit sa kontakt forme</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;width:120px;">Ime i prezime</td><td style="padding:8px 0;color:#111827;font-weight:600;">${safeName}</td></tr>
              ${safeCompany ? `<tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Firma</td><td style="padding:8px 0;color:#111827;">${safeCompany}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#0F766E;">${safeEmail}</a></td></tr>
              ${safePhone ? `<tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Telefon</td><td style="padding:8px 0;color:#111827;"><a href="tel:${safePhone}" style="color:#0F766E;">${safePhone}</a></td></tr>` : ""}
              ${safeSubject ? `<tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Predmet</td><td style="padding:8px 0;color:#111827;">${safeSubject}</td></tr>` : ""}
            </table>
            ${safeMessage ? `
              <div style="margin-top:20px;padding:16px;background:#f8fafb;border-radius:8px;border-left:4px solid #0F766E;">
                <div style="font-size:12px;color:#6B7B8A;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;">Poruka</div>
                <div style="color:#111827;line-height:1.6;">${safeMessage}</div>
              </div>
            ` : ""}
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e2e8ed;font-size:12px;color:#9CA3AF;">
              Upit primljen sa <strong>miaretailsolutions.com/kontakt</strong>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Greška pri slanju. Pokušajte ponovo." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "Neočekivana greška." }, { status: 500 });
  }
}
