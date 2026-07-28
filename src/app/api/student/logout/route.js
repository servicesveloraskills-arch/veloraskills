import { NextResponse } from "next/server";
import { STUDENT_COOKIE } from "@/lib/studentAuth";

export async function POST(request) {
  const response = NextResponse.redirect(new URL("/student/login", request.url), 303);
  response.cookies.set({
    name: STUDENT_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
