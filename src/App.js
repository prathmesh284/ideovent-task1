import { useEffect, useMemo, useState } from 'react';
import { fetchPokemon } from './api.jsx';
import Loading from './components/Loading.jsx';
import Pagination from './components/Pagination.jsx';
import './App.css'

export default function App() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [data, setData] = useState(null); // { page, limit, total, results }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Fetch Pokémon when page/limit changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPokemon({ page, limit })
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!data?.total) return 1;
    return Math.max(1, Math.ceil(data.total / limit));
  }, [data, limit]);

  // Apply search filter on current page
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data?.results || [];
    return (data?.results || []).filter((p) => p.name.includes(q));
  }, [data, query]);

  return (
    <div className="container">
      <header className="header">
        <h1>PokeBrowser</h1>
        <p className="subtitle">See all your favorite pokemons</p>
      </header>

      <section className="controls">
        <input
          className="search"
          placeholder="Search in this page… (e.g., char, squirt)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
        <label className="limit">
          Page size:
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </label>
      </section>

      {loading && <Loading text="Fetching Pokémon…" />}

      {error && (
        <div className="error" role="alert">
          <strong>Something went wrong:</strong> {String(error)}
          <button
            onClick={() => setPage((p) => p)}
            className="retry"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid">
            {filtered.map((p) => (
              <article key={p.id} className="card">
                <img src={p.image} alt={p.name} loading="lazy" />
                <div className="card-body">
                  <h3>
                    #{p.id} {p.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          <footer className="footer">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
            <div className="meta">
              Showing <b>{filtered.length}</b> of{' '}
              <b>{data?.results?.length || 0}</b> on this page · Total
              Pokémon: <b>{data?.total || '—'}</b>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
