import express from "express";
// ...existing code...
import authRouter from "./src/routes/auth.js"; // adjust path if your routes folder differs
import pool from "./src/config/database.js"; // Add this import for database connection

const app = express();

// Ensure JSON bodies work for POST /api/auth/* 
app.use(express.json());

// PROBES: to confirm you are running the correct server process
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.get("/api/auth/_probe", (req, res) => res.json({ ok: true }));

// Mount auth routes (this is what your frontend calls)
app.use("/api/auth", authRouter);

// ...existing code...

app.get("/api/complaints", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        id, 
        title, 
        description, 
        category, 
        status, 
        user_id AS userId, 
        username AS userUsername, 
        created_at AS createdAt,
        resolved_at AS resolvedAt,
        resolution_note AS resolutionNote,
        resolved_by AS resolvedBy
      FROM complaints 
      ORDER BY id DESC`
    );
    
    res.json(rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// ...existing code...

app.patch("/api/complaints/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote, resolvedBy } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const resolvedAt = status === "Resolved" ? new Date() : null;

    await pool.execute(
      `UPDATE complaints 
       SET status = ?, 
           resolved_at = ?, 
           resolution_note = ?,
           resolved_by = ?
       WHERE id = ?`,
      [status, resolvedAt, resolutionNote || null, resolvedBy || null, id]
    );

    const [rows] = await pool.execute(
      `SELECT 
        id, 
        title, 
        description, 
        category, 
        status, 
        user_id AS userId, 
        username AS userUsername, 
        created_at AS createdAt,
        resolved_at AS resolvedAt,
        resolution_note AS resolutionNote,
        resolved_by AS resolvedBy
      FROM complaints 
      WHERE id = ?`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Failed to update complaint" });
  }
});

// ...existing code...

app.post("/api/complaints", async (req, res) => {
  try {
    const { title, description, category, userId, userUsername } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const [result] = await pool.execute(
      `INSERT INTO complaints (title, description, category, status, user_id, username)
       VALUES (?, ?, ?, 'Pending', ?, ?)`,
      [title, description, category || null, userId || null, userUsername || null]
    );

    console.log(`✅ Complaint created: id=${result.insertId}, userId=${userId}, username=${userUsername}`);

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      category,
      status: "Pending",
      userId: userId || null,
      userUsername: userUsername || null
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Failed to create complaint" });
  }
});

// ...existing code...