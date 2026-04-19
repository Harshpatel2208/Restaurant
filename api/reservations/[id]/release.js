import { ensureSchema, getPool } from '../../_lib/db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await ensureSchema();
    const pool = getPool();
    const result = await pool.query(
      "UPDATE reservations SET status = 'released' WHERE id = $1 RETURNING *",
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    return res.status(200).json({ success: true, reservation: result.rows[0] });
  } catch (error) {
    console.error('Release table API error:', error);
    return res.status(500).json({ error: 'Failed to release table', details: error.message });
  }
}
