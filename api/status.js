import { ensureSchema, didSkipSchemaBootstrap, getPool } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await ensureSchema();
    const result = await getPool().query('SELECT NOW()');
    return res.status(200).json({
      status: 'ok',
      time: result.rows[0].now,
      bootstrapMode: didSkipSchemaBootstrap() ? 'skipped-in-production' : 'enabled'
    });
  } catch (error) {
    console.error('Status check failed:', error);
    return res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
}
