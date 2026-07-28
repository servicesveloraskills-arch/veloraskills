import { NextResponse } from "next/server";
import { STUDENT_COOKIE, getStudentCredentials } from "@/lib/studentAuth";
import { query } from "@/lib/mysql";
import { verifyPassword } from "@/lib/password";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const credentials = getStudentCredentials();
    const dbStudent = await verifyStudentFromDatabase(email, password);

    if (!dbStudent && (email !== credentials.email.toLowerCase() || password !== credentials.password)) {
      if (!isJson) {
        return NextResponse.redirect(new URL("/student/login?error=invalid", request.url), 303);
      }

      return NextResponse.json(
        { ok: false, message: "Invalid student email or password." },
        { status: 401 },
      );
    }

    const response = isJson
      ? NextResponse.json({ ok: true, message: "Student login successful." })
      : NextResponse.redirect(new URL("/student/dashboard", request.url), 303);
    response.cookies.set({
      name: STUDENT_COOKIE,
      value: credentials.session,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Login request is not valid." },
      { status: 400 },
    );
  }
}

async function verifyStudentFromDatabase(email, password) {
  try {
    const rows = await query(
      "SELECT id, password_hash FROM student_accounts WHERE LOWER(email) = :email AND status = 'active' LIMIT 1",
      { email },
    );
    const student = rows[0];

    if (!student || !verifyPassword(password, student.password_hash)) {
      return null;
    }

    await query("UPDATE student_accounts SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id", {
      id: student.id,
    });

    return student;
  } catch {
    return null;
  }
}
