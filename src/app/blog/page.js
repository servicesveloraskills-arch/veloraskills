import Link from "next/link";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { blogPosts } from "@/data/site";

export const metadata = {
  title: "Blog | VeloraSkills",
  description: "VeloraSkills blog for internship tips, certificate verification, portfolio building, and career guidance.",
};

export default function BlogPage() {
  const categories = [
    "All",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "AI/ML",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Other",
  ];

  return (
    <>
      <Header />
      <main className="blog-page">
        <section className="blog-hero">
          <div className="container blog-hero__inner">
            <span className="blog-badge">Insights & Updates</span>
            <h1>
              Learning <span>Blog</span>
            </h1>
            <p>
              Learn new skills, explore technology trends, and accelerate your
              career with curated articles and guides.
            </p>
            <form className="blog-search" role="search">
              <label htmlFor="blog-search">Search articles</label>
              <input id="blog-search" type="search" placeholder="Search articles..." />
            </form>
          </div>
        </section>

        <section className="blog-listing">
          <div className="container">
            <div className="blog-categories" aria-label="Blog categories" style={{ marginBottom: "32px" }}>
              {categories.map((category, index) => (
                <button className={index === 0 ? "is-active" : ""} type="button" key={category}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div
            className="container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              paddingBottom: "80px",
            }}
          >
            {blogPosts.map((post) => (
              <article
                key={post.slug || post.title}
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
                  {/* Category Pill */}
                  <div style={{ marginBottom: "12px" }}>
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
                        display: "inline-block",
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Date & Reading time */}
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                    <FiCalendar style={{ color: "#2563eb" }} /> {post.date} • 5 min read
                  </div>

                  {/* Heading / Title */}
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: "0 0 10px 0", lineHeight: "1.38" }}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.copy}
                  </p>
                </div>

                {/* Bottom Footer: Left = Author Name, Right = Read Button */}
                <div style={{ paddingTop: "20px", marginTop: "16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#334155", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiUser style={{ color: "#2563eb" }} /> {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
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
        </section>
      </main>
      <Footer />
    </>
  );
}
