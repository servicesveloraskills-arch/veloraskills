import { query } from "@/lib/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return Response.json(
        { ok: false, message: "Certificate ID or Intern ID is required." },
        { status: 400 },
      );
    }

    const rows = await query(
      `SELECT
        c.certificate_id,
        c.status,
        c.issue_date,
        a.intern_id,
        a.full_name,
        a.domain
       FROM certificates c
       INNER JOIN internship_applications a ON a.id = c.application_id
       WHERE c.certificate_id = :q OR a.intern_id = :q
       LIMIT 1`,
      { q },
    );

    if (!rows.length) {
      return Response.json(
        { ok: false, message: "No certificate found for this ID." },
        { status: 404 },
      );
    }

    return Response.json({ ok: true, certificate: rows[0] });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Certificate verification failed.", detail: error.message },
      { status: 500 },
    );
  }
}
