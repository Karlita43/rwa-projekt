import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../featured_cocktails.css";

type Cocktail = {
  id: number;
  name: string;
  description?: string;
  image_url: string | null;
};

function resolveCocktailImage(image_url: string | null) {
  if (image_url && /^https?:\/\//i.test(image_url)) return image_url;
  return image_url ? `/koktel_slike/${image_url}` : "/koktel_slike/placeholder.jpg";
}

function getPaginationPages(current: number, total: number) {
  const pages: (number | "...")[] = [];
  if (total <= 1) return [1];

  const push = (v: number | "...") => pages.push(v);

  // uvijek prva
  push(1);

  // prozor oko trenutne: current-1, current, current+1 (bez 1 i total)
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) push("...");

  for (let i = start; i <= end; i++) push(i);

  if (end < total - 1) push("...");

  // uvijek zadnja (ako je > 1)
  push(total);

  // ukloni moguće duplikate (npr. total=2)
  return pages.filter((v, idx) => pages.indexOf(v) === idx);
}

export default function Cocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const url = q.trim()
      ? `http://127.0.0.1:8000/api/cocktails/search?q=${encodeURIComponent(
        q.trim()
      )}&page=${page}`
      : `http://127.0.0.1:8000/api/cocktails?page=${page}`;

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(url, { headers })
      .then((r) => r.json())
      .then((res) => {
        setCocktails(res.data ?? []);
        setNextUrl(res.next_page_url ?? null);
        setPrevUrl(res.prev_page_url ?? null);

        const lp = res.last_page ?? res?.meta?.last_page ?? 1;
        setLastPage(Number(lp) || 1);
      })
      .catch((err) => console.error("Cocktails fetch error:", err))
      .finally(() => setLoading(false));
  }, [page, q]);

  const pagesToRender = useMemo(() => getPaginationPages(page, lastPage), [page, lastPage]);

  return (
    <section className="featured" style={{ marginTop: "2rem" }}>
      <div
        className="featured-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "baseline",
        }}
      >
        <h2>Ponuda naših koktela</h2>

        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Pretraži koktele..."
          style={{
            padding: ".6rem .8rem",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,.12)",
            width: 280,
            maxWidth: "100%",
          }}
        />
      </div>

      {loading && <p>Učitavanje...</p>}

      {!loading && (
        <>
          <div className="featured-grid">
            {cocktails.map((c) => (
              <Link key={c.id} to={`/kokteli/${c.id}`} className="card-link">
                <article className="cocktail-card">
                  <div className="cocktail-media">
                    <img
                      src={resolveCocktailImage(c.image_url)}
                      alt={c.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="cocktail-body">
                    <h3>{c.name}</h3>
                    {c.description && <p className="cocktail-desc">{c.description}</p>}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Stranicenje */}
          <div className="pagination">
            <button
              className="btn"
              disabled={!prevUrl || page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Prethodna
            </button>

            <div className="page-numbers" aria-label="Stranice">
              {pagesToRender.map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="page-dots">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`page-btn ${p === page ? "is-active" : ""}`}
                    onClick={() => setPage(p)}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              className="btn"
              disabled={!nextUrl || page === lastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Sljedeća →
            </button>
          </div>
        </>
      )}
    </section>
  );
}
