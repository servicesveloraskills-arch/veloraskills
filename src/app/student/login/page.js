import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StudentLoginForm } from "@/components/forms/StudentLoginForm";
import {
  STUDENT_COOKIE,
  getStudentDemoCredentials,
  isValidStudentSession,
} from "@/lib/studentAuth";

export const metadata = {
  title: "Student Login | VeloraSkills",
  description: "Student portal login for VeloraSkills internship dashboard access.",
};

export default async function StudentLogin({ searchParams }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(STUDENT_COOKIE)?.value;

  if (isValidStudentSession(session)) {
    redirect("/student/dashboard");
  }

  const params = await searchParams;

  if (params?.email || params?.password) {
    redirect("/student/login");
  }

  const demoCredentials = getStudentDemoCredentials();
  const initialError =
    params?.error === "invalid" ? "Invalid student email or password." : "";

  return (
    <main className="admin-auth-page student-auth-page">
      <div className="admin-auth-brand">
        <Link className="brand" href="/">
          <span className="brand__mark">VS</span>
          <span>VeloraSkills</span>
        </Link>
      </div>
      <div className="container admin-auth-grid">
        <section className="admin-auth-copy">
          <p className="eyebrow">Student workspace</p>
          <h2>Login to access your internship dashboard.</h2>
          <p>
            View offer letters, tasks, submissions, progress, payments,
            feedback, resources, and certificate downloads from one student
            portal.
          </p>
          <div className="admin-auth-points">
            <span>Task progress</span>
            <span>Offer letter</span>
            <span>Certificate download</span>
          </div>
        </section>
        <StudentLoginForm
          demoEmail={demoCredentials.email}
          demoPassword={demoCredentials.password}
          initialError={initialError}
        />
      </div>
    </main>
  );
}
