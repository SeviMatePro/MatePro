import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    try {
        // Aceasta este "țeava" care folosește DATABASE_URL din Vercel
        const sql = neon(process.env.DATABASE_URL);

        // Interogarea SQL pentru cele 6 exerciții
        const rows = await sql`
            SELECT DISTINCT ON (split_part(id_intern, '.', 2)) 
                id_intern, enunt, varianta_a, varianta_b, varianta_c, varianta_d, rf as raspuns_corect, imagine
            FROM teste 
            WHERE split_part(id_intern, '.', 1) IN ('AC', 'AI', 'AF', 'ACR')
              AND split_part(id_intern, '.', 2) IN ('1', '2', '3', '4', '5', '6')
            ORDER BY split_part(id_intern, '.', 2), RANDOM();
        `;
        
        // Trimitem datele către site
        res.status(200).json(rows);
    } catch (error) {
        console.error('Eroare detaliată:', error);
        res.status(500).json({ error: "Eroare la conectare. Verifică DATABASE_URL." });
    }
}
