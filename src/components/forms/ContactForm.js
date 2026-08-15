"use client";

import { useState } from "react";
import { programs } from "@/data/site";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", topic: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.ok) {
        setStatus({ type: "success", text: "✅ " + data.message });
        setFormData({ name: "", email: "", topic: "", message: "" });
      } else {
        setStatus({ type: "error", text: "❌ " + (data.message || "Failed to send message.") });
      }
    } catch (err) {
      setStatus({ type: "error", text: "❌ Connection error: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel form-panel contact-form" onSubmit={handleSubmit}>
      {status && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "bold",
            background: status.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: status.type === "success" ? "#047857" : "#b91c1c",
            border: `1px solid ${status.type === "success" ? "#a7f3d0" : "#fecaca"}`,
          }}
        >
          {status.text}
        </div>
      )}

      <label htmlFor="contact-name">Full name</label>
      <input
        id="contact-name"
        name="name"
        placeholder="Your name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <label htmlFor="contact-email">Email</label>
      <input
        id="contact-email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <label htmlFor="contact-topic">Topic</label>
      <select
        id="contact-topic"
        name="topic"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
        required
      >
        <option value="">Select a topic</option>
        <option value="Internship Application">Internship application</option>
        <option value="Certificate Verification">Certificate verification</option>
        <option value="Admin Support">Admin support</option>
        <option value="Partnership">Partnership</option>
        {programs.map((program) => (
          <option key={program.title} value={program.title}>
            {program.title}
          </option>
        ))}
      </select>

      <label htmlFor="contact-message">Message</label>
      <textarea
        id="contact-message"
        name="message"
        placeholder="How can we help?"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />

      <button className="button button--primary" type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
