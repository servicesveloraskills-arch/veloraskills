import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || !email.includes("@")) {
      return Response.json(
        { ok: false, message: "Valid email address is required." },
        { status: 400 }
      );
    }

    // 1. Ensure newsletter_subscribers table exists
    await query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(190) NOT NULL UNIQUE,
        status VARCHAR(20) DEFAULT 'subscribed',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Insert or update subscriber
    await query(
      `INSERT INTO newsletter_subscribers (email, status)
       VALUES (:email, 'subscribed')
       ON CONFLICT (email) DO UPDATE SET status = 'subscribed'`,
      { email: email.trim().toLowerCase() }
    );

    return Response.json({
      ok: true,
      message: "Successfully subscribed to VeloraSkills updates!",
    });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Subscription failed.", detail: error.message },
      { status: 500 }
    );
  }
}
