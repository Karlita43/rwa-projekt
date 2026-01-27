// src/pages/Category.tsx
import { useEffect, useMemo, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "../featured_cocktails.css";
import api from "../api";
import { LoginContext } from "../LoginContextProvider";

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

// helper za paginaciju
function getPaginationPages(current: number, total: number) {
    const pages: (number | "...")[] = [];
    if (total <= 1) return [1];

    pages.push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("...");

    pages.push(total);

    return pages.filter((v, i) => pages.indexOf(v) === i);
}

export default function Category() {
    const { slug } = useParams();
    const { isLoggedIn } = useContext(LoginContext);

    const token = localStorage.getItem("token");
    const authHeaders = token
        ? { headers: { Authorization: "Bearer " + token } }
        : undefined;

    const categoryValue = useMemo(() => {
        const map: Record<string, string> = {
            rum: "rum",
            vodka: "votka",
            votka: "votka",
            gin: "gin",
            tekila: "tekila",
            sok: "sok",
            bezalkoholno: "bezalkoholno",
            kava: "kava",
        };
        return slug ? map[slug] ?? slug : "";
    }, [slug]);

    const categoryLabel = useMemo(() => {
        if (!slug) return "";
        return slug.charAt(0).toUpperCase() + slug.slice(1);
    }, [slug]);

    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stranicenje
    const PER_PAGE = 9;
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [categoryValue]);

    useEffect(() => {
        if (!categoryValue) return;

        setLoading(true);
        setError(null);

        fetch(
            `http://127.0.0.1:8000/api/cocktails/category/${encodeURIComponent(
                categoryValue
            )}`
        )
            .then((r) => {
                if (!r.ok) throw new Error("Greška kod dohvaćanja koktela.");
                return r.json();
            })
            .then((data) => setCocktails(Array.isArray(data) ? data : []))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [categoryValue]);

    // FAVORITI
    useEffect(() => {
        if (!isLoggedIn || !authHeaders) return;

        api
            .get("/user/favorites", authHeaders)
            .then((res) => {
                const list = res.data?.data ?? res.data ?? [];
                setFavorites(new Set(list.map((c: Cocktail) => c.id)));
            })
            .catch(() => { });
    }, [isLoggedIn]);

    async function toggleFavorite(id: number) {
        setFavorites((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

        try {
            await api.post(`/cocktails/${id}/favorite`, null, authHeaders);
        } catch {
            // rollback
            setFavorites((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
            });
        }
    }

    const lastPage = Math.max(1, Math.ceil(cocktails.length / PER_PAGE));

    const pagedCocktails = useMemo(() => {
        const start = (page - 1) * PER_PAGE;
        return cocktails.slice(start, start + PER_PAGE);
    }, [cocktails, page]);

    const pagesToRender = useMemo(
        () => getPaginationPages(page, lastPage),
        [page, lastPage]
    );

    return (
        <section className="featured" style={{ marginTop: "2rem" }}>
            <div
                className="featured-head"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                }}
            >
                <h2>
                    Kategorija:{" "}
                    <span style={{ opacity: 0.85 }}>
                        {categoryLabel || categoryValue}
                    </span>
                </h2>

                <Link className="btn" to="/kokteli">
                    ← Svi kokteli
                </Link>
            </div>

            {loading && <p>Učitavanje…</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <>
                    <div className="featured-grid">
                        {pagedCocktails.map((c) => (
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
                                        <h3>
                                            {c.name}

                                            {isLoggedIn && (
                                                <button
                                                    type="button"
                                                    className={`fav-btn ${favorites.has(c.id) ? "active" : ""
                                                        }`}
                                                    aria-label={
                                                        favorites.has(c.id)
                                                            ? "Ukloni iz favorita"
                                                            : "Dodaj u favorite"
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

                                        {c.description && (
                                            <p className="cocktail-desc">{c.description}</p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* PAGINACIJA */}
                    <div className="pagination">
                        <button
                            className="btn"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            ← Prethodna
                        </button>

                        <div className="page-numbers">
                            {pagesToRender.map((p, i) =>
                                p === "..." ? (
                                    <span key={i} className="page-dots">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        className={`page-btn ${p === page ? "is-active" : ""}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            className="btn"
                            disabled={page >= lastPage}
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
