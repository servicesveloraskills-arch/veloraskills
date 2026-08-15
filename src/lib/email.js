import { Resend } from "resend";

let resendClient;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey !== "re_your_resend_api_key_here") {
      resendClient = new Resend(apiKey);
    }
  }
  return resendClient;
}

export async function sendOfferLetterEmail({ toEmail, fullName, domain, internId, pdfBuffer }) {
  const client = getResendClient();

  if (!client) {
    console.warn(
      `⚠️ Resend API Key is missing or default. Email skipped for ${toEmail}. Set RESEND_API_KEY in .env.local to enable email sending.`
    );
    return { ok: false, message: "Resend API key not configured." };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "VeloraSkills Internship <onboarding@resend.dev>";
  const subject = `Congratulations ${fullName}! Your Internship Offer Letter from VeloraSkills [${internId}]`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: #ffffff; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.5px; }
          .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 30px; line-height: 1.6; }
          .badge-box { background: #eef2ff; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
          .badge-title { font-size: 12px; text-transform: uppercase; color: #4b5563; font-weight: bold; letter-spacing: 0.5px; }
          .badge-value { font-size: 18px; color: #1e293b; font-weight: bold; margin-top: 4px; }
          .button { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; margin-top: 15px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VeloraSkills Internship Program</h1>
            <p>Empowering Next-Gen Tech Talent</p>
          </div>
          <div class="content">
            <h2>Congratulations, ${fullName}! 🎉</h2>
            <p>We are thrilled to inform you that your application for the <strong>${domain}</strong> Virtual Internship at <strong>VeloraSkills</strong> has been accepted!</p>
            
            <div class="badge-box">
              <div class="badge-title">Your Official Intern ID</div>
              <div class="badge-value">${internId}</div>
            </div>

            <p>Your official <strong>Internship Offer Letter</strong> is attached to this email as a PDF document. Please review your offer letter carefully and keep it safe for future reference.</p>
            
            <h3>What's Next?</h3>
            <ol>
              <li>Download your attached Offer Letter PDF.</li>
              <li>Log in to your <strong>Student Portal</strong> using your registered email: <code>${toEmail}</code></li>
              <li>Complete your onboarding and start working on your internship tasks.</li>
            </ol>

            <p style="text-align: center; margin-top: 25px;">
              <a href="https://veloraskills.tech/student/login" class="button" style="color: #ffffff;">Access Student Portal</a>
            </p>

            <p style="margin-top: 30px;">Best Regards,<br><strong>Team VeloraSkills</strong><br><em>support@veloraskills.tech</em></p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} VeloraSkills. All rights reserved.<br>
            If you have any questions, reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `VeloraSkills_Offer_Letter_${internId}.pdf`,
        content: pdfBuffer,
      });
    }

    const data = await client.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject,
      html: htmlContent,
      attachments,
    });

    console.log(`✅ Offer letter email sent via Resend to ${toEmail}. ID: ${data.id || data.data?.id}`);
    return { ok: true, data };
  } catch (error) {
    console.error(`❌ Failed to send email via Resend to ${toEmail}:`, error.message);
    return { ok: false, error: error.message };
  }
}

export async function sendExperienceLetterEmail({ toEmail, fullName, domain, internId, pdfBuffer, issueDate }) {
  const client = getResendClient();

  if (!client) {
    console.warn(
      `⚠️ Resend API Key is missing or default. Completion email skipped for ${toEmail}. Set RESEND_API_KEY in .env.local.`
    );
    return { ok: false, message: "Resend API key not configured." };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "VeloraSkills Internship <onboarding@resend.dev>";
  const subject = `Congratulations ${fullName}! Your Internship Completion & Experience Letter from VeloraSkills [${internId}]`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.5px; }
          .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 30px; line-height: 1.6; }
          .badge-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
          .badge-title { font-size: 12px; text-transform: uppercase; color: #047857; font-weight: bold; letter-spacing: 0.5px; }
          .badge-value { font-size: 18px; color: #065f46; font-weight: bold; margin-top: 4px; }
          .button { display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; margin-top: 15px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Internship Completed Successfully! 🎉</h1>
            <p>VeloraSkills Learning & Development</p>
          </div>
          <div class="content">
            <h2>Dear ${fullName},</h2>
            <p>Congratulations on successfully completing your <strong>${domain}</strong> Virtual Internship at <strong>VeloraSkills</strong>!</p>
            
            <div class="badge-box">
              <div class="badge-title">Internship Completion Verified</div>
              <div class="badge-value">Intern ID: ${internId}</div>
            </div>

            <p>We are delighted to share your official <strong>Internship Completion & Experience Letter</strong> attached to this email as a PDF document.</p>
            
            <p>Your hard work, project submissions, and commitment to learning have been approved by our review team. You can also verify your certificate online anytime using your Intern ID.</p>

            <p style="text-align: center; margin-top: 25px;">
              <a href="https://veloraskills.tech/certificate-verification" class="button" style="color: #ffffff;">Verify Certificate Online</a>
            </p>

            <p style="margin-top: 30px;">We wish you immense success in your tech career!<br><br>Best Regards,<br><strong>Team VeloraSkills</strong><br><em>support@veloraskills.tech</em></p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} VeloraSkills. All rights reserved.<br>
            If you have any questions, reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `VeloraSkills_Experience_Letter_${internId}.pdf`,
        content: pdfBuffer,
      });
    }

    const data = await client.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject,
      html: htmlContent,
      attachments,
    });

    console.log(`✅ Experience letter email sent via Resend to ${toEmail}. ID: ${data.id || data.data?.id}`);
    return { ok: true, data };
  } catch (error) {
    console.error(`❌ Failed to send Experience letter email via Resend to ${toEmail}:`, error.message);
    return { ok: false, error: error.message };
  }
}

