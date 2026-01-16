
import pool from './src/lib/db.js';

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Add user_id column
    await pool.query(`
      ALTER TABLE complaints 
      ADD COLUMN IF NOT EXISTS user_id INT NULL AFTER status
    `).catch(e => console.log('user_id may already exist:', e.message));
    
    // Add username column
    await pool.query(`
      ALTER TABLE complaints 
      ADD COLUMN IF NOT EXISTS username VARCHAR(100) NULL AFTER user_id
    `).catch(e => console.log('username may already exist:', e.message));
    
    // Add resolved_at column
    await pool.query(`
      ALTER TABLE complaints 
      ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP NULL AFTER username
    `).catch(e => console.log('resolved_at may already exist:', e.message));
    
    // Add resolution_note column
    await pool.query(`
      ALTER TABLE complaints 
      ADD COLUMN IF NOT EXISTS resolution_note TEXT NULL AFTER resolved_at
    `).catch(e => console.log('resolution_note may already exist:', e.message));
    
    // Add resolved_by column
    await pool.query(`
      ALTER TABLE complaints 
      ADD COLUMN IF NOT EXISTS resolved_by INT NULL AFTER resolution_note
    `).catch(e => console.log('resolved_by may already exist:', e.message));
    
    console.log('✓ Migration completed successfully!');
    
    // Verify columns
    const [cols] = await pool.query('SHOW COLUMNS FROM complaints');
    console.log('\nComplaint table columns:');
    cols.forEach(c => console.log(`  - ${c.Field} (${c.Type})`));
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrate();