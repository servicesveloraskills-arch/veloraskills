"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.ok) {
        setMsg({ type: "success", text: "✅ Subscribed!" });
        setEmail("");
      } else {
        setMsg({ type: "error", text: "❌ " + data.message });
      }
    } catch (err) {
      setMsg({ type: "error", text: "❌ Failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="footer-subscribe" onSubmit={handleSubmit}>
        <label htmlFor="footer-email">Email address</label>
        <div>
          <input
            id="footer-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Join"}
          </button>
        </div>
      </form>
      {msg && (
        <span
          style={{
            fontSize: "12px",
            color: msg.type === "success" ? "#34d399" : "#f87171",
            marginTop: "6px",
            display: "block",
          }}
        >
          {msg.text}
        </span>
      )}
    </div>
  );
}
