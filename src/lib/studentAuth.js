export const STUDENT_COOKIE = "veloraskills_student_session";

const DEFAULT_EMAIL = "student@veloraskills.tech";
const DEFAULT_PASSWORD = "student123";
const DEFAULT_SESSION = "veloraskills-student-demo-session";

export function getStudentCredentials() {
  return {
    email: process.env.STUDENT_EMAIL || DEFAULT_EMAIL,
    password: process.env.STUDENT_PASSWORD || DEFAULT_PASSWORD,
    session: process.env.STUDENT_SESSION_SECRET || DEFAULT_SESSION,
  };
}

export function isValidStudentSession(value) {
  return Boolean(value && value === getStudentCredentials().session);
}

export function getStudentDemoCredentials() {
  return {
    email: DEFAULT_EMAIL,
    password: DEFAULT_PASSWORD,
  };
}
