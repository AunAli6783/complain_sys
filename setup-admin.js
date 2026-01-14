import bcrypt from 'bcryptjs';
import pool from './src/lib/db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupAdmin() {
  try {
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO admins (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?',
      [username, hashedPassword, hashedPassword]
    );
    
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    rl.close();
    process.exit();
  }
}

setupAdmin();
