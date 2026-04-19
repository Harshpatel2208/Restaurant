const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'restaurant',
  password: process.env.DB_PASSWORD || 'Harsh@2212',
  port: process.env.DB_PORT || 5432,
});

async function initializeDatabase() {
  try {
    // Create menu table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        description TEXT
      );
    `);

    // Create reservations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        guests INTEGER NOT NULL,
        time VARCHAR(50) NOT NULL,
        table_zone VARCHAR(255) NOT NULL,
        specific_table VARCHAR(50),
        customer_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Safety check to add columns if the table already existed
    await pool.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS specific_table VARCHAR(50)`);
    await pool.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`);
    await pool.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'`);
    await pool.query(`ALTER TABLE menu ADD COLUMN IF NOT EXISTS description TEXT`);

    // Seed menu if empty
    const res = await pool.query('SELECT COUNT(*) FROM menu');
    if (parseInt(res.rows[0].count) === 0) {
      const menuDataPath = path.join(__dirname, '../menuData.json');
      if (fs.existsSync(menuDataPath)) {
        const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));
        for (const item of menuData) {
          await pool.query(
            'INSERT INTO menu (category, name, price, description) VALUES ($1, $2, $3, $4)',
            [item.category, item.name, item.price, item.description]
          );
        }
        console.log('Seeding menu data completed.');
      }
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

// Call on startup
initializeDatabase();

app.get('/api/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// GET all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// POST a new menu item
app.post('/api/menu', async (req, res) => {
  try {
    const { category, name, price, description } = req.body;
    if (!category || !name || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await pool.query(
      'INSERT INTO menu (category, name, price, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [category, name, price, description]
    );
    res.status(201).json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// PUT to update a menu item
app.put('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, price, description } = req.body;
    const result = await pool.query(
      'UPDATE menu SET category = $1, name = $2, price = $3, description = $4 WHERE id = $5 RETURNING *',
      [category, name, price, description, id]
    );
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE a menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM menu WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// POST a new reservation
app.post('/api/reservations', async (req, res) => {
  try {
    const { guests, time, table, specificTable, name } = req.body;
    // Basic validation
    if (!guests || !time || !table || !specificTable || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await pool.query(
      'INSERT INTO reservations (guests, time, table_zone, specific_table, customer_name, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [guests, time, table, specificTable, name, 'occupied']
    );
    res.status(201).json({ success: true, reservation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// GET all reservations
app.get('/api/reservations', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservations ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// PATCH to release table
app.patch('/api/reservations/:id/release', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE reservations SET status = 'released' WHERE id = $1 RETURNING *",
      [id]
    );
    res.json({ success: true, reservation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to release table' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
