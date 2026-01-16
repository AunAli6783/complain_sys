
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "aunali",
    database: "complain_sys",
    port: 3306
  });

  try {
    console.log("\n🔐 User Password Reset Tool\n");
    
    const username = await question("Enter user username: ");
    const password = await question("Enter new password: ");

    if (!username || !password) {
      console.log("❌ Username and password are required!");
      process.exit(1);
    }

    const hash = await bcrypt.hash(password, 10);

    // Check if user exists
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      // Update existing user
      await pool.execute(
        "UPDATE users SET password_hash = ? WHERE username = ?",
        [hash, username]
      );
      console.log(`✅ Password updated for user: ${username}`);
    } else {
      // Create new user
      await pool.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        [username, hash]
      );
      console.log(`✅ New user created: ${username}`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

main();