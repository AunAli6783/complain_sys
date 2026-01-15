import express from 'express';
import cors from 'cors';
import pool from './lib/db.js';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
      ...r,
      createdAt: r.created_at ?? r.createdAt,
      resolvedAt: r.resolved_at ?? r.resolvedAt,
      resolutionNote: r.resolution_note ?? r.resolutionNote,
      resolvedByName: r.resolved_by_name ?? r.resolvedByName
    }));

    res.json(normalized);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Add new complaint
app.post('/api/complaints', async (req, res) => {
  const { title, description, category } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO complaints (title, description, category, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [title, description, category || 'general', 'Pending']
    );
    res.json({ id: result.insertId, success: true });
  } catch (error) {
    console.error('Error adding complaint:', error);
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

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }
    
    const admin = rows[0];
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) {
      return res.status(401).send('Invalid credentials');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
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