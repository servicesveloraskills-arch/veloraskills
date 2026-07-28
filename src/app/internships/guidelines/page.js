import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const guidelines = [
  "Submit correct personal details while applying because these details are used for offer letters and certificates.",
  "Join the student portal after approval and check task deadlines regularly.",
  "Complete every assigned task with original work, clean documentation, and working project links.",
  "Use GitHub, portfolio links, reports, or drive links based on the domain requirement.",
  "Submissions are reviewed by the admin or mentor team before progress is updated.",
  "Payment verification, if applicable, must be completed before final certificate release.",
  "Certificates can be verified publicly using certificate ID, intern ID, or QR code.",
];

export const metadata = {
  title: "Internship Guidelines | VeloraSkills",
  description: "Read VeloraSkills internship guidelines for applications, tasks, submissions, reviews, and certificates.",
};

export default function InternshipGuidelinesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--about">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Internship guidelines</p>
            <h1>Clear rules for a smooth internship experience.</h1>
            <p>
              Follow these guidelines to keep your offer letter, dashboard,
              task submissions, review status, and certificate process on track.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container guideline-list">
            {guidelines.map((item, index) => (
              <article className="panel guideline-card" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
