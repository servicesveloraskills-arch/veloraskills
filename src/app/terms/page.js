import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata = {
  title: "Terms & Conditions | VeloraSkills",
  description: "Read the official Terms and Conditions for enrolling in VeloraSkills Virtual Internships.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--services">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Legal & Compliance</p>
            <h1>Terms & Conditions</h1>
            <p>
              Last updated: August 15, 2026. Please read these terms carefully before participating in VeloraSkills programs.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container legal-content" style={{ maxWidth: "860px", lineHeight: "1.7" }}>
            <h2>1. Program Overview & Enrollment</h2>
            <p>
              VeloraSkills provides project-based virtual internship programs across Tech and Non-Tech domains. By submitting an application, you agree to provide truthful information and adhere to program timelines.
            </p>

            <h2 style={{ marginTop: "2rem" }}>2. Student Code of Conduct & Academic Honesty</h2>
            <p>
              All project submissions must represent original work or properly cited resources. Plagiarism, fraudulent task links, or misuse of another student's Intern ID will result in immediate termination without certificate eligibility.
            </p>

            <h2 style={{ marginTop: "2rem" }}>3. Certificate & Offer Letter Issuance</h2>
            <ul>
              <li>Offer Letters are generated upon application and enrollment.</li>
              <li>Final Completion Certificates and Experience Letters are issued only after review and approval of required task submissions by the admin/mentor team.</li>
              <li>VeloraSkills reserves the right to revoke certificates if fraudulent activity is discovered post-issuance.</li>
            </ul>

            <h2 style={{ marginTop: "2rem" }}>4. Intellectual Property</h2>
            <p>
              All course structure, templates, platform features, and branding belong to VeloraSkills. Projects completed during the internship remain the property of the student to showcase in their personal portfolio.
            </p>

            <h2 style={{ marginTop: "2rem" }}>5. Limitation of Liability</h2>
            <p>
              VeloraSkills is an educational and skills enablement platform. We do not guarantee job placements or third-party employment outcomes, though we provide verification tools and career resources to support your job search.
            </p>

            <h2 style={{ marginTop: "2rem" }}>6. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of our platform constitutes acceptance of updated terms.
            </p>

            <h2 style={{ marginTop: "2rem" }}>7. Contact Information</h2>
            <p>
              For legal inquiries regarding our terms, write to us at{" "}
              <a href="mailto:support@veloraskills.tech" style={{ color: "#2563eb", textDecoration: "underline" }}>
                support@veloraskills.tech
              </a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
