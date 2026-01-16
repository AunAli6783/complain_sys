import express from 'express';
import cors from 'cors';
import pool from './lib/db.js';
import authRouter from "./routes/auth.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mount auth routes FIRST (before other routes)
app.use("/api/auth", authRouter);

// Get all complaints (include resolver name if resolved)
app.get('/api/complaints', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        c.*,
        a.username AS resolved_by_name
      FROM complaints c
      LEFT JOIN admins a ON a.id = c.resolved_by
      ORDER BY c.created_at DESC
      `
    );

    const normalized = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      status: r.status,
      userId: Number(r.user_id) || null,
      user_id: Number(r.user_id) || null,
      userUsername: r.username || null,
      username: r.username || null,
      createdAt: r.created_at,
      created_at: r.created_at,
      resolvedAt: r.resolved_at,
      resolved_at: r.resolved_at,
      resolutionNote: r.resolution_note,
      resolution_note: r.resolution_note,
      resolvedBy: r.resolved_by,
      resolved_by: r.resolved_by,
      resolvedByName: r.resolved_by_name,
      resolved_by_name: r.resolved_by_name
    }));

    // Debug logging
    console.log(`Returning ${normalized.length} complaints`);
    if (normalized.length > 0) {
      console.log('Sample complaint:', JSON.stringify(normalized[0], null, 2));
    }

    res.json(normalized);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Add new complaint
app.post('/api/complaints', async (req, res) => {
  const { title, description, category, userId, userUsername } = req.body;
  
  console.log('=== POST /api/complaints ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Extracted values:', { 
    title, 
    description, 
    category, 
    userId: userId, 
    userUsername: userUsername,
    userIdType: typeof userId,
    usernameType: typeof userUsername
  });
  
  try {
    const [result] = await pool.query(
      'INSERT INTO complaints (title, description, category, status, user_id, username, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [title, description, category || 'general', 'Pending', userId || null, userUsername || null]
    );
    
    console.log('✅ Complaint inserted successfully');
    console.log('   - Insert ID:', result.insertId);
    console.log('   - User ID saved:', userId);
    console.log('   - Username saved:', userUsername);
    
    // Verify what was actually saved
    const [verify] = await pool.query(
      'SELECT id, user_id, username FROM complaints WHERE id = ?',
      [result.insertId]
    );
    console.log('   - Verified in DB:', verify[0]);
    
    res.json({ id: result.insertId, success: true });
  } catch (error) {
    console.error('❌ Error adding complaint:', error);
    res.status(500).json({ error: 'Failed to add complaint' });
  }
});

// Resolve complaint (now records which admin resolved it)
app.put('/api/complaints/:id/resolve', async (req, res) => {
  const id = Number(req.params.id);
  const { resolutionNote, adminUsername } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid complaint id' });
  }
  if (!adminUsername) {
    return res.status(400).json({ error: 'adminUsername is required' });
  }

  try {
    const [admins] = await pool.query(
      'SELECT id FROM admins WHERE username = ?',
      [adminUsername]
    );
    if (!admins.length) return res.status(400).json({ error: 'Admin not found' });

    const adminId = admins[0].id;

    const [result] = await pool.query(
      'UPDATE complaints SET status = ?, resolution_note = ?, resolved_at = NOW(), resolved_by = ? WHERE id = ?',
      ['Resolved', resolutionNote || '', adminId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error resolving complaint:', error);
    res.status(500).json({
      error: 'Failed to resolve complaint',
      details: error?.sqlMessage || error?.message || String(error)
    });
  }
});

// DB/Schema quick check (visit in browser: http://localhost:3000/api/health)
app.get('/api/health', async (req, res) => {
  try {
    const [db] = await pool.query('SELECT DATABASE() AS db');
    const [cols] = await pool.query('SHOW COLUMNS FROM complaints');
    res.json({
      ok: true,
      db: db?.[0]?.db,
      complaintsColumns: cols.map((c) => c.Field)
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error?.sqlMessage || error?.message || String(error)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});