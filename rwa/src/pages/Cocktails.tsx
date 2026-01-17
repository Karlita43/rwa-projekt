import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../featured_cocktails.css";

type Cocktail = {
    id: number;
    name: string;
    description?: string;
    image_url: string;
};

export default function Cocktails() {
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/cocktails")
            .then((r) => r.json())
            .then((data) => setCocktails(data))
            .catch((err) => console.error("Cocktails index error:", err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return cocktails;
        return cocktails.filter(
            (c) =>
                c.name.toLowerCase().includes(s) ||
                (c.description ?? "").toLowerCase().includes(s)
        );
    }, [cocktails, q]);

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
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Pretraži koktele..."
                    style={{
                        padding: ".6rem .8rem",
                        borderRadius: 12,
                        border: "1px solid rgba(0,0,0,.12)",
                        width: 280,
                        maxWidth: "100max-width: 100%",
                    }}
                />
            </div>

            {loading && <p>Učitavanje...</p>}

            {!loading && (
                <div className="featured-grid">
                    {filtered.map((c) => (
                        <Link key={c.id} to={`/kokteli/${c.id}`} className="card-link">
                            <article className="cocktail-card">
                                <div className="cocktail-media">
                                    <img src={c.image_url} alt={c.name} loading="lazy" />
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
            )}
        </section>
    );
}
