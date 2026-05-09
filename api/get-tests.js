export default async function handler(req, res) {
    // Luăm cheile secrete din "seiful" Vercel
    const apiKey = process.env.NEON_API_KEY;
    const projectId = process.env.NEON_PROJECT_ID;

    // Interogarea SQL (cele 6 exerciții aleatorii)
    const sqlQuery = `
        SELECT DISTINCT ON (split_part(id_intern, '.', 2)) 
            id_intern, enunt, varianta_a, varianta_b, varianta_c, varianta_d, rf as raspuns_corect, imagine
        FROM teste 
        WHERE split_part(id_intern, '.', 1) IN ('AC', 'AI', 'AF', 'ACR')
          AND split_part(id_intern, '.', 2) IN ('1', '2', '3', '4', '5', '6')
        ORDER BY split_part(id_intern, '.', 2), RANDOM();
    `;

    try {
        const response = await fetch(`https://neon.tech{projectId}/sql?database=neondb`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sqlQuery })
        });

        const data = await response.json();
        
        // Trimitem datele înapoi către site-ul tău
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(500).json({ error: "Eroare la conectarea cu Neon" });
    }
}
