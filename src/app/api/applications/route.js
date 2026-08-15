import { query } from "@/lib/db";
import { generateOfferLetterPdf } from "@/lib/offerLetter";
import { sendOfferLetterEmail } from "@/lib/email";

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

    // 1. Insert Application Record
    const result = await query(
      `INSERT INTO internship_applications
        (full_name, email, phone, domain, portfolio_url, source, status)
       VALUES
        (:fullName, :email, :phone, :domain, :portfolio, :source, 'approved')`,
      {
        fullName,
        email,
        phone,
        domain,
        portfolio: portfolio || null,
        source: "website",
      },
    );

    const insertedId = result.insertId || result[0]?.id;
    const internId = `VS-${new Date().getFullYear()}-${String(insertedId).padStart(5, "0")}`;

    // 2. Update Application with generated Intern ID
    await query(
      "UPDATE internship_applications SET intern_id = :internId WHERE id = :id",
      { internId, id: insertedId },
    );

    // 3. Create or link Student Account for instant portal access
    const defaultHash = "36e382d56a2bbfa3ea08f6ef1e1d0c92d525ed8a1d74659b8c0a2a4ed118f670"; // student123 hash
    await query(
      `INSERT INTO student_accounts (application_id, intern_id, full_name, email, password_hash, status)
       VALUES (:applicationId, :internId, :fullName, :email, :passwordHash, 'active')
       ON CONFLICT (email) DO UPDATE SET
        application_id = EXCLUDED.application_id,
        intern_id = EXCLUDED.intern_id,
        full_name = EXCLUDED.full_name,
        status = 'active'`,
      {
        applicationId: insertedId,
        internId,
        fullName,
        email,
        passwordHash: defaultHash,
      },
    );

    // 4. Save Offer Letter Record
    const offerLetterId = `OL-${internId}`;
    const issueDate = new Date().toISOString().split("T")[0];
    await query(
      `INSERT INTO offer_letters (application_id, offer_letter_id, issue_date, status)
       VALUES (:applicationId, :offerLetterId, :issueDate, 'issued')
       ON CONFLICT (offer_letter_id) DO NOTHING`,
      {
        applicationId: insertedId,
        offerLetterId,
        issueDate,
      },
    );

    // 5. Generate PDF Offer Letter from public/template.pdf
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateOfferLetterPdf({
        fullName,
        internId,
        domain,
        issueDate,
      });
    } catch (pdfErr) {
      console.error("PDF generation warning:", pdfErr.message);
    }

    // 6. Send Offer Letter Email via Resend
    let emailStatus = { ok: false };
    try {
      emailStatus = await sendOfferLetterEmail({
        toEmail: email,
        fullName,
        domain,
        internId,
        pdfBuffer,
      });
    } catch (emailErr) {
      console.error("Email send warning:", emailErr.message);
    }

    return Response.json({
      ok: true,
      message: emailStatus.ok
        ? "Application submitted! Your Offer Letter has been sent to your email."
        : "Application submitted successfully! Your account and Offer Letter have been generated.",
      internId,
      emailSent: emailStatus.ok,
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
