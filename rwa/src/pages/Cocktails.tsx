import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../featured_cocktails.css";
import api from "../api";

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

export default function Cocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params = { page, ...(q.trim() ? { q: q.trim() } : {}) };

        // Ako backend ima /cocktails i /cocktails/search:
        const endpoint = q.trim() ? "/cocktails/search" : "/cocktails";

        const { data: res } = await api.get(endpoint, { params });

        if (cancelled) return;

        setCocktails(res.data ?? []);
        setNextUrl(res.next_page_url ?? null);
        setPrevUrl(res.prev_page_url ?? null);
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
                    {c.description && (
                      <p className="cocktail-desc">{c.description}</p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 20,
            }}
          >
            <button
              disabled={!prevUrl || page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <button disabled={!nextUrl} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
