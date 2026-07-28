import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { VerifyForm } from "@/components/forms/VerifyForm";

export const metadata = {
  title: "Certificate Verification | VeloraSkills",
  description: "Verify VeloraSkills internship certificates by certificate ID, intern ID, or QR code.",
};

export default function CertificateVerificationPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--contact">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Certificate verification</p>
            <h1>Verify internship certificates with confidence.</h1>
            <p>
              Search by certificate ID or intern ID. QR certificates can point
              to the same verification route for public validation.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container split-grid">
            <div>
              <p className="eyebrow">Verification details</p>
              <h2>Check name, domain, status, and issue date.</h2>
              <p>
                This page connects to the MySQL-backed verification API and is
                ready for certificate records from the admin dashboard.
              </p>
            </div>
            <VerifyForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
