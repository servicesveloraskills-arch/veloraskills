import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/adminAuth";

export default async function AdminIndex() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (isValidAdminSession(session)) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}
