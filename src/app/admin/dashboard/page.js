import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/adminAuth";
import { adminMetrics, adminRows, programs } from "@/data/site";

export const metadata = {
  title: "Admin Dashboard | VeloraSkills",
  description: "Admin dashboard for student, domain, task, payment, certificate, and analytics management.",
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!isValidAdminSession(session)) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand brand--footer" href="/">
          <span className="brand__mark">VS</span>
          <span>VeloraSkills</span>
        </Link>
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          <a href="#overview">Overview</a>
          <a href="#students">Students</a>
          <a href="#domains">Domains</a>
          <a href="#certificates">Certificates</a>
          <a href="#analytics">Analytics</a>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>Manage interns, tasks, payments, and certificates.</h1>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="button button--light" type="submit">
              Logout
            </button>
          </form>
        </header>

        <section id="overview" className="admin-metrics">
          {adminMetrics.map((metric) => (
            <article className="panel metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <div className="admin-layout">
          <article className="panel dashboard-panel" id="students">
            <div className="panel-heading">
              <h2>Student Management</h2>
              <span>Recent records</span>
            </div>
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Domain</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {adminRows.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>{row.domain}</td>
                      <td>{row.status}</td>
                      <td>{row.payment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="dashboard-stack">
            <article className="panel dashboard-panel" id="domains">
              <h2>Domain Management</h2>
              <div className="document-list">
                {programs.slice(0, 5).map((program) => (
                  <a href="#domains" key={program.title}>
                    {program.title}
                  </a>
                ))}
              </div>
            </article>
            <article className="panel dashboard-panel" id="certificates">
              <h2>Bulk Tools</h2>
              <div className="document-list">
                <a href="#bulk-email">Bulk Email</a>
                <a href="#bulk-certificates">Bulk Certificates</a>
                <a href="#analytics">Analytics Export</a>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
