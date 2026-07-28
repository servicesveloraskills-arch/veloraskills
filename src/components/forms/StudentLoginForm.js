"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StudentLoginForm({ demoEmail, demoPassword, initialError = "" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    email: demoEmail,
    password: demoPassword,
  });
  const [status, setStatus] = useState({
    state: initialError ? "error" : "idle",
    message: initialError,
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ state: "loading", message: "Checking student access..." });

    try {
      const response = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      setStatus({ state: "success", message: "Login successful. Opening dashboard..." });
      router.push("/student/dashboard");
      router.refresh();
    } catch (error) {
      setStatus({
        state: "error",
        message: error.message || "Invalid student credentials.",
      });
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form
      className="panel form-panel admin-login-card"
      action="/api/student/login"
      method="POST"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="eyebrow">Student portal login</p>
        <h1>Student Portal</h1>
        <p>Sign in to view tasks, progress, offer letter, payment, and certificates.</p>
      </div>

      <label htmlFor="student-email">Email</label>
      <input
        id="student-email"
        name="email"
        type="email"
        value={form.email}
        onChange={updateField}
        placeholder="student@veloraskills.tech"
        required
      />

      <label htmlFor="student-password">Password</label>
      <input
        id="student-password"
        name="password"
        type="password"
        value={form.password}
        onChange={updateField}
        placeholder="Enter password"
        required
      />

      <button
        className="button button--primary"
        type="submit"
        disabled={status.state === "loading"}
      >
        {status.state === "loading" ? "Signing in..." : "Login to Dashboard"}
      </button>

      <p className="form-note">
        Demo login: {demoEmail} / {demoPassword}
      </p>

      {status.message ? (
        <p className={`form-status form-status--${status.state}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
