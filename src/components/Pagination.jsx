export default function Pagination({ page, totalPages, onChange }) {
    const prev = () => onChange(Math.max(1, page - 1));
    const next = () => onChange(Math.min(totalPages, page + 1));


    // Compact paginator with first/last and current neighbors
    const pages = [];
    const add = (p) => pages.push(p);
    add(1);
    if (page > 3) add('…');
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) add(p);
    if (page < totalPages - 2) add('…');
    if (totalPages > 1) add(totalPages);


    return (
        <div className="paginator">
            <button onClick={prev} disabled={page === 1} aria-label="Previous page">‹ Prev</button>
                {pages.map((p, i) => (
                    <button
                        key={i}
                        className={p === page ? 'active' : ''}
                        disabled={p === '…'}
                        onClick={() => p !== '…' && onChange(p)}
                    >
                        {p}
                    </button>
                ))}
            <button onClick={next} disabled={page === totalPages} aria-label="Next page">Next ›</button>
        </div>
    );
}