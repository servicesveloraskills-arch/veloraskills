import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/adminAuth";
import { adminRows as fallbackRows, adminMetrics as fallbackMetrics } from "@/data/site";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE)?.value;

    if (!isValidAdminSession(session)) {
      return Response.json({ ok: false, message: "Unauthorized admin access." }, { status: 401 });
    }

    let applications = [];
    let metrics = [];
    let contactMessages = [];
    let newsletterSubscribers = [];

    try {
      // 1. Query real applications with offer letter & certificate join
      applications = await query(
        `SELECT 
          a.id,
          a.intern_id,
          a.full_name,
          a.email,
          a.phone,
          a.domain,
          a.status,
          a.progress_percent,
          a.created_at,
          ol.status as offer_letter_status,
          ol.issue_date as offer_issue_date,
          c.certificate_id,
          c.status as certificate_status,
          c.issue_date as cert_issue_date
        FROM internship_applications a
        LEFT JOIN offer_letters ol ON a.id = ol.application_id
        LEFT JOIN certificates c ON a.id = c.application_id
        ORDER BY a.created_at DESC
        LIMIT 100`
      );

      // 2. Query contact messages
      try {
        contactMessages = await query(`SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50`);
      } catch (cErr) {
        contactMessages = [];
      }

      // 3. Query newsletter subscribers
      try {
        newsletterSubscribers = await query(`SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 50`);
      } catch (nErr) {
        newsletterSubscribers = [];
      }

      // 4. Query real metrics counts
      const totalCountRes = await query(`SELECT COUNT(*) as count FROM internship_applications`);
      const activeCountRes = await query(`SELECT COUNT(*) as count FROM internship_applications WHERE status IN ('active', 'approved')`);
      const completedCountRes = await query(`SELECT COUNT(*) as count FROM internship_applications WHERE status = 'completed'`);
      const pendingCountRes = await query(`SELECT COUNT(*) as count FROM internship_applications WHERE status = 'pending'`);

      const totalApps = parseInt(totalCountRes[0]?.count || "0", 10);
      const activeInterns = parseInt(activeCountRes[0]?.count || "0", 10);
      const completedCertificates = parseInt(completedCountRes[0]?.count || "0", 10);
      const pendingReviews = parseInt(pendingCountRes[0]?.count || "0", 10);

      metrics = [
        { label: "New applications", value: totalApps.toString() },
        { label: "Active interns", value: activeInterns.toString() },
        { label: "Pending reviews", value: pendingReviews.toString() },
        { label: "Certificates ready", value: completedCertificates.toString() },
      ];
    } catch (dbErr) {
      console.warn("⚠️ Database query warning in admin data, using fallback mock data:", dbErr.message);
      applications = fallbackRows.map((row, idx) => ({
        id: idx + 1,
        intern_id: `VS-2026-0010${idx + 1}`,
        full_name: row.name,
        email: `${row.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: "+91 98765 43210",
        domain: row.domain,
        status: row.status.toLowerCase(),
        progress_percent: row.status === "Completed" ? 100 : row.status === "Active" ? 60 : 20,
        created_at: new Date().toISOString(),
        offer_letter_status: "issued",
        certificate_status: row.status === "Completed" ? "valid" : "pending",
      }));
      metrics = fallbackMetrics;
    }

    return Response.json({
      ok: true,
      applications,
      metrics,
      contactMessages,
      newsletterSubscribers,
    });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Failed to fetch admin data.", detail: error.message },
      { status: 500 }
    );
  }
}
