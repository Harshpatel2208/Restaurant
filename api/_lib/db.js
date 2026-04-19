import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

let pool;
let initPromise;

function buildPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };
  }

  return {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'restaurant',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT || 5432)
  };
}

export function getPool() {
  if (!pool) {
    pool = new Pool(buildPoolConfig());
  }
  return pool;
}

async function seedMenuIfEmpty(poolInstance) {
  const countResult = await poolInstance.query('SELECT COUNT(*) FROM menu');
  const count = Number(countResult.rows[0].count || 0);
  if (count > 0) {
    return;
  }

  const menuPath = path.join(process.cwd(), 'menuData.json');
  if (!fs.existsSync(menuPath)) {
    return;
  }

  const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
  for (const item of menuData) {
    await poolInstance.query(
      'INSERT INTO menu (category, name, price, description) VALUES ($1, $2, $3, $4)',
      [item.category, item.name, item.price, item.description || null]
    );
  }
}

export async function ensureSchema() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const poolInstance = getPool();

    await poolInstance.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        description TEXT
      );
    `);

    await poolInstance.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        guests INTEGER NOT NULL,
        time VARCHAR(50) NOT NULL,
        table_zone VARCHAR(255) NOT NULL,
        specific_table VARCHAR(255),
        customer_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await poolInstance.query('ALTER TABLE reservations ADD COLUMN IF NOT EXISTS specific_table VARCHAR(255)');
    await poolInstance.query('ALTER TABLE reservations ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)');
    await poolInstance.query("ALTER TABLE reservations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'");
    await poolInstance.query('ALTER TABLE menu ADD COLUMN IF NOT EXISTS description TEXT');

    await seedMenuIfEmpty(poolInstance);
  })().catch((error) => {
    initPromise = undefined;
    throw error;
  });

  return initPromise;
}
