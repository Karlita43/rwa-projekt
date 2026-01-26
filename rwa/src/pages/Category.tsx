// src/pages/Category.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

// isti helper kao u Cocktails.tsx (za "…" između stranica)
function getPaginationPages(current: number, total: number) {
    const pages: (number | "...")[] = [];
    if (total <= 1) return [1];

    const push = (v: number | "...") => pages.push(v);

    push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) push("...");

    for (let i = start; i <= end; i++) push(i);

    if (end < total - 1) push("...");

    push(total);

    // ukloni duplikate (npr. total=2)
    return pages.filter((v, idx) => pages.indexOf(v) === idx);
}

export default function Category() {
    const { slug } = useParams();

    // slug -> vrijednost u bazi (bitno za č, ć, ž...)
    const categoryValue = useMemo(() => {
        const map: Record<string, string> = {
            rum: "rum",
            // bitno: u dropdownu ti je "vodka", a u bazi "votka"
            vodka: "votka",
            votka: "votka",
            gin: "gin",
            tekila: "tekila",
            liker: "liker",
            voce: "voće",
            sok: "sok",
            sirup: "sirup",
            bezalkoholno: "bezalkoholno",
            kava: "kava",
            zacin: "začin",
            mlijecno: "mliječno",
            ostalo: "ostalo",
        };

        return slug ? map[slug] ?? slug : "";
    }, [slug]);

    // za naslov (da ne piše "vodka" nego "Votka", i sl.)
    const categoryLabel = useMemo(() => {
        const labels: Record<string, string> = {
            rum: "Rum",
            vodka: "Votka",
            votka: "Votka",
            gin: "Gin",
            tekila: "Tekila",
            liker: "Liker",
            voce: "Voće",
            sok: "Sok",
            sirup: "Sirup",
            bezalkoholno: "Bezalkoholno",
            kava: "Kava",
            zacin: "Začin",
            mlijecno: "Mliječno",
            ostalo: "Ostalo",
        };

        if (!slug) return "";
        return labels[slug] ?? slug;
    }, [slug]);

    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // PAGINACIJA (front-end)
    const PER_PAGE = 9;
    const [page, setPage] = useState(1);

    useEffect(() => {
        // kad promijeniš kategoriju, vrati na prvu stranicu
        setPage(1);
    }, [categoryValue]);

    useEffect(() => {
        if (!categoryValue) return;

        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        fetch(`http://127.0.0.1:8000/api/cocktails/category/${encodeURIComponent(categoryValue)}`, {
            headers,
        })
            .then((r) => {
                if (!r.ok) throw new Error("Ne mogu dohvatiti koktele za kategoriju.");
                return r.json();
            })
            .then((data) => setCocktails(Array.isArray(data) ? data : []))
            .catch((e) => setError(e?.message ?? "Greška"))
            .finally(() => setLoading(false));
    }, [categoryValue]);

    const lastPage = Math.max(1, Math.ceil(cocktails.length / PER_PAGE));

    // ako netko dođe na page koji je veći od lastPage (npr. nakon brisanja)
    useEffect(() => {
        if (page > lastPage) setPage(lastPage);
    }, [page, lastPage]);

    const pagedCocktails = useMemo(() => {
        const start = (page - 1) * PER_PAGE;
        return cocktails.slice(start, start + PER_PAGE);
    }, [cocktails, page]);

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
                <h2 style={{ margin: 0 }}>
                    Kategorija: <span style={{ opacity: 0.85 }}>{categoryLabel || categoryValue}</span>
                </h2>

                <Link className="btn" to="/kokteli">
                    ← Svi kokteli
                </Link>
            </div>

            {loading && <p>Učitavanje…</p>}
            {error && <p style={{ opacity: 0.85 }}>{error}</p>}

            {!loading && !error && (
                <>
                    {cocktails.length === 0 ? (
                        <p style={{ opacity: 0.85 }}>Nema koktela u ovoj kategoriji.</p>
                    ) : (
                        <>
                            <div className="featured-grid">
                                {pagedCocktails.map((c) => (
                                    <Link key={c.id} to={`/kokteli/${c.id}`} className="card-link">
                                        <article className="cocktail-card">
                                            <div className="cocktail-media">
                                                <img src={resolveCocktailImage(c.image_url)} alt={c.name} loading="lazy" />
                                            </div>

                                            <div className="cocktail-body">
                                                <h3>{c.name}</h3>
                                                {c.description && <p className="cocktail-desc">{c.description}</p>}
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>

                            {/* STRANIČENJE (isti CSS kao Cocktails) */}
                            <div className="pagination">
                                <button
                                    className="btn"
                                    disabled={page <= 1}
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
                                    disabled={page >= lastPage}
                                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                                >
                                    Sljedeća →
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </section>
    );
}
