"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import {
  FiBriefcase,
  FiChevronDown,
  FiGrid,
  FiHome,
  FiInfo,
  FiLogIn,
  FiMail,
  FiMenu,
  FiPenTool,
  FiX,
} from "react-icons/fi";

const navItems = [
  ["About", "/about", FiInfo],
  ["Services", "/services", FiGrid],
  ["Blog", "/blog", FiPenTool],
  ["Contact", "/contact", FiMail],
];

const internshipItems = [
  ["Apply for Internship", "/internships/apply"],
  ["Internship Guidelines", "/internships/guidelines"],
  ["Certificate Verification", "/certificate-verification"],
];

export function Header() {
  const headerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".site-header__inner > *",
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container site-header__inner">
        <Link className="brand" href="/" aria-label="VeloraSkills home">
          <Image
            src="/logo2.png"
            alt="VeloraSkills"
            width={1122}
            height={391}
            priority
            className="brand__logo"
          />
        </Link>
        <button
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="header-menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
        <nav
          aria-label="Primary navigation"
          className={`site-nav${isMenuOpen ? " site-nav--open" : ""}`}
          id="primary-navigation"
        >
          <Link href="/" onClick={closeMenu}>
            <FiHome aria-hidden="true" />
            <span>Home</span>
          </Link>
          <div className="nav-dropdown">
            <Link
              className="nav-dropdown__trigger"
              href="/internships/apply"
              onClick={closeMenu}
            >
              <FiBriefcase aria-hidden="true" />
              Internships
              <FiChevronDown aria-hidden="true" />
            </Link>
            <div className="nav-dropdown__menu">
              {internshipItems.map(([label, href]) => (
                <Link href={href} key={label} onClick={closeMenu}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          {navItems.map(([label, href, Icon]) => (
            <Link href={href} key={label} onClick={closeMenu}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <Link className="button button--small header-login" href="/student/login">
          <FiLogIn aria-hidden="true" />
          <span>Student Login</span>
        </Link>
      </div>
    </header>
  );
}
