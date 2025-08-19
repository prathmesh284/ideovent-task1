// server.js
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

// Utility: extract Pokémon ID from URL
const idFromUrl = (url) => {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
};

// Utility: generate Pokémon artwork URL
const artwork = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Pokémon API proxy with pagination
app.get('/api/pokemon', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 60);
    const offset = (page - 1) * limit;

    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res
        .status(502)
        .json({ error: 'Upstream PokeAPI error', status: response.status });
    }

    console.log("Fetching:", apiUrl, "Status:", response.status);
    const data = await response.json();
    const total = data.count || 0;

    const results = (data.results || []).map((p) => {
      const id = idFromUrl(p.url);
      return {
        id,
        name: p.name,
        image: id ? artwork(id) : null,
      };
    });

    res.json({ page, limit, total, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`\nPokeBrowser API running on http://localhost:${PORT}`);
});
