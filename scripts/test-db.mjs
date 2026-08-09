import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        process.env[key] = value;
      }
    }
  });
}

async function testDatabase() {
  console.log("🔍 Testing Database Connection...\n");

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes("[YOUR-PASSWORD]")) {
    console.error("❌ ERROR: DATABASE_URL in .env.local still contains placeholder '[YOUR-PASSWORD]'!");
    console.error("👉 Please replace '[YOUR-PASSWORD]' with your actual Supabase Database Password in .env.local\n");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log("✅ Connection Successful! Connected to PostgreSQL (Supabase).\n");

    // Test 1: Check internship domains count
    const domainsRes = await client.query("SELECT COUNT(*) FROM internship_domains");
    console.log(`📊 Internship Domains loaded: ${domainsRes.rows[0].count} domains`);

    // Test 2: Check admin user seed data
    const adminRes = await client.query("SELECT full_name, email, role FROM admin_users LIMIT 1");
    if (adminRes.rows.length > 0) {
      console.log(`👤 Admin User found: ${adminRes.rows[0].full_name} (${adminRes.rows[0].email})`);
    }

    // Test 3: Check student account seed data
    const studentRes = await client.query("SELECT full_name, email, intern_id FROM student_accounts LIMIT 1");
    if (studentRes.rows.length > 0) {
      console.log(`🎓 Student Account found: ${studentRes.rows[0].full_name} [${studentRes.rows[0].intern_id}] (${studentRes.rows[0].email})`);
    }

    console.log("\n🎉 CONGRATULATIONS! Your PostgreSQL database is 100% correctly configured and working!\n");
    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Database Connection Failed:");
    console.error(`Message: ${error.message}\n`);
    if (error.message.includes("password authentication failed")) {
      console.error("👉 Tip: The password in .env.local is incorrect. Please check your Supabase Database Password.");
    }
    await pool.end();
    process.exit(1);
  }
}

testDatabase();
