import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
const TO = "info@miaretailsolutions.com";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email servis nije konfigurisan." }, { status: 503 });
  }
  const resend = new Resend(apiKey);

  try {
    const body = await req.json();
    const { name, company, email, phone, subject, message } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Ime i email su obavezni." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "MIA Retail Solutions <kontakt@miaretailsolutions.com>",
      to: TO,
      replyTo: email,
      subject: `Novi upit: ${subject || "Kontakt forma"} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafb;border-radius:12px;">
          <div style="background:#0B1D33;padding:20px 24px;border-radius:8px 8px 0 0;margin-bottom:0;">
            <img src="https://miaretailsolutions.com/assets/images/logo/mia-retail-solutions-vectorized-clean.svg" alt="MIA" style="height:28px;filter:brightness(0) invert(1);" />
          </div>
          <div style="background:#fff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8ed;border-top:none;">
            <h2 style="color:#0B1D33;margin:0 0 20px;font-size:20px;">Novi upit sa kontakt forme</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;width:120px;">Ime i prezime</td><td style="padding:8px 0;color:#111827;font-weight:600;">${name}</td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Firma</td><td style="padding:8px 0;color:#111827;">${company}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#0F766E;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Telefon</td><td style="padding:8px 0;color:#111827;"><a href="tel:${phone}" style="color:#0F766E;">${phone}</a></td></tr>` : ""}
              ${subject ? `<tr><td style="padding:8px 0;color:#6B7B8A;font-size:13px;">Predmet</td><td style="padding:8px 0;color:#111827;">${subject}</td></tr>` : ""}
            </table>
            ${message ? `
              <div style="margin-top:20px;padding:16px;background:#f8fafb;border-radius:8px;border-left:4px solid #0F766E;">
                <div style="font-size:12px;color:#6B7B8A;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;">Poruka</div>
                <div style="color:#111827;line-height:1.6;">${message.replace(/\n/g, "<br>")}</div>
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
