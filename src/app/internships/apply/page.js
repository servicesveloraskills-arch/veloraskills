import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { programs } from "@/data/site";

export const metadata = {
  title: "Apply for Internship | VeloraSkills",
  description: "Apply for a VeloraSkills internship across 40 tech and non-tech domains.",
};

export default async function ApplyInternshipPage({ searchParams }) {
  const params = await searchParams;
  const selectedDomain =
    typeof params?.domain === "string" && programs.some((program) => program.title === params.domain)
      ? params.domain
      : "";
  const featuredPrograms = programs.filter((program) => program.featured).slice(0, 10);

  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--services">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Apply for internship</p>
            <h1>Choose your VeloraSkills domain and start your internship journey.</h1>
            <p>
              Submit your application for any of our 40 domains. After approval,
              you can access your student portal, tasks, offer letter, payment,
              and certificate workflow.
            </p>
          </div>
        </section>

        <section className="section" id="apply-form">
          <div className="container apply-grid">
            <div>
              <p className="eyebrow">Top enrollment domains</p>
              <h2>Popular tracks students choose first.</h2>
              <div className="domain-mini-list">
                {featuredPrograms.map((program) => (
                  <span key={program.title}>{program.title}</span>
                ))}
              </div>
            </div>
            <ApplyForm initialDomain={selectedDomain} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
