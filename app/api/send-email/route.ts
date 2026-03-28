import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔥 CHANGE THIS TO YOUR EMAIL
const ADMIN_EMAIL = "your-email@gmail.com";

export async function POST(req: Request) {
  try {
    const { email, name, ticket, phone, category, query } = await req.json();

    // ================= USER EMAIL =================
    await resend.emails.send({
      from: "Oh So Legal <onboarding@resend.dev>",
      to: email,
      subject: "Your Query Has Been Received",
      html: `
        <p>Hello ${name},</p>

        <p>Your query has been successfully received.</p>

        <p><strong>Ticket ID:</strong> ${ticket}</p>

        <p>An advocate will review your query and respond within 36 hours.</p>

        <br/>

        <p style="font-size:12px;color:gray;">
        Disclaimer: This response is for general legal awareness only and does not constitute legal advice.
        </p>

        <p>– Team Oh! So Legal</p>
      `,
    });

    // ================= ADMIN EMAIL =================
    await resend.emails.send({
      from: "Oh So Legal <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `New Legal Query Received (${ticket})`,
      html: `
        <h3>New Query Submitted</h3>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Category:</strong> ${category}</p>

        <br/>

        <p><strong>Query:</strong></p>
        <p>${query}</p>

        <br/>

        <p><strong>Ticket ID:</strong> ${ticket}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Email failed" });
  }
}