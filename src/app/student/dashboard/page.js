import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { STUDENT_COOKIE, isValidStudentSession } from "@/lib/studentAuth";
import { resources, studentSnapshot, studentTasks } from "@/data/site";

export const metadata = {
  title: "Student Dashboard | VeloraSkills",
  description: "Student internship dashboard for tasks, progress, offer letter, payment, and certificate downloads.",
};

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get(STUDENT_COOKIE)?.value;

  if (!isValidStudentSession(session)) {
    redirect("/student/login");
  }

  return (
    <>
      <Header />
      <main className="dashboard-page">
        <section className="dashboard-hero">
          <div className="container dashboard-hero__grid">
            <div>
              <p className="eyebrow">Student dashboard</p>
              <h1>Welcome back, {studentSnapshot.name}</h1>
              <p>
                Track your offer letter, assigned tasks, progress, payment,
                feedback, and certificate readiness in one workspace.
              </p>
            </div>
            <article className="panel identity-card">
              <span>Intern ID</span>
              <strong>{studentSnapshot.internId}</strong>
              <p>{studentSnapshot.domain}</p>
              <div className="progress-bar" aria-label={`${studentSnapshot.progress}% complete`}>
                <span style={{ width: `${studentSnapshot.progress}%` }} />
              </div>
              <small>{studentSnapshot.progress}% complete</small>
              <form action="/api/student/logout" method="POST">
                <button className="button button--primary" type="submit">
                  Logout
                </button>
              </form>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="container dashboard-two-col">
            <div className="panel dashboard-panel">
              <div className="panel-heading">
                <h2>Task Progress</h2>
                <span>{studentSnapshot.nextDeadline}</span>
              </div>
              <div className="task-list">
                {studentTasks.map((task) => (
                  <article key={task.title}>
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.status}</p>
                    </div>
                    <strong>{task.score}</strong>
                  </article>
                ))}
              </div>
            </div>

            <div className="dashboard-stack">
              <article className="panel dashboard-panel">
                <h2>Documents</h2>
                <div className="document-list">
                  <a href="#offer-letter">Offer Letter</a>
                  <a href="#payment">Payment Receipt</a>
                  <a href="#certificate">Certificate Download</a>
                  <a href="#feedback">Feedback Report</a>
                </div>
              </article>
              <article className="panel dashboard-panel">
                <h2>Learning Resources</h2>
                <div className="document-list">
                  {resources.slice(0, 3).map((resource) => (
                    <a href={resource.href} key={resource.title}>
                      {resource.title}
                    </a>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
