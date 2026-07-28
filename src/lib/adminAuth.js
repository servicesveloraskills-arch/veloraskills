export const ADMIN_COOKIE = "veloraskills_admin_session";

const DEFAULT_EMAIL = "admin@veloraskills.tech";
const DEFAULT_PASSWORD = "admin123";
const DEFAULT_SESSION = "veloraskills-admin-demo-session";

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || DEFAULT_EMAIL,
    password: process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD,
    session: process.env.ADMIN_SESSION_SECRET || DEFAULT_SESSION,
  };
}

export function isValidAdminSession(value) {
  return Boolean(value && value === getAdminCredentials().session);
}

export function getAdminDemoCredentials() {
  return {
    email: DEFAULT_EMAIL,
    password: DEFAULT_PASSWORD,
  };
}
