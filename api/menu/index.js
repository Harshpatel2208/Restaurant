import { ensureSchema, getPool } from '../_lib/db.js';

export default async function handler(req, res) {
  try {
    await ensureSchema();
    const pool = getPool();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM menu ORDER BY id ASC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { category, name, price, description } = req.body || {};
      if (!category || !name || price === undefined || price === null || price === '') {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(
        'INSERT INTO menu (category, name, price, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [category, name, Number(price), description || null]
      );
      return res.status(201).json({ success: true, item: result.rows[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Menu API error:', error);
    return res.status(500).json({ error: 'Failed to process menu request', details: error.message });
  }
}
