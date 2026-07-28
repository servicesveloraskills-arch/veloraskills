"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({ demoEmail, demoPassword, initialError = "" }) {
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
    setStatus({ state: "loading", message: "Checking admin access..." });

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      setStatus({ state: "success", message: "Login successful. Opening dashboard..." });
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setStatus({
        state: "error",
        message: error.message || "Invalid admin credentials.",
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
      action="/api/admin/login"
      method="POST"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="eyebrow">Secure admin login</p>
        <h1>Admin Panel</h1>
        <p>Sign in to manage interns, domains, tasks, payments, and certificates.</p>
      </div>

      <label htmlFor="admin-email">Email</label>
      <input
        id="admin-email"
        name="email"
        type="email"
        value={form.email}
        onChange={updateField}
        placeholder="admin@veloraskills.tech"
        required
      />

      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
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
