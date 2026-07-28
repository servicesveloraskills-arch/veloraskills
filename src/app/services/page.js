import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { programs, services } from "@/data/site";

export const metadata = {
  title: "Services | VeloraSkills",
  description: "Explore VeloraSkills services including virtual internships, verification, admin tools, and AI career support.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--services">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Services</p>
            <h1>Internship infrastructure for students, mentors, and admins.</h1>
            <p>
              From application to certificate, VeloraSkills gives each workflow a
              clean digital path backed by dashboards, data, and verification.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container service-grid">
            {services.map((service) => (
              <article className="service-card service-card--lift" key={service.title}>
                <h2>{service.title}</h2>
                <p>{service.copy}</p>
                <div className="chip-list chip-list--light">
                  {service.points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--tech">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Internship domains</p>
              <h2>Services mapped to all 40 VeloraSkills internship domains.</h2>
            </div>
            <div className="program-grid">
              {programs.map((program) => (
                <Link
                  className="program-card program-card--clickable"
                  href={`/internships/apply?domain=${encodeURIComponent(program.title)}#apply-form`}
                  key={program.title}
                >
                  <div>
                    <div className="program-card__top">
                      <span className="program-card__icon">{program.icon}</span>
                      <span className="program-card__category">{program.category}</span>
                    </div>
                    {program.featured ? (
                      <span className="program-card__featured">Top enrollment domain</span>
                    ) : null}
                    <h3>{program.title}</h3>
                    <p>{program.summary}</p>
                  </div>
                  <div className="program-card__footer">
                    <span>{program.duration}</span>
                    <strong>Apply now</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
