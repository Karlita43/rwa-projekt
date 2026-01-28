import "../featured_cocktails.css";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api";

function cocktailImageSrc(name: string) {
    const fileName = name.toLowerCase().trim().replace(/\s+/g, "_");
    return `/koktel_slike/${fileName}.jpg`;
}

type Cocktail = {
    id: number;
    name: string;
    description?: string;
    image_url: string;
};

export default function Home() {
    const [featured, setFeatured] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);

    // carousel state
    const [activeCat, setActiveCat] = useState(0);

    const categories = useMemo(
        () => [
            { label: "Kokteli s rumom", slug: "rum" },
            { label: "Kokteli s votkom", slug: "votka" },
            { label: "Kokteli s ginom", slug: "gin" },
            { label: "Kokteli s tekilom", slug: "tekila" },
            { label: "Kokteli sa sokom", slug: "sok" },
            { label: "Kokteli s kavom", slug: "kava" },
            { label: "Bezalkoholni", slug: "bezalkoholno" },
        ],
        []
    );

    const catImages: Record<string, string> = {
        rum: "/koktel_slike/rum.jpg",
        votka: "/koktel_slike/votka.jpg",
        gin: "/koktel_slike/gin.jpg",
        tekila: "/koktel_slike/tekila.jpg",
        sok: "/koktel_slike/sok.jpg",
        kava: "/koktel_slike/kava.jpg",
        bezalkoholno: "/koktel_slike/bezalkoholno.jpg",
    };

    // auth
    const token = useMemo(() => localStorage.getItem("token"), []);
    const isLoggedIn = Boolean(token);

    const authHeaders = useMemo(
        () => ({
            headers: { Authorization: "Bearer " + token },
        }),
        [token]
    );

    // favorites IDs (iz backenda)
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    // featured
    useEffect(() => {
        api
            .get("/featured-cocktails")
            .then((res) => setFeatured(res.data))
            .catch((err) => console.error("Featured cocktails error:", err))
            .finally(() => setLoading(false));
    }, []);

    // učitaj favorite (samo ako logiran)
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

    // toggle preko backenda
    const toggleFavorite = async (id: number) => {
        // optimistički UI
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
            // rollback ako faila
            setFavorites((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        }
    };

    function prevCat() {
        setActiveCat((i) => (i - 1 + categories.length) % categories.length);
    }

    function nextCat() {
        setActiveCat((i) => (i + 1) % categories.length);
    }

    function getOffset(i: number) {
        const n = categories.length;
        let d = i - activeCat;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        return d;
    }

    return (
        <>
            {/* HERO (NE DIRAMO) */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-left">
                        <h1>Otkrij koktel po svom ukusu</h1>

                        <p>
                            Otkrij recepte, sastojke i stilove koktela prilagođene tvom ukusu.
                            Pretraži i otkrij koktele prema onome što voliš piti.
                        </p>

                        <Link className="btn" to="/kokteli">
                            Kokteli <span aria-hidden="true">↗</span>
                        </Link>
                    </div>

                    <div className="hero-right">
                        <div className="hero-media">
                            <img
                                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1400&q=80"
                                alt="Kokteli"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED */}
            <section className="featured">
                <div className="featured-head">
                    <h2>Izdvojeni kokteli</h2>
                </div>

                {loading && <p>Učitavanje...</p>}

                {!loading && (
                    <div className="featured-grid">
                        {featured.map((c) => (
                            <Link key={c.id} to={`/kokteli/${c.id}`} className="card-link">
                                <article className="cocktail-card">
                                    <div className="cocktail-media">
                                        <img src={cocktailImageSrc(c.name)} alt={c.name} loading="lazy" />
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
                )}
            </section>

            {/* KATEGORIJE (NE DIRAMO) */}
            <section className="home-cats">
                <div className="home-cats-head">
                    <h2>Pregled po kategorijama</h2>
                </div>

                <div className="cats-stage" aria-label="Kategorije koktela">
                    {categories.map((cat, i) => {
                        const offset = getOffset(i);
                        const abs = Math.abs(offset);
                        const hidden = abs > 1;

                        const style = {
                            ["--offset" as any]: offset,
                            ["--z" as any]: offset === 0 ? 3 : 2,
                            ["--scale" as any]: offset === 0 ? 1 : 0.92,
                            ["--opacity" as any]: offset === 0 ? 1 : 0.55,
                        } as React.CSSProperties;

                        return (
                            <Link
                                key={cat.slug}
                                to={`/kategorija/${cat.slug}`}
                                className={`cat-card ${offset === 0 ? "is-active" : ""} ${hidden ? "is-hidden" : ""
                                    }`}
                                style={style}
                                aria-hidden={hidden}
                                tabIndex={hidden ? -1 : 0}
                            >
                                <article className="cat-card-inner">
                                    <div className="cat-media">
                                        <img src={catImages[cat.slug]} alt={cat.label} loading="lazy" />
                                    </div>

                                    <div className="cat-body">
                                        <div className="cat-name">{cat.label}</div>
                                        <div className="cat-link">Idi na koktele →</div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>

                <div className="cats-dots" aria-hidden="true">
                    {categories.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`dot ${i === activeCat ? "active" : ""}`}
                            onClick={() => setActiveCat(i)}
                            aria-label={`Kategorija ${i + 1}`}
                        />
                    ))}
                </div>

                <div className="home-cats-controls">
                    <button type="button" className="cat-arrow" onClick={prevCat} aria-label="Prethodna kategorija">
                        ‹
                    </button>

                    <button type="button" className="cat-arrow" onClick={nextCat} aria-label="Sljedeća kategorija">
                        ›
                    </button>
                </div>
            </section>
        </>
    );
}
