import Image from "next/image";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { aboutValues, stats } from "@/data/site";

export const metadata = {
  title: "About Us | VeloraSkills",
  description: "Learn about the VeloraSkills mission, vision, and project-based internship approach.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--about">
          <div className="container page-hero__grid">
            <div>
              <p className="eyebrow">About us</p>
              <h1>We help students turn learning into verified proof of work.</h1>
              <p>
                VeloraSkills is a technical internship platform for students who
                want guided project experience, mentor feedback, dashboard
                tracking, and certificates that can be verified with confidence.
              </p>
            </div>
            <div className="page-hero__image">
              <Image
                src="/internship-hero.png"
                alt="Students collaborating on internship projects"
                fill
                sizes="(max-width: 980px) 100vw, 44vw"
              />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container stats-grid stats-grid--light">
            {stats.map((item) => (
              <article className="stat stat--light" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--muted">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">What guides us</p>
              <h2>A platform mindset for career readiness.</h2>
            </div>
            <div className="service-grid">
              {aboutValues.map((value) => (
                <article className="service-card" key={value.title}>
                  <h3>{value.title}</h3>
                  <p>{value.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
