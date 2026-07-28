import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
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
            <div className="blog-categories" aria-label="Blog categories">
              {categories.map((category, index) => (
                <button className={index === 0 ? "is-active" : ""} type="button" key={category}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="container blog-grid">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.title}>
                <div className={`blog-card__image blog-card__image--${post.theme}`}>
                  <span>{post.category}</span>
                  <strong>{post.theme === "cost" ? "2026 GUIDE" : post.category}</strong>
                </div>
                <div className="blog-card__body">
                  <h2>{post.title}</h2>
                  <p>{post.copy}</p>
                </div>
                <div className="blog-card__meta">
                  <span>{post.date}</span>
                  <span>{post.author}</span>
                  <Link href="/#resources">
                    <span>Read</span>
                    <FiArrowRight aria-hidden="true" />
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
