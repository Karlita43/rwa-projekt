import { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../featured_cocktails.css";
import api from "../api";
import { LoginContext } from "../LoginContextProvider";


type Cocktail = {
  id: number;
  name: string;
  description?: string;
  image_url: string | null;
};

function buildPages(current: number, last: number, delta = 2): Array<number | "..."> {
  const pages: Array<number | "..."> = [];
  const range: number[] = [];

  const left = Math.max(1, current - delta);
  const right = Math.min(last, current + delta);

  for (let i = left; i <= right; i++) range.push(i);

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push("...");
  }

  pages.push(...range);

  if (right < last) {
    if (right < last - 1) pages.push("...");
    pages.push(last);
  }

  return pages;
}

function resolveCocktailImage(image_url: string | null) {
  if (image_url && /^https?:\/\//i.test(image_url)) return image_url;
  return image_url ? `/koktel_slike/${image_url}` : "/koktel_slike/placeholder.jpg";
}

export default function Cocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [lastPage, setLastPage] = useState(1);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const { isLoggedIn } = useContext(LoginContext);

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: "Bearer " + token },
    }),
    [token]
  );

  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // load cocktails list
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params = { page, ...(q.trim() ? { q: q.trim() } : {}) };
        const endpoint = q.trim() ? "/cocktails/search" : "/cocktails";
        const { data: res } = await api.get(endpoint, { params });

        if (cancelled) return;

        setCocktails(res.data ?? []);
        setNextUrl(res.next_page_url ?? null);
        setPrevUrl(res.prev_page_url ?? null);

        const lp = res.last_page ?? res?.meta?.last_page ?? 1;
        setLastPage(Number(lp) || 1);
      } catch (err) {
        if (!cancelled) console.error("Cocktails fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, q]);

  // load favorites ids
  useEffect(() => {
    if (!isLoggedIn) return;

    api
      .get("/user/favorites", authHeaders)
      .then((res) => {
        const list = (res.data ?? []) as { id: number }[];
        setFavorites(new Set(list.map((c) => c.id)));
      })
      .catch((err) => console.error("Favorites fetch error:", err));
  }, [isLoggedIn, authHeaders]);

  const toggleFavorite = async (id: number) => {
    // optimistic UI
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await api.post(`/cocktails/${id}/favorite`, null, authHeaders);
    } catch (err) {
      console.error("Toggle favorite error:", err);
      // rollback
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const pagesToRender = useMemo(() => buildPages(page, lastPage, 2), [page, lastPage]);

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
            {cocktails
              .filter(
                (c) =>
                  c.name &&
                  c.name.toLowerCase() !== "name" &&
                  c.description?.toLowerCase() !== "description"
              )
              .map((c) => (
              <Link key={c.id} to={`/kokteli/${c.id}`} className="card-link">
                <article className="cocktail-card">
                  <div className="cocktail-media">
                    <img src={resolveCocktailImage(c.image_url)} alt={c.name} loading="lazy" />
                  </div>

                  <div className="cocktail-body">
                    <h3>
                      {c.name}

                      {isLoggedIn && (
                        <button
                          type="button"
                          className={`fav-btn ${favorites.has(c.id) ? "active" : ""}`}
                          aria-label={
                            favorites.has(c.id) ? "Ukloni iz favorita" : "Dodaj u favorite"
                          }
                          aria-pressed={favorites.has(c.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(c.id);
                          }}
                        >
                          ♥
                        </button>
                      )}
                    </h3>

                    {c.description && <p className="cocktail-desc">{c.description}</p>}
                  </div>
                </article>
              </Link>
            ))}
          </div>

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
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            >
              Sljedeća →
            </button>
          </div>
        </>
      )}
    </section>
  );
}
