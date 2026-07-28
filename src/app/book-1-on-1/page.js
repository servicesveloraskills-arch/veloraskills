import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { programs } from "@/data/site";

export const metadata = {
  title: "Book 1-on-1 | VeloraSkills",
  description: "Book a 1-on-1 counselling session for VeloraSkills internship domain guidance.",
};

export default function BookOneOnOnePage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero page-hero--services">
          <div className="container page-hero__narrow">
            <p className="eyebrow">Book 1-on-1</p>
            <h1>Get personal guidance before choosing your internship domain.</h1>
            <p>
              Book a counselling call to understand which VeloraSkills track is
              best for your skill level, career goal, and portfolio plan.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container contact-page-grid">
            <div>
              <p className="eyebrow">What you can discuss</p>
              <h2>Domain selection, roadmap, tasks, and certificates.</h2>
              <div className="domain-mini-list">
                <span>Career roadmap</span>
                <span>Domain selection</span>
                <span>Project planning</span>
                <span>Certificate process</span>
              </div>
            </div>

            <form className="panel form-panel contact-form" action="mailto:hello@veloraskills.tech" method="POST">
              <label htmlFor="booking-name">Full name</label>
              <input id="booking-name" name="name" placeholder="Your name" required />

              <label htmlFor="booking-email">Email</label>
              <input id="booking-email" name="email" type="email" placeholder="you@example.com" required />

              <label htmlFor="booking-domain">Interested domain</label>
              <select id="booking-domain" name="domain" required>
                <option value="">Select a domain</option>
                {programs.map((program) => (
                  <option key={program.title}>{program.title}</option>
                ))}
              </select>

              <label htmlFor="booking-message">What do you need help with?</label>
              <textarea id="booking-message" name="message" placeholder="Tell us your goal" required />

              <button className="button button--primary" type="submit">
                Request Session
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
