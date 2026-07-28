"use client";

import { useState } from "react";
import { programs } from "@/data/site";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  domain: "",
  portfolio: "",
};

export function ApplyForm({ initialDomain = "" }) {
  const [form, setForm] = useState({ ...initialForm, domain: initialDomain });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ state: "loading", message: "Submitting your application..." });

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application could not be submitted.");
      }

      setForm(initialForm);
      setStatus({
        state: "success",
        message: `${data.message} Your intern ID is ${data.internId}.`,
      });
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error.message ||
          "Application could not be saved. Please check MySQL configuration.",
      });
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <label htmlFor="fullName">Full name</label>
      <input
        id="fullName"
        name="fullName"
        value={form.fullName}
        onChange={updateField}
        placeholder="Your name"
        required
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={form.email}
        onChange={updateField}
        placeholder="you@example.com"
        required
      />

      <label htmlFor="phone">Phone</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={updateField}
        placeholder="+91 98765 43210"
        required
      />

      <label htmlFor="domain">Preferred domain</label>
      <select
        id="domain"
        name="domain"
        value={form.domain}
        onChange={updateField}
        required
      >
        <option value="">Select a program</option>
        {programs.map((program) => (
          <option value={program.title} key={program.title}>
            {program.title}
          </option>
        ))}
      </select>

      <label htmlFor="portfolio">Portfolio or LinkedIn</label>
      <input
        id="portfolio"
        name="portfolio"
        value={form.portfolio}
        onChange={updateField}
        placeholder="https://..."
      />

      <button
        className="button button--primary"
        type="submit"
        disabled={status.state === "loading"}
      >
        {status.state === "loading" ? "Submitting..." : "Submit Application"}
      </button>

      {status.message ? (
        <p className={`form-status form-status--${status.state}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
