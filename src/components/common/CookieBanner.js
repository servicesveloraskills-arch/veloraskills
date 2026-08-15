"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiX } from "react-icons/fi";
import { FaCookieBite } from "react-icons/fa6";

export function CookieBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Do not show banner on admin pages
    if (pathname?.startsWith("/admin")) {
      setIsVisible(false);
      return;
    }

    const consent = localStorage.getItem("velora_cookie_consent");
    if (!consent) {
      // Delay slightly for smooth entrance animation
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleAccept = () => {
    localStorage.setItem("velora_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("velora_cookie_consent", "essential_only");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie Preferences"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92%, 680px)",
        zIndex: 999,
        background: "rgba(10, 42, 107, 0.95)",
        backdropFilter: "blur(16px)",
        color: "#ffffff",
        padding: "18px 24px",
        borderRadius: "14px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        animation: "slideUp 0.4s ease-out forwards",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <FaCookieBite style={{ fontSize: "24px", color: "#f9a825", flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
          <strong style={{ display: "block", fontSize: "14px", marginBottom: "3px" }}>
            We value your privacy
          </strong>
          We use essential cookies to ensure portal authentication, task tracking, and site analytics. Read our{" "}
          <Link href="/privacy" style={{ color: "#ffc107", textDecoration: "underline" }}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" style={{ color: "#ffc107", textDecoration: "underline" }}>
            Terms
          </Link>.
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#ffffff",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          style={{
            background: "#f9a825",
            border: "none",
            color: "#0a2a6b",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Accept All
        </button>
        <button
          onClick={handleDecline}
          aria-label="Close cookie banner"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}
