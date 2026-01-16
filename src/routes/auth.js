import { Router } from "express";
import bcrypt from "bcryptjs";
import pool from "../lib/db.js";

const router = Router();

async function login(table, req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "username and password required" });

  const [rows] = await pool.execute(
    `SELECT id, username, password_hash FROM \`${table}\` WHERE username = ? LIMIT 1`,
    [username]
  );

  const u = rows?.[0];
  if (!u) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({ id: u.id, username: u.username });
}

async function register(table, req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "username and password required" });

  const hash = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.execute(
      `INSERT INTO \`${table}\` (username, password_hash) VALUES (?, ?)`,
      [username, hash]
    );
    
    console.log(`✅ User registered: table=${table}, id=${result.insertId}, username=${username}`);
    
    return res.status(201).json({ 
      id: result.insertId, 
      username: username 
    });
  } catch (e) {
    if (e?.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Username already exists" });
    throw e;
  }
}

router.post("/admin/login", (req, res, next) => login("admins", req, res).catch(next));
router.post("/admin/register", (req, res, next) => register("admins", req, res).catch(next));

router.post("/user/login", (req, res, next) => login("users", req, res).catch(next));
router.post("/user/register", (req, res, next) => register("users", req, res).catch(next));

export default router;