import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiUser, FiCheckCircle, FiShare2 } from "react-icons/fi";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { blogPosts } from "@/data/site";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found | VeloraSkills",
    };
  }

  return {
    title: `${post.title} | VeloraSkills Blog`,
    description: post.copy,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Header />
      <main className="blog-page">
        {/* Article Hero */}
        <section className="blog-hero" style={{ padding: "60px 0 40px" }}>
          <div className="container blog-hero__inner" style={{ textAlign: "left", justifyItems: "start", maxWidth: "860px" }}>
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffc107",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              <FiArrowLeft /> Back to Articles
            </Link>

            <span className="blog-badge" style={{ background: "rgba(255,193,7,0.18)", color: "#ffc107" }}>
              {post.category}
            </span>

            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "16px 0 20px", color: "#ffffff", lineHeight: "1.2" }}>
              {post.title}
            </h1>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FiUser style={{ color: "#ffc107" }} /> {post.author}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FiCalendar style={{ color: "#ffc107" }} /> {post.date}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FiClock style={{ color: "#ffc107" }} /> 5 min read
              </span>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="section" style={{ padding: "48px 0 80px" }}>
          <div className="container" style={{ maxWidth: "860px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 20px 60px rgba(10, 42, 107, 0.08)",
                border: "1px solid rgba(10, 42, 107, 0.1)",
                lineHeight: "1.8",
                fontSize: "16px",
                color: "#1e293b",
              }}
            >
              {/* Excerpt Summary Callout */}
              <div
                style={{
                  background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
                  borderLeft: "4px solid #2563eb",
                  padding: "20px 24px",
                  borderRadius: "12px",
                  marginBottom: "32px",
                  fontWeight: "500",
                  color: "#1e1b4b",
                  fontSize: "17px",
                }}
              >
                💡 <strong>Key Takeaway:</strong> {post.copy}
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "24px", marginBottom: "16px" }}>
                Introduction & Industry Overview
              </h2>
              <p>
                In today&apos;s rapidly evolving tech landscape, gaining practical experience through structured virtual internships, building verified proof-of-work projects, and understanding real-world industry workflows is essential for students and aspiring developers.
              </p>

              <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f172a", marginTop: "32px", marginBottom: "16px" }}>
                Core Milestones & Practical Strategy
              </h2>
              <p>
                Whether you are specializing in <strong>{post.category}</strong> or exploring multi-disciplinary skills, keeping up with best practices and execution speed will make your portfolio stand out to top hiring teams.
              </p>

              <ul style={{ paddingLeft: "24px", margin: "20px 0" }}>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Hands-on Capstones:</strong> Focus on building production-ready projects with clean code structure and version control hygiene.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Verified Certifications:</strong> Ensure your internship offer letters and completion certificates carry authentic verification links and QR integrity.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Portfolio Case Studies:</strong> Document your development process, architecture decisions, and measurable outcomes.
                </li>
              </ul>

              {/* Call to Action Box */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0a2a6b 0%, #163d8c 100%)",
                  color: "#ffffff",
                  padding: "32px",
                  borderRadius: "16px",
                  margin: "40px 0 24px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "22px", margin: "0 0 10px 0", color: "#ffffff" }}>
                  Ready to apply your skills in a real virtual internship?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 20px 0", fontSize: "15px" }}>
                  Join over 1,200+ students building verified projects across 40 Tech & Non-Tech domains at VeloraSkills.
                </p>
                <Link
                  href="/internships/apply"
                  style={{
                    background: "#f9a825",
                    color: "#0a2a6b",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Apply Now →
                </Link>
              </div>
            </div>

            {/* Related Articles Section */}
            <div style={{ marginTop: "60px" }}>
              <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f172a", marginBottom: "24px" }}>
                More Articles & Career Guides
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                {relatedPosts.map((related) => (
                  <article
                    key={related.slug}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "20px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase" }}>
                        {related.category}
                      </span>
                      <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: "8px 0" }}>
                        {related.title}
                      </h4>
                    </div>
                    <Link
                      href={`/blog/${related.slug}`}
                      style={{
                        color: "#0a2a6b",
                        fontWeight: "bold",
                        fontSize: "13px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "12px",
                      }}
                    >
                      Read Guide <FiArrowRight />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
