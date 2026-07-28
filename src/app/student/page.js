import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STUDENT_COOKIE, isValidStudentSession } from "@/lib/studentAuth";

export default async function StudentIndex() {
  const cookieStore = await cookies();
  const session = cookieStore.get(STUDENT_COOKIE)?.value;

  if (isValidStudentSession(session)) {
    redirect("/student/dashboard");
  }

  redirect("/student/login");
}
