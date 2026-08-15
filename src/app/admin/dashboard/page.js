import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/adminAuth";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Portal | VeloraSkills",
  description: "Admin portal for student applications, email dispatches, completion approval, and certificate management.",
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!isValidAdminSession(session)) {
    redirect("/admin/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", width: "100%" }}>
      {/* Top Header Bar */}
      <header
        style={{
          height: "64px",
          background: "#0a2a6b",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#ffffff" }}>
          <span
            style={{
              background: "#f9a825",
              color: "#0a2a6b",
              fontWeight: "900",
              fontSize: "14px",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            VS
          </span>
          <strong style={{ fontSize: "18px", letterSpacing: "0.5px" }}>VeloraSkills Admin Portal</strong>
        </Link>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#ffffff",
              padding: "7px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </form>
      </header>

      {/* Interactive Full-Width Dashboard */}
      <AdminDashboardClient />
    </div>
  );
}
