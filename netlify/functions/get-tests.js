const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Configurare permisiuni (CORS)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  // Răspuns rapid pentru verificările browserului
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM teste ORDER BY RANDOM() LIMIT 6');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.rows)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Eroare DB", details: err.message })
    };
  } finally {
    await client.end();
  }
};
