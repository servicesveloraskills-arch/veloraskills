import { query } from "@/lib/mysql";

export async function POST(request) {
  try {
    const body = await readBody(request);
    const fullName = clean(body.fullName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const domain = clean(body.domain);
    const portfolio = clean(body.portfolio);

    if (!fullName || !email || !phone || !domain) {
      return Response.json(
        { ok: false, message: "Full name, email, phone, and domain are required." },
        { status: 400 },
      );
    }

    const result = await query(
      `INSERT INTO internship_applications
        (full_name, email, phone, domain, portfolio_url, source, status)
       VALUES
        (:fullName, :email, :phone, :domain, :portfolio, :source, 'pending')`,
      {
        fullName,
        email,
        phone,
        domain,
        portfolio: portfolio || null,
        source: "website",
      },
    );

    const internId = `VS-${new Date().getFullYear()}-${String(result.insertId).padStart(5, "0")}`;

    await query(
      "UPDATE internship_applications SET intern_id = :internId WHERE id = :id",
      { internId, id: result.insertId },
    );

    return Response.json({
      ok: true,
      message: "Application submitted successfully.",
      internId,
    });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Application could not be saved.", detail: error.message },
      { status: 500 },
    );
  }
}

async function readBody(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}
