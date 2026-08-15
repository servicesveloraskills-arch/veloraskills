"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiMail,
  FiSearch,
  FiUserCheck,
  FiAward,
  FiRefreshCw,
  FiFileText,
  FiGrid,
  FiUsers,
  FiLayers,
  FiShield,
  FiSend,
  FiMessageSquare,
  FiBell,
  FiExternalLink,
} from "react-icons/fi";

export function AdminDashboardClient({ initialMetrics = [], initialApplications = [] }) {
  const [activeTab, setActiveTab] = useState("students");
  const [metrics, setMetrics] = useState(initialMetrics);
  const [applications, setApplications] = useState(initialApplications);
  const [contactMessages, setContactMessages] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMessage, setActionMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      if (data.ok) {
        setMetrics(data.metrics || []);
        setApplications(data.applications || []);
        setContactMessages(data.contactMessages || []);
        setNewsletterSubscribers(data.newsletterSubscribers || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveCompletion = async (app) => {
    const confirmApprove = window.confirm(
      `Approve internship completion for ${app.full_name} (${app.intern_id || "ID Pending"})?\n\nThis will generate their Experience Letter PDF and email it to ${app.email}.`
    );

    if (!confirmApprove) return;

    setProcessingId(app.id);
    setActionMessage({ type: "info", text: `Generating Experience Letter & sending email to ${app.email}...` });

    try {
      const res = await fetch("/api/admin/approve-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internId: app.intern_id,
          applicationId: app.id,
        }),
      });

      const result = await res.json();

      if (result.ok) {
        setActionMessage({
          type: "success",
          text: `✅ Approved! Experience letter emailed to ${app.email}. Cert ID: ${result.certificateId}`,
        });
        await fetchAdminData();
      } else {
        setActionMessage({
          type: "error",
          text: `❌ Error: ${result.message || "Could not approve completion."}`,
        });
      }
    } catch (err) {
      setActionMessage({ type: "error", text: `❌ Network error: ${err.message}` });
    } finally {
      setProcessingId(null);
    }
  };

  const handleResendOfferEmail = async (app) => {
    setActionMessage({ type: "info", text: `Resending Offer Letter Email to ${app.email}...` });
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: app.full_name,
          email: app.email,
          phone: app.phone || "0000000000",
          domain: app.domain,
        }),
      });
      const result = await res.json();
      if (result.ok) {
        setActionMessage({ type: "success", text: `✅ Offer Letter re-sent to ${app.email}!` });
        await fetchAdminData();
      } else {
        setActionMessage({ type: "error", text: `❌ Could not resend email: ${result.message}` });
      }
    } catch (err) {
      setActionMessage({ type: "error", text: `❌ Error: ${err.message}` });
    }
  };

  const filteredApps = applications.filter((app) => {
    const queryStr = search.toLowerCase();
    const matchesSearch =
      (app.full_name && app.full_name.toLowerCase().includes(queryStr)) ||
      (app.email && app.email.toLowerCase().includes(queryStr)) ||
      (app.intern_id && app.intern_id.toLowerCase().includes(queryStr)) ||
      (app.domain && app.domain.toLowerCase().includes(queryStr));

    const matchesStatus =
      statusFilter === "all" || app.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Extract Email Logs list from applications
  const emailLogs = [];
  applications.forEach((app) => {
    emailLogs.push({
      id: `offer-${app.id}`,
      appId: app.id,
      recipientName: app.full_name,
      recipientEmail: app.email,
      internId: app.intern_id,
      domain: app.domain,
      type: "Offer Letter PDF",
      attachment: `Offer_Letter_${app.intern_id || "VS"}.pdf`,
      sentAt: app.created_at ? new Date(app.created_at).toLocaleString("en-IN") : "Recent",
      status: "Sent ✅",
      appRecord: app,
      emailCategory: "offer",
    });

    if (app.status === "completed") {
      emailLogs.push({
        id: `exp-${app.id}`,
        appId: app.id,
        recipientName: app.full_name,
        recipientEmail: app.email,
        internId: app.intern_id,
        domain: app.domain,
        type: "Experience & Completion Letter PDF",
        attachment: `Experience_Letter_${app.intern_id}.pdf`,
        sentAt: app.cert_issue_date ? new Date(app.cert_issue_date).toLocaleDateString("en-IN") : "Recent",
        status: "Sent ✅",
        appRecord: app,
        emailCategory: "experience",
      });
    }
  });

  const filteredEmailLogs = emailLogs.filter((log) => {
    const queryStr = search.toLowerCase();
    return (
      log.recipientName.toLowerCase().includes(queryStr) ||
      log.recipientEmail.toLowerCase().includes(queryStr) ||
      (log.internId && log.internId.toLowerCase().includes(queryStr)) ||
      log.type.toLowerCase().includes(queryStr)
    );
  });

  // Group domains
  const domainCounts = {};
  applications.forEach((app) => {
    if (app.domain) {
      domainCounts[app.domain] = (domainCounts[app.domain] || 0) + 1;
    }
  });

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "calc(100vh - 80px)", background: "#f8fafc" }}>
      {/* Interactive Admin Sidebar Navigation */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #0a2a6b 0%, #0f172a 100%)",
          color: "#ffffff",
          padding: "24px 16px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ padding: "0 12px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.12)", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#f9a825", fontWeight: "bold" }}>
            Admin Portal
          </div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ffffff", marginTop: "2px" }}>
            VeloraSkills
          </div>
        </div>

        <button
          onClick={() => setActiveTab("overview")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "overview" ? "#f9a825" : "transparent",
            color: activeTab === "overview" ? "#0a2a6b" : "rgba(255,255,255,0.8)",
            fontWeight: activeTab === "overview" ? "bold" : "600",
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <FiGrid size={18} /> Overview
        </button>

        <button
          onClick={() => setActiveTab("students")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "students" ? "#f9a825" : "transparent",
            color: activeTab === "students" ? "#0a2a6b" : "rgba(255,255,255,0.8)",
            fontWeight: activeTab === "students" ? "bold" : "600",
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <FiUsers size={18} /> Students & Interns
        </button>

        <button
          onClick={() => setActiveTab("emails")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "emails" ? "#f9a825" : "transparent",
            color: activeTab === "emails" ? "#0a2a6b" : "rgba(255,255,255,0.8)",
            fontWeight: activeTab === "emails" ? "bold" : "600",
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <FiSend size={18} /> Email Dispatches ({emailLogs.length})
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "contact" ? "#f9a825" : "transparent",
            color: activeTab === "contact" ? "#0a2a6b" : "rgba(255,255,255,0.8)",
            fontWeight: activeTab === "contact" ? "bold" : "600",
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <FiMessageSquare size={18} /> Contact Messages ({contactMessages.length})
        </button>

        <button
          onClick={() => setActiveTab("subscriptions")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "subscriptions" ? "#f9a825" : "transparent",
            color: activeTab === "subscriptions" ? "#0a2a6b" : "rgba(255,255,255,0.8)",
            fontWeight: activeTab === "subscriptions" ? "bold" : "600",
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <FiBell size={18} /> Newsletter Subscribers ({newsletterSubscribers.length})
        </button>

        <button
          onClick={() => setActiveTab("domains")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "domains" ? "#f9a825" : "transparent",
            color: activeTab === "domains" ? "#0a2a6b" : "rgba(255,255,255,0.8)",
            fontWeight: activeTab === "domains" ? "bold" : "600",
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <FiLayers size={18} /> Domain Management
        </button>

        <button
          onClick={() => setActiveTab("certificates")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "certificates" ? "#f9a825" : "transparent",
            color: activeTab === "certificates" ? "#0a2a6b" : "rgba(255,255,255,0.8)",
            fontWeight: activeTab === "certificates" ? "bold" : "600",
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
          }}
        >
          <FiShield size={18} /> Certificates & QR
        </button>
      </aside>

      {/* Main Full-Width Content Area */}
      <main style={{ flex: 1, padding: "32px 36px", overflowX: "auto" }}>
        {/* Action Status Toast Banner */}
        {actionMessage && (
          <div
            style={{
              padding: "14px 20px",
              borderRadius: "10px",
              marginBottom: "24px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:
                actionMessage.type === "success"
                  ? "#ecfdf5"
                  : actionMessage.type === "error"
                  ? "#fef2f2"
                  : "#eff6ff",
              color:
                actionMessage.type === "success"
                  ? "#047857"
                  : actionMessage.type === "error"
                  ? "#b91c1c"
                  : "#1d4ed8",
              border: `1px solid ${
                actionMessage.type === "success"
                  ? "#a7f3d0"
                  : actionMessage.type === "error"
                  ? "#fecaca"
                  : "#bfdbfe"
              }`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span>{actionMessage.text}</span>
            <button
              onClick={() => setActionMessage(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "students" && "Student & Application Management"}
              {activeTab === "emails" && "Sent Email Logs & Dispatches"}
              {activeTab === "contact" && "Contact Form Messages"}
              {activeTab === "subscriptions" && "Newsletter Email Subscribers"}
              {activeTab === "domains" && "Internship Domain Management"}
              {activeTab === "certificates" && "Certificate & Verification Management"}
            </h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>
              Live real-time data from VeloraSkills PostgreSQL / Supabase Database
            </p>
          </div>
          <button
            onClick={fetchAdminData}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#0f172a",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh Live Data"}
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              {metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "#ffffff",
                    padding: "24px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>
                    {m.label}
                  </span>
                  <strong style={{ display: "block", fontSize: "32px", color: "#0a2a6b", marginTop: "8px" }}>
                    {m.value}
                  </strong>
                </div>
              ))}
            </div>

            <div style={{ background: "#ffffff", padding: "28px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#0f172a" }}>Quick Actions</h3>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setActiveTab("students")}
                  style={{ padding: "12px 20px", background: "#0a2a6b", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Manage Applications ({applications.length})
                </button>
                <button
                  onClick={() => setActiveTab("emails")}
                  style={{ padding: "12px 20px", background: "#f9a825", color: "#0a2a6b", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  View Sent Emails ({emailLogs.length})
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  style={{ padding: "12px 20px", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  View Contact Messages ({contactMessages.length})
                </button>
                <button
                  onClick={() => setActiveTab("subscriptions")}
                  style={{ padding: "12px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Newsletter Subscribers ({newsletterSubscribers.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS & INTERNS */}
        {activeTab === "students" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", width: "100%" }}>
            {/* Search & Filter Bar */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
                <FiSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Search by Name, Email, Intern ID, or Domain..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 42px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", background: "#fff" }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Active / Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Full Width Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>
                    <th style={{ padding: "14px" }}>Intern Details</th>
                    <th style={{ padding: "14px" }}>Domain & Intern ID</th>
                    <th style={{ padding: "14px" }}>Sent Emails</th>
                    <th style={{ padding: "14px" }}>Status</th>
                    <th style={{ padding: "14px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                        No intern applications found.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => {
                      const isCompleted = app.status === "completed";
                      const isProcessing = processingId === app.id;

                      return (
                        <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "14px" }}>
                            <strong style={{ display: "block", color: "#0f172a", fontSize: "15px" }}>{app.full_name}</strong>
                            <span style={{ fontSize: "13px", color: "#2563eb" }}>{app.email}</span>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>Phone: {app.phone}</div>
                          </td>

                          <td style={{ padding: "14px" }}>
                            <div style={{ fontWeight: "600", color: "#1e293b" }}>{app.domain}</div>
                            <div style={{ fontSize: "13px", color: "#059669", fontWeight: "bold" }}>
                              {app.intern_id || "ID Pending"}
                            </div>
                          </td>

                          <td style={{ padding: "14px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#1d4ed8", background: "#eff6ff", padding: "3px 10px", borderRadius: "12px", width: "fit-content" }}>
                                📄 Offer Letter: Sent ✅
                              </span>
                              <span style={{ fontSize: "12px", color: isCompleted ? "#047857" : "#64748b", background: isCompleted ? "#ecfdf5" : "#f1f5f9", padding: "3px 10px", borderRadius: "12px", width: "fit-content" }}>
                                🎓 Experience Letter: {isCompleted ? "Sent ✅" : "Not Sent"}
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: "14px" }}>
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                background: isCompleted ? "#d1fae5" : "#dbeafe",
                                color: isCompleted ? "#065f46" : "#1e40af",
                              }}
                            >
                              {app.status}
                            </span>
                          </td>

                          <td style={{ padding: "14px", textAlign: "right" }}>
                            {isCompleted ? (
                              <Link
                                href="/certificate-verification"
                                style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#059669", fontWeight: "bold", fontSize: "13px" }}
                              >
                                Verified Cert <FiExternalLink />
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleApproveCompletion(app)}
                                disabled={isProcessing}
                                style={{
                                  background: "#059669",
                                  color: "#ffffff",
                                  border: "none",
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                  cursor: isProcessing ? "wait" : "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <FiUserCheck />
                                {isProcessing ? "Sending..." : "Approve & Email"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EMAIL LOGS & DISPATCHES */}
        {activeTab === "emails" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a" }}>Sent Email Dispatches ({filteredEmailLogs.length})</h3>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Track every Offer Letter & Experience Letter email dispatched via Resend</span>
              </div>
              <div style={{ position: "relative", width: "300px" }}>
                <FiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Filter email logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>
                    <th style={{ padding: "14px" }}>Recipient Intern</th>
                    <th style={{ padding: "14px" }}>Email Type & Attachment</th>
                    <th style={{ padding: "14px" }}>Domain</th>
                    <th style={{ padding: "14px" }}>Sent Date</th>
                    <th style={{ padding: "14px" }}>Delivery Status</th>
                    <th style={{ padding: "14px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmailLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                        No email dispatch records found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmailLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "14px" }}>
                          <strong style={{ display: "block", color: "#0f172a" }}>{log.recipientName}</strong>
                          <span style={{ fontSize: "13px", color: "#2563eb" }}>{log.recipientEmail}</span>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>ID: {log.internId || "Pending"}</div>
                        </td>

                        <td style={{ padding: "14px" }}>
                          <strong style={{ color: log.emailCategory === "experience" ? "#047857" : "#1d4ed8" }}>
                            {log.type}
                          </strong>
                          <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                            <FiFileText /> {log.attachment}
                          </div>
                        </td>

                        <td style={{ padding: "14px", fontSize: "13px", fontWeight: "600" }}>
                          {log.domain}
                        </td>

                        <td style={{ padding: "14px", fontSize: "13px", color: "#64748b" }}>
                          {log.sentAt}
                        </td>

                        <td style={{ padding: "14px" }}>
                          <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                            {log.status}
                          </span>
                        </td>

                        <td style={{ padding: "14px", textAlign: "right" }}>
                          <button
                            onClick={() => handleResendOfferEmail(log.appRecord)}
                            style={{
                              background: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              color: "#0f172a",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FiSend size={12} /> Resend Email
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DEDICATED CONTACT MESSAGES */}
        {activeTab === "contact" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", width: "100%" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a" }}>Contact Form Submissions ({contactMessages.length})</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px" }}>Sender Name & Email</th>
                    <th style={{ padding: "12px" }}>Topic</th>
                    <th style={{ padding: "12px" }}>Message Details</th>
                    <th style={{ padding: "12px" }}>Submitted Date</th>
                    <th style={{ padding: "12px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                        No contact form submissions recorded yet. Submissions from /contact page will appear here.
                      </td>
                    </tr>
                  ) : (
                    contactMessages.map((msg) => (
                      <tr key={msg.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "12px" }}>
                          <strong style={{ display: "block", color: "#0f172a" }}>{msg.full_name}</strong>
                          <a href={`mailto:${msg.email}`} style={{ fontSize: "13px", color: "#2563eb", textDecoration: "underline" }}>
                            {msg.email}
                          </a>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                            {msg.topic || "General"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", maxWidth: "360px", fontSize: "13px", color: "#334155" }}>
                          {msg.message}
                        </td>
                        <td style={{ padding: "12px", fontSize: "12px", color: "#64748b" }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleString("en-IN") : "Recent"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: "#dbeafe", color: "#1e40af", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>
                            {msg.status || "New"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DEDICATED NEWSLETTER SUBSCRIBERS */}
        {activeTab === "subscriptions" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a" }}>Newsletter Email Subscribers ({newsletterSubscribers.length})</h3>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Subscribers who signed up via Footer subscription form</span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "12px", color: "#475569", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px" }}>Subscriber Email</th>
                    <th style={{ padding: "12px" }}>Subscription Status</th>
                    <th style={{ padding: "12px" }}>Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletterSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                        No newsletter subscribers recorded yet. Signups from the site Footer will appear here.
                      </td>
                    </tr>
                  ) : (
                    newsletterSubscribers.map((sub) => (
                      <tr key={sub.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#0f172a", fontSize: "14px" }}>
                          {sub.email}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>
                            Subscribed ✅
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontSize: "12px", color: "#64748b" }}>
                          {sub.created_at ? new Date(sub.created_at).toLocaleString("en-IN") : "Recent"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DOMAINS */}
        {activeTab === "domains" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", width: "100%" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a" }}>Internship Domains Overview</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {Object.entries(domainCounts).map(([domain, count]) => (
                <div key={domain} style={{ padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  <strong style={{ display: "block", color: "#0a2a6b", fontSize: "15px" }}>{domain}</strong>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>{count} Interns Enrolled</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CERTIFICATES */}
        {activeTab === "certificates" && (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", width: "100%" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#0f172a" }}>Issued Certificates & Experience Letters</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              Directly verify issued certificates online or check validity.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "12px", color: "#475569" }}>
                    <th style={{ padding: "12px" }}>Intern Name</th>
                    <th style={{ padding: "12px" }}>Intern ID</th>
                    <th style={{ padding: "12px" }}>Domain</th>
                    <th style={{ padding: "12px" }}>Certificate Status</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Public Verification Link</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.filter(a => a.status === "completed").length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                        No completed certificates issued yet. Approve completion under &quot;Students &amp; Interns&quot; tab to issue certificates.
                      </td>
                    </tr>
                  ) : (
                    applications.filter(a => a.status === "completed").map((app) => (
                      <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "12px", fontWeight: "bold" }}>{app.full_name}</td>
                        <td style={{ padding: "12px", color: "#2563eb", fontWeight: "bold" }}>{app.intern_id}</td>
                        <td style={{ padding: "12px" }}>{app.domain}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                            Valid ✅
                          </span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <Link href="/certificate-verification" style={{ color: "#2563eb", fontWeight: "bold", fontSize: "13px" }}>
                            Verify Online →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
