import { query } from "@/lib/db";
import { generateExperienceLetterPdf } from "@/lib/experienceLetter";
import { sendExperienceLetterEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { internId, applicationId, durationWeeks = 4 } = body;

    if (!internId && !applicationId) {
      return Response.json(
        { ok: false, message: "internId or applicationId is required." },
        { status: 400 }
      );
    }

    // 1. Fetch application record
    let appResult;
    if (internId) {
      appResult = await query(
        `SELECT * FROM internship_applications WHERE intern_id = :internId LIMIT 1`,
        { internId }
      );
    } else {
      appResult = await query(
        `SELECT * FROM internship_applications WHERE id = :applicationId LIMIT 1`,
        { applicationId }
      );
    }

    const application = appResult?.[0] || appResult;
    if (!application || !application.id) {
      return Response.json(
        { ok: false, message: "Intern application record not found." },
        { status: 404 }
      );
    }

    const targetInternId = application.intern_id;
    const fullName = application.full_name;
    const email = application.email;
    const domain = application.domain;
    const issueDate = new Date().toISOString().split("T")[0];
    const certId = `CERT-${targetInternId}`;

    // 2. Update Application Status to 'completed'
    await query(
      `UPDATE internship_applications 
       SET status = 'completed', progress_percent = 100, updated_at = CURRENT_TIMESTAMP 
       WHERE id = :id`,
      { id: application.id }
    );

    // 3. Save / Update Certificate Record
    await query(
      `INSERT INTO certificates (application_id, certificate_id, issue_date, status)
       VALUES (:appId, :certId, :issueDate, 'valid')
       ON CONFLICT (certificate_id) DO UPDATE SET status = 'valid', issue_date = EXCLUDED.issue_date`,
      {
        appId: application.id,
        certId,
        issueDate,
      }
    );

    // 4. Generate Experience Letter PDF
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateExperienceLetterPdf({
        fullName,
        internId: targetInternId,
        domain,
        issueDate,
        durationWeeks,
      });
    } catch (pdfErr) {
      console.error("Experience Letter PDF generation error:", pdfErr.message);
    }

    // 5. Send Email with Experience Letter PDF attached
    let emailStatus = { ok: false };
    try {
      emailStatus = await sendExperienceLetterEmail({
        toEmail: email,
        fullName,
        domain,
        internId: targetInternId,
        pdfBuffer,
        issueDate,
      });
    } catch (emailErr) {
      console.error("Experience Letter Email error:", emailErr.message);
    }

    return Response.json({
      ok: true,
      message: `Internship completion approved for ${fullName}! Experience letter email sent.`,
      internId: targetInternId,
      certificateId: certId,
      emailSent: emailStatus.ok,
    });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Failed to approve completion.", detail: error.message },
      { status: 500 }
    );
  }
}
