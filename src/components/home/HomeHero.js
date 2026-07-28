"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import {
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiZap,
} from "react-icons/fi";

const heroStats = [
  ["40+", "Career domains", FiBookOpen],
  ["48h", "Mentor review", FiClock],
  ["QR", "Verified certificates", FiShield],
];

const activityItems = [
  ["AI Resume Review", "92% profile ready"],
  ["Web Dev Sprint", "Module 04 submitted"],
  ["Certificate Check", "Live verification active"],
];

export function HomeHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(".hero__copy > *", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 })
        .fromTo(".premium-hero-card", { opacity: 0, y: 34, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.85 }, "-=0.55")
        .fromTo(".hero-stat", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, "-=0.35");

      gsap.to(".premium-orbit", {
        rotate: 360,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".premium-hero-card", {
        y: -10,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero hero--premium" id="home" ref={heroRef}>
      <div className="hero__media" aria-hidden="true">
        <Image
          src="/internship-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
      </div>
      <div className="premium-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="container hero__content hero__content--premium">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <FiZap aria-hidden="true" />
            Global virtual internships
          </p>
          <h1>Build proof-of-work skills with a premium internship platform.</h1>
          <p className="hero__lead">
            VeloraSkills brings project tracks, mentor workflows, AI career
            tools, verified certificates, and student dashboards into one
            polished learning command center.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/internships/apply">
              <span>Apply Now</span>
              <FiArrowRight aria-hidden="true" />
            </Link>
            <a className="button button--light" href="#verify">
              <FiAward aria-hidden="true" />
              <span>Verify Certificate</span>
            </a>
          </div>
          <div className="hero__badges" aria-label="Platform highlights">
            <span>
              <FiCheckCircle aria-hidden="true" />
              Project-first learning
            </span>
            <span>
              <FiCheckCircle aria-hidden="true" />
              AI career support
            </span>
            <span>
              <FiCheckCircle aria-hidden="true" />
              Secure dashboards
            </span>
          </div>
        </div>

        <div className="premium-hero-card" aria-label="VeloraSkills platform preview">
          <div className="premium-card__top">
            <div>
              <span>Live cohort</span>
              <strong>Student Growth OS</strong>
            </div>
            <FiBarChart2 aria-hidden="true" />
          </div>
          <div className="premium-progress">
            <span style={{ width: "76%" }} />
          </div>
          <div className="premium-activity">
            {activityItems.map(([title, status]) => (
              <div key={title}>
                <FiCheckCircle aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <span>{status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-stat-grid">
            {heroStats.map(([value, label, Icon]) => (
              <article className="hero-stat" key={label}>
                <Icon aria-hidden="true" />
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
