import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { contactChannels } from "@/data/site";

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
              {contactChannels.map((channel) =>
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
              )}
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
