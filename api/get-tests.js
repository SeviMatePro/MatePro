import { Client } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Headere pentru CORS (acces de pe GitHub Pages)
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const client = new Client(process.env.DATABASE_URL);

  try {
    await client.connect();
    const { rows } = await client.query('SELECT * FROM teste ORDER BY RANDOM() LIMIT 6');
    
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Eroare Neon Edge", details: err.message }), {
      status: 500,
      headers
    });
  } finally {
    await client.end();
  }
}
