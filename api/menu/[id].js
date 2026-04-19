import { ensureSchema, getPool } from '../_lib/db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await ensureSchema();
    const pool = getPool();

    if (req.method === 'PUT') {
      const { category, name, price, description } = req.body || {};
      const result = await pool.query(
        'UPDATE menu SET category = $1, name = $2, price = $3, description = $4 WHERE id = $5 RETURNING *',
        [category, name, Number(price), description || null, id]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: 'Menu item not found' });
      }

      return res.status(200).json({ success: true, item: result.rows[0] });
    }

    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM menu WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Menu item API error:', error);
    return res.status(500).json({ error: 'Failed to process menu item request', details: error.message });
  }
}
