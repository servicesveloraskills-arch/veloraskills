import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiBookOpen,
  FiAward,
  FiStar,
} from "react-icons/fi";
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
        <section
          className="blog-hero"
          style={{
            background: "linear-gradient(135deg, #0a2a6b 0%, #163d8c 50%, #0f172a 100%)",
            padding: "64px 0 52px",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="container blog-hero__inner"
            style={{ textAlign: "left", justifyItems: "start", maxWidth: "900px", position: "relative", zIndex: 2 }}
          >
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffc107",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "20px",
                background: "rgba(255, 255, 255, 0.12)",
                padding: "6px 14px",
                borderRadius: "999px",
                backdropFilter: "blur(8px)",
              }}
            >
              <FiArrowLeft /> Back to Blog List
            </Link>

            <span
              style={{
                background: "linear-gradient(135deg, #f9a825 0%, #ffc107 100%)",
                color: "#0a2a6b",
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "900",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                display: "inline-block",
                marginBottom: "16px",
                boxShadow: "0 6px 20px rgba(249, 168, 37, 0.3)",
              }}
            >
              {post.category}
            </span>

            <h1
              style={{
                fontSize: "clamp(2.1rem, 4.5vw, 3.2rem)",
                margin: "0 0 24px",
                color: "#ffffff",
                lineHeight: "1.18",
                fontWeight: "800",
                letterSpacing: "-0.5px",
              }}
            >
              {post.title}
            </h1>

            <div
              style={{
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
                color: "rgba(255,255,255,0.85)",
                fontSize: "14px",
                alignItems: "center",
                background: "rgba(255,255,255,0.08)",
                padding: "10px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                <FiUser style={{ color: "#ffc107" }} /> {post.author}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                <FiCalendar style={{ color: "#ffc107" }} /> {post.date}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                <FiClock style={{ color: "#ffc107" }} /> 5 min read
              </span>
            </div>
          </div>
        </section>

        {/* Article Body Container */}
        <section className="section" style={{ padding: "52px 0 90px", background: "#f8fafc" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "48px",
                boxShadow: "0 24px 70px rgba(10, 42, 107, 0.09)",
                border: "1px solid rgba(10, 42, 107, 0.1)",
                lineHeight: "1.85",
                fontSize: "16.5px",
                color: "#334155",
              }}
            >
              {/* Key Takeaways Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                  borderLeft: "5px solid #0284c7",
                  padding: "24px 28px",
                  borderRadius: "16px",
                  marginBottom: "36px",
                  color: "#0369a1",
                  fontSize: "17px",
                  boxShadow: "0 8px 20px rgba(2, 132, 199, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", color: "#0284c7" }}>
                  <FiStar /> Article Executive Summary
                </div>
                {post.copy}
              </div>

              <h2 style={{ fontSize: "26px", fontWeight: "bold", color: "#0f172a", marginTop: "28px", marginBottom: "18px", letterSpacing: "-0.3px" }}>
                1. Industry Context & 2026 Landscape
              </h2>
              <p>
                As tech hiring shifts towards verified skills and proof-of-work, students and early-career engineers are moving away from surface-level tutorials. Hiring teams in 2026 prioritize candidates who demonstrate real project execution, clean architectural choices, and authentic project completion.
              </p>

              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "36px", marginBottom: "18px", letterSpacing: "-0.3px" }}>
                2. Key Frameworks & Project Milestones
              </h2>
              <p>
                Whether you specialize in <strong>{post.category}</strong> or build multi-domain capabilities, keeping your execution fast and code clean is the fastest path to job readiness:
              </p>

              <div style={{ display: "grid", gap: "16px", margin: "24px 0" }}>
                <div style={{ padding: "18px 22px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <FiCheckCircle style={{ color: "#059669", fontSize: "22px", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "#0f172a", fontSize: "16px", display: "block" }}>Hands-on Capstones</strong>
                    <span style={{ fontSize: "14.5px", color: "#64748b" }}>Build production-ready codebases with clean modular folders, standard git commits, and live deployments.</span>
                  </div>
                </div>

                <div style={{ padding: "18px 22px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <FiAward style={{ color: "#2563eb", fontSize: "22px", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "#0f172a", fontSize: "16px", display: "block" }}>Verified Credentialing</strong>
                    <span style={{ fontSize: "14.5px", color: "#64748b" }}>Ensure your offer letters, intern IDs, and completion certificates have online verification links and QR integrity.</span>
                  </div>
                </div>

                <div style={{ padding: "18px 22px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <FiBookOpen style={{ color: "#f9a825", fontSize: "22px", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "#0f172a", fontSize: "16px", display: "block" }}>Portfolio Case Studies</strong>
                    <span style={{ fontSize: "14.5px", color: "#64748b" }}>Convert task outputs into structured portfolio stories highlighting problem statements, implementation choices, and measurable results.</span>
                  </div>
                </div>
              </div>

              {/* Call to Action Box */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0a2a6b 0%, #163d8c 50%, #0a2a6b 100%)",
                  color: "#ffffff",
                  padding: "36px 32px",
                  borderRadius: "20px",
                  margin: "44px 0 28px",
                  textAlign: "center",
                  boxShadow: "0 20px 50px rgba(10, 42, 107, 0.25)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <h3 style={{ fontSize: "24px", margin: "0 0 12px 0", color: "#ffffff", fontWeight: "bold" }}>
                  Turn learning into proof of work at VeloraSkills
                </h3>
                <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 24px 0", fontSize: "15.5px", maxWidth: "600px", marginInline: "auto" }}>
                  Enroll in project-based virtual internships across 40 Tech & Non-Tech domains with auto offer letters, task reviews, and verified certificates.
                </p>
                <Link
                  href="/internships/apply"
                  style={{
                    background: "linear-gradient(135deg, #f9a825 0%, #ffc107 100%)",
                    color: "#0a2a6b",
                    padding: "14px 32px",
                    borderRadius: "10px",
                    fontWeight: "900",
                    fontSize: "15px",
                    textDecoration: "none",
                    display: "inline-block",
                    boxShadow: "0 10px 30px rgba(249, 168, 37, 0.35)",
                  }}
                >
                  Apply for Virtual Internship →
                </Link>
              </div>
            </div>

            {/* Premium "More Articles & Career Guides" Section */}
            <div style={{ marginTop: "64px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
                <div>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold", color: "#2563eb", display: "block", marginBottom: "4px" }}>
                    Recommended Reading
                  </span>
                  <h3 style={{ fontSize: "26px", fontWeight: "bold", color: "#0f172a", margin: 0, letterSpacing: "-0.3px" }}>
                    More Articles & Career Guides
                  </h3>
                </div>
                <Link href="/blog" style={{ color: "#0a2a6b", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  View All ({blogPosts.length}) <FiArrowRight />
                </Link>
              </div>

              {/* Styled Related Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "24px" }}>
                {relatedPosts.map((related) => (
                  <article
                    key={related.slug}
                    style={{
                      background: "#ffffff",
                      borderRadius: "18px",
                      padding: "26px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 14px 36px rgba(10, 42, 107, 0.06)",
                    }}
                  >
                    <div>
                      {/* Top Header: Category + Date & Reading Time */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "#2563eb",
                            background: "#eff6ff",
                            padding: "4px 12px",
                            borderRadius: "999px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {related.category}
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
                          <FiCalendar style={{ color: "#2563eb" }} /> {related.date} • 5 min read
                        </span>
                      </div>

                      {/* Heading / Title */}
                      <h4 style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a", margin: "0 0 10px 0", lineHeight: "1.38" }}>
                        {related.title}
                      </h4>

                      <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {related.copy}
                      </p>
                    </div>

                    {/* Bottom Footer: Left = Author Name, Right = Read Button */}
                    <div style={{ paddingTop: "20px", marginTop: "16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <span style={{ fontSize: "13px", color: "#334155", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FiUser style={{ color: "#2563eb" }} /> {related.author}
                      </span>
                      <Link
                        href={`/blog/${related.slug}`}
                        style={{
                          background: "#0a2a6b",
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "13px",
                          padding: "8px 18px",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          textDecoration: "none",
                          boxShadow: "0 4px 12px rgba(10, 42, 107, 0.15)",
                        }}
                      >
                        Read Article <FiArrowRight />
                      </Link>
                    </div>
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
