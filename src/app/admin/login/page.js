import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/forms/AdminLoginForm";
import {
  ADMIN_COOKIE,
  getAdminDemoCredentials,
  isValidAdminSession,
} from "@/lib/adminAuth";

export const metadata = {
  title: "Admin Login | VeloraSkills",
  description: "Secure admin login for the VeloraSkills internship management panel.",
};

export default async function AdminLogin({ searchParams }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (isValidAdminSession(session)) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;

  if (params?.email || params?.password) {
    redirect("/admin/login");
  }

  const demoCredentials = getAdminDemoCredentials();
  const initialError =
    params?.error === "invalid" ? "Invalid admin email or password." : "";

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-brand">
        <Link className="brand" href="/">
          <span className="brand__mark">VS</span>
          <span>VeloraSkills</span>
        </Link>
      </div>
      <div className="container admin-auth-grid">
        <section className="admin-auth-copy">
          <p className="eyebrow">Admin workspace</p>
          <h2>Separate panel for operations and verification teams.</h2>
          <p>
            Manage student applications, task reviews, payment checks, bulk
            certificates, communication, and analytics from a protected route.
          </p>
          <div className="admin-auth-points">
            <span>HttpOnly session cookie</span>
            <span>Protected dashboard route</span>
            <span>Environment-based credentials</span>
          </div>
        </section>
        <AdminLoginForm
          demoEmail={demoCredentials.email}
          demoPassword={demoCredentials.password}
          initialError={initialError}
        />
      </div>
    </main>
  );
}
