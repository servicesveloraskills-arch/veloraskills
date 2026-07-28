import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { contactChannels, programs } from "@/data/site";

export const metadata = {
  title: "Contact Us | VeloraSkills",
  description: "Contact VeloraSkills for internship programs, certificates, admin support, and student help.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--contact">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Contact us</p>
            <h1>Talk to VeloraSkills about internships, verification, or support.</h1>
            <p>
              Reach the team for applications, certificate verification, admin
              access, partnership queries, and student dashboard help.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container contact-page-grid">
            <div className="contact-channel-list">
              {contactChannels.map((channel) => (
                channel.href.startsWith("/") ? (
                  <Link className="service-card contact-channel" href={channel.href} key={channel.title}>
                    <span>{channel.title}</span>
                    <strong>{channel.value}</strong>
                  </Link>
                ) : (
                  <a className="service-card contact-channel" href={channel.href} key={channel.title}>
                    <span>{channel.title}</span>
                    <strong>{channel.value}</strong>
                  </a>
                )
              ))}
            </div>

            <form className="panel form-panel contact-form" action="mailto:hello@veloraskills.tech" method="POST">
              <label htmlFor="contact-name">Full name</label>
              <input id="contact-name" name="name" placeholder="Your name" required />

              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" placeholder="you@example.com" required />

              <label htmlFor="contact-topic">Topic</label>
              <select id="contact-topic" name="topic" required>
                <option value="">Select a topic</option>
                <option>Internship application</option>
                <option>Certificate verification</option>
                <option>Admin support</option>
                <option>Partnership</option>
                {programs.map((program) => (
                  <option key={program.title}>{program.title}</option>
                ))}
              </select>

              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" placeholder="How can we help?" required />

              <button className="button button--primary" type="submit">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
