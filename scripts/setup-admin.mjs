import bcrypt from "bcryptjs";
import pool from "../src/lib/db.js";

async function upsertAccount(table, username, password) {
  const hash = await bcrypt.hash(password, 10);

  // admin table uses TEXT; users uses VARCHAR(255) — both accept this.
  await pool.execute(
    `INSERT INTO \`${table}\` (username, password_hash)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, hash]
  );
}

async function main() {
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";

  // IMPORTANT: your existing table is `admin` not `admins`
  await upsertAccount("admin", adminUser, adminPass);

  // Optional: create a test user too (table name is `users`)
  if (process.env.USER_USERNAME && process.env.USER_PASSWORD) {
    await upsertAccount("users", process.env.USER_USERNAME, process.env.USER_PASSWORD);
  }

  console.log("Setup complete.");
  console.log(`Admin username: ${adminUser}`);
  console.log(`Admin password: ${adminPass}`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});