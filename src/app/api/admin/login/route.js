import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminCredentials } from "@/lib/adminAuth";
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
    const credentials = getAdminCredentials();
    const dbAdmin = await verifyAdminFromDatabase(email, password);

    if (!dbAdmin && (email !== credentials.email.toLowerCase() || password !== credentials.password)) {
      if (!isJson) {
        return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
      }

      return NextResponse.json(
        { ok: false, message: "Invalid admin email or password." },
        { status: 401 },
      );
    }

    const response = isJson
      ? NextResponse.json({ ok: true, message: "Admin login successful." })
      : NextResponse.redirect(new URL("/admin/dashboard", request.url), 303);
    response.cookies.set({
      name: ADMIN_COOKIE,
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

async function verifyAdminFromDatabase(email, password) {
  try {
    const rows = await query(
      "SELECT id, password_hash FROM admin_users WHERE LOWER(email) = :email AND status = 'active' LIMIT 1",
      { email },
    );
    const admin = rows[0];

    if (!admin || !verifyPassword(password, admin.password_hash)) {
      return null;
    }

    await query("UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id", {
      id: admin.id,
    });

    return admin;
  } catch {
    return null;
  }
}
