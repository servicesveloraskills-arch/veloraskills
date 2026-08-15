import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, topic, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { ok: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1. Ensure contact_messages table exists
    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(160) NOT NULL,
        email VARCHAR(190) NOT NULL,
        topic VARCHAR(160),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Insert message
    await query(
      `INSERT INTO contact_messages (full_name, email, topic, message, status)
       VALUES (:name, :email, :topic, :message, 'new')`,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        topic: topic ? topic.trim() : "General Support",
        message: message.trim(),
      }
    );

    return Response.json({
      ok: true,
      message: "Thank you! Your message has been sent to VeloraSkills support team.",
    });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Failed to send contact message.", detail: error.message },
      { status: 500 }
    );
  }
}
