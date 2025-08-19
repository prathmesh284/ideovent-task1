export async function fetchPokemon({ page = 1, limit = 12 } = {}) {
    // const res = await fetch(`http://localhost:5000/api/pokemon?page=${page}&limit=${limit}`);
    const res = await fetch(`/api/pokemon?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
}