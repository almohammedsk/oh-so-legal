import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, subject, message } = body;

    if (!email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: "Oh So Legal <onboarding@resend.dev>", // change later
      to: [email],
      subject: subject || "Response from Oh! So Legal",
      text: message,
    });

    console.log("EMAIL SENT:", data);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Email failed" },
      { status: 500 }
    );
  }
}