import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata = {
  title: "Privacy Policy | VeloraSkills",
  description: "Read the official Privacy Policy of VeloraSkills Virtual Internship Platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--services">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Legal & Compliance</p>
            <h1>Privacy Policy</h1>
            <p>
              Last updated: August 15, 2026. VeloraSkills is committed to protecting your privacy and personal data.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container legal-content" style={{ maxWidth: "860px", lineHeight: "1.7" }}>
            <h2>1. Information We Collect</h2>
            <p>
              When you apply for an internship or register an account on VeloraSkills, we collect personal information including:
            </p>
            <ul>
              <li><strong>Personal Data:</strong> Full name, email address, phone number, college/university, and education details.</li>
              <li><strong>Internship Output:</strong> Project submissions, GitHub/portfolio links, task feedback, and score records.</li>
              <li><strong>Technical Logs:</strong> IP address, browser type, device information, and site interaction cookies.</li>
            </ul>

            <h2 style={{ marginTop: "2rem" }}>2. How We Use Your Data</h2>
            <p>Your data is used solely to:</p>
            <ul>
              <li>Process virtual internship applications and generate official Offer Letters and Intern IDs.</li>
              <li>Track progress, evaluate task submissions, and issue verified completion certificates.</li>
              <li>Send critical onboarding communications, task updates, and certificate notifications via email.</li>
              <li>Improve platform security and prevent unauthorized access or fake certificate generation.</li>
            </ul>

            <h2 style={{ marginTop: "2rem" }}>3. Data Protection & Security</h2>
            <p>
              We implement industry-standard encryption, SSL protocols, and secure database access controls (Supabase & PostgreSQL) to keep your records safe. We do not sell or trade your personal data to third parties.
            </p>

            <h2 style={{ marginTop: "2rem" }}>4. Certificate & Verification Public Data</h2>
            <p>
              To maintain academic and professional integrity, issued Certificate IDs and Intern IDs can be verified publicly on our platform. Only your Name, Domain, Issue Date, and Certificate Validity Status are shown on public verification.
            </p>

            <h2 style={{ marginTop: "2rem" }}>5. Cookies & Tracking Technologies</h2>
            <p>
              We use essential cookies to maintain your login session and store your preferences. You can manage or clear cookie preferences through our interactive Cookie Banner or browser settings.
            </p>

            <h2 style={{ marginTop: "2rem" }}>6. Contact Us</h2>
            <p>
              If you have any questions or requests regarding your data, please contact our privacy compliance team at{" "}
              <a href="mailto:privacy@veloraskills.tech" style={{ color: "#2563eb", textDecoration: "underline" }}>
                privacy@veloraskills.tech
              </a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
