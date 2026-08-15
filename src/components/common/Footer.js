import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { NewsletterForm } from "@/components/common/NewsletterForm";

export function Footer() {
  const socialLinks = [
    { href: "https://www.facebook.com/", label: "Facebook", Icon: FaFacebookF },
    { href: "https://www.instagram.com/", label: "Instagram", Icon: FaInstagram },
    { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: FaLinkedinIn },
    { href: "https://x.com/", label: "X", Icon: FaXTwitter },
  ];

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="brand brand--footer" href="/">
            <Image
              src="/logo2.png"
              alt="VeloraSkills"
              width={1122}
              height={391}
              className="brand__logo"
            />
          </Link>
          <p>
            Project-based global internship programs with task tracking,
            certificate verification, and career tooling.
          </p>
        </div>
        <div>
          <h2>Platform</h2>
          <Link href="/about">About Us</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/student/login">Student Portal</Link>
          <Link href="/#verify">Certificate Verification</Link>
        </div>
        <div>
          <h2>Support & Legal</h2>
          <Link href="/contact">Contact Us</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/#faq">FAQ</Link>
          <a href="mailto:hello@veloraskills.tech">hello@veloraskills.tech</a>
        </div>
        <div className="footer-newsletter">
          <h2>Subscribe</h2>
          <p>Get internship updates, resources, and certificate alerts.</p>
          <NewsletterForm />
          <div className="footer-social" aria-label="Social media links">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                aria-label={label}
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>(c) 2026 VeloraSkills. All rights reserved.</span>
        <span>SEO ready, mobile responsive, dark mode friendly.</span>
      </div>
    </footer>
  );
}
