import Link from "next/link";
import {
  FiBookOpen,
  FiFileText,
  FiGithub,
  FiLayout,
  FiMap,
  FiMessageCircle,
  FiPenTool,
  FiStar,
  FiUploadCloud,
  FiTarget,
} from "react-icons/fi";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { VerifyForm } from "@/components/forms/VerifyForm";
import { HomeHero } from "@/components/home/HomeHero";
import {
  careerTools,
  dashboardHighlights,
  faqs,
  journeySteps,
  programs,
  resources,
  services,
  stats,
  testimonials,
} from "@/data/site";

export default function Home() {
  const previewPrograms = programs.slice(0, 6);
  const careerToolIcons = [FiFileText, FiTarget, FiMessageCircle, FiMap, FiLayout];
  const resourceIcons = [FiBookOpen, FiGithub, FiUploadCloud, FiPenTool];

  return (
    <>
      <Header />
      <main>
        <HomeHero />

        <section className="section section--stats" aria-label="Live platform stats">
          <div className="container stats-grid">
            {stats.map((item) => (
              <article className="stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--tech" id="services">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Services</p>
              <h2>Built like a technical product, not a static brochure.</h2>
              <p>
                VeloraSkills connects learning, operations, verification, and career
                preparation through clear dashboards and backend-ready workflows.
              </p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                  <div className="chip-list chip-list--light">
                    {service.points.map((point) => (
                      <span key={point}>{point}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="programs">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Internship programs</p>
              <h2>40 internship domains across tech, career, biotech, and business.</h2>
              <p>
                Based on the VeloraSkills PDF structure: 25 Tech domains and
                15 Non-Tech career domains for engineering, commerce, arts,
                biotech, pharmacy, and general students.
              </p>
            </div>
            <div className="program-grid">
              {previewPrograms.map((program) => (
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
            <div className="program-section-actions">
              <Link className="button button--primary" href="/services">
                View More
              </Link>
            </div>
          </div>
        </section>

        <section className="section section--muted section--process" id="process">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Internship process</p>
              <h2>A clear journey from application to verification.</h2>
            </div>
            <ol className="journey">
              {journeySteps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section--dashboard-showcase" id="dashboard">
          <div className="container dashboard-layout">
            <div className="section-heading section-heading--left">
              <p className="eyebrow">Dashboards</p>
              <h2>Student workspace designed for daily execution.</h2>
              <p>
                Students get a clean cockpit for profile updates, intern ID,
                offer letters, tasks, progress, payments, certificate downloads,
                and feedback in one secure portal.
              </p>
            </div>
            <div className="dashboard-preview">
              {dashboardHighlights
                .filter((group) => group.title === "Student Dashboard")
                .map((group) => (
                  <article key={group.title}>
                    <h3>{group.title}</h3>
                    <div className="chip-list">
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </article>
                ))}
              <div className="dashboard-actions">
                <Link className="button button--primary" href="/student/login">
                  Student Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--split section--verify-showcase" id="verify">
          <div className="container split-grid">
            <div>
              <p className="eyebrow">Certificate verification</p>
              <h2>Search by Certificate ID, Intern ID, or QR code.</h2>
              <p>
                Verification shows student name, selected domain, status, issue
                date, and certificate validity. The backend route is ready for
                MySQL powered records.
              </p>
              <div className="verify-trust-list" aria-label="Verification highlights">
                <span>QR ready</span>
                <span>Public validation</span>
                <span>Instant status</span>
              </div>
            </div>
            <VerifyForm />
          </div>
        </section>

        <section className="section section--muted section--career-showcase" id="career-tools">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">AI career tools</p>
              <h2>Extra support beyond task submission.</h2>
            </div>
            <div className="tool-grid">
              {careerTools.map((tool, index) => {
                const Icon = careerToolIcons[index % careerToolIcons.length];

                return (
                <article className="career-tool-card" key={tool.title}>
                  <span className="career-tool-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{tool.title}</h3>
                  <p>{tool.copy}</p>
                  <span className="career-tool-card__link">Explore tool</span>
                </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section--resources-showcase" id="resources">
          <div className="container resources-layout">
            <div className="section-heading section-heading--left">
              <p className="eyebrow">Resources</p>
              <h2>Everything interns need to finish confidently.</h2>
              <p>
                Starter guides, submission workflows, and career notes arranged
                for faster execution.
              </p>
            </div>
            <div className="resource-list">
              {resources.map((resource, index) => {
                const Icon = resourceIcons[index % resourceIcons.length];

                return (
                  <a href={resource.href} key={resource.title}>
                    <span className="resource-list__icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <strong>{resource.title}</strong>
                    <span>{resource.copy}</span>
                    <em>Open resource</em>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section--dark" id="about">
          <div className="container about-grid">
            <div className="about-copy">
              <p className="eyebrow">About VeloraSkills</p>
              <h2>Mission led learning for practical tech careers.</h2>
              <p>
                VeloraSkills helps students move from tutorials to proof of work
                through guided internships, mentor feedback, certificate
                verification, referrals, badges, and career-ready portfolios.
              </p>
              <div className="about-mini-stats" aria-label="VeloraSkills strengths">
                <span>Project-first tracks</span>
                <span>Verified certificates</span>
                <span>Career-ready output</span>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-orbit" aria-hidden="true">
                <span>Apply</span>
                <span>Build</span>
                <span>Verify</span>
              </div>
              <div className="values">
                <article>
                  <span className="value-icon">01</span>
                  <h3>Mission</h3>
                  <p>Make practical project experience accessible to students globally.</p>
                </article>
                <article>
                  <span className="value-icon">02</span>
                  <h3>Vision</h3>
                  <p>Build a trusted internship ecosystem for learners and hiring teams.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--stories-showcase">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Student stories</p>
              <h2>Designed to feel accountable, supportive, and outcome focused.</h2>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((testimonial) => {
                const initials = testimonial.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("");

                return (
                  <article className="testimonial" key={testimonial.name}>
                    <div className="testimonial__top">
                      <span className="testimonial__avatar">{initials}</span>
                      <span className="testimonial__badge">
                        <FiStar aria-hidden="true" />
                        Verified
                      </span>
                    </div>
                    <p>&quot;{testimonial.quote}&quot;</p>
                    <div className="testimonial__person">
                      <strong>{testimonial.name}</strong>
                      <span>{testimonial.role}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section--faq-showcase" id="faq">
          <div className="container faq-layout">
            <div className="section-heading section-heading--left">
              <p className="eyebrow">FAQ</p>
              <h2>Quick answers before students apply.</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--apply-showcase" id="apply">
          <div className="container apply-grid">
            <div>
              <p className="eyebrow">Apply and contact</p>
              <h2>Start with your preferred domain.</h2>
              <p>
                The form posts to the MySQL-backed application route. Connect
                environment variables, import the schema, and the backend is
                ready to store student applications.
              </p>
              <div className="contact-list">
                <a href="mailto:hello@veloraskills.tech">hello@veloraskills.tech</a>
                <a href="https://wa.me/919999999999">WhatsApp support</a>
                <a href="#resources">Submission guide</a>
              </div>
            </div>
            <ApplyForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
