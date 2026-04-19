import { ensureSchema, getPool } from '../_lib/db.js';

export default async function handler(req, res) {
  try {
    await ensureSchema();
    const pool = getPool();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { guests, time, table, specificTable, name } = req.body || {};
      if (!guests || !time || !table || !specificTable || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(
        'INSERT INTO reservations (guests, time, table_zone, specific_table, customer_name, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [Number(guests), time, table, specificTable, name, 'occupied']
      );

      return res.status(201).json({ success: true, reservation: result.rows[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reservations API error:', error);
    return res.status(500).json({ error: 'Failed to create reservation', details: error.message });
  }
}
