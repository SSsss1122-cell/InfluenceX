import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const escape = (s: string) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ] as string)
  );

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      userType,
      relatedInfluencer,
      relatedInfluencerLabel,
      subject,
      message,
    } = body;

    if (!fullName || !email || !userType || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
      console.error("Missing RESEND_API_KEY or CONTACT_EMAIL env vars");
      return NextResponse.json(
        { error: "Server not configured for email." },
        { status: 500 }
      );
    }

    const safeName = escape(fullName);
    const safeEmail = escape(email);
    const safeUserType = escape(userType);
    const safeSubject = escape(subject);
    const safeMessage = escape(message).replace(/\n/g, "<br/>");
    const safeInfluencer = relatedInfluencerLabel
      ? escape(relatedInfluencerLabel)
      : relatedInfluencer
      ? `ID: ${escape(String(relatedInfluencer))}`
      : "N/A";

    const { error } = await resend.emails.send({
      from: "InfluenceX Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL],
      replyTo: email,
      subject: `[InfluenceX Contact] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2 style="color:#db2777;margin:0 0 12px">New Contact Message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>I am a:</strong> ${safeUserType}</p>
          <p><strong>Related Influencer:</strong> ${safeInfluencer}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p>${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}