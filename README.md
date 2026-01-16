# Complaint Management System

A full-stack complaint management system built with React (frontend) and Express.js (backend) with MySQL database.

## Features

- User authentication (login/register)
- Submit complaints with categories
- View all complaints in real-time
- Admin panel to manage and resolve complaints
- Role-based access control (User/Admin)
- Track complaint status (Pending, In Progress, Resolved)
- Resolution notes and history

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v5.7 or higher)
- npm or yarn package manager

## Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE complaint_system;
USE complaint_system;
```

### 2. Create Tables

```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints table
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
  user_id INT,
  username VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  resolution_note TEXT,
  resolved_by VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 3. Create Admin and Test Users

**Option A: Hash passwords manually**

First, create a script to hash passwords:

```javascript
// hash-password.js
import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hashed: ${hashed}\n`);
};

hashPassword('admin123');
hashPassword('user123');
```

Run the script:

```bash
node hash-password.js
```

**Option B: Insert directly into the database**

```sql
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', '<hashed_admin_password>', 'admin'),
('user', 'user@example.com', '<hashed_user_password>', 'user');
```

Replace `<hashed_admin_password>` and `<hashed_user_password>` with the hashed passwords generated from Option A.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/complaint-management-system.git
cd complaint-management-system
```

### 2. Install dependencies

For the backend:

```bash
cd backend
npm install
```

For the frontend:

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend` directory and add the following:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=complaint_system
JWT_SECRET=your_jwt_secret
```

Replace `yourpassword` and `your_jwt_secret` with your MySQL password and a secret key for JWT.

### 4. Run the application

Start the backend server:

```bash
cd backend
npm start
```

Start the frontend development server:

```bash
cd frontend
npm start
```

The application should now be running at `http://localhost:3000`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
