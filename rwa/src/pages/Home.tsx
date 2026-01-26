import "../featured_cocktails.css";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

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

    // fiksne slike za kategorije (stavi ih u /public/koktel_slike/)
    const catImages: Record<string, string> = {
        rum: "/koktel_slike/rum.jpg",
        votka: "/koktel_slike/votka.jpg",
        gin: "/koktel_slike/gin.jpg",
        tekila: "/koktel_slike/tekila.jpg",
        sok: "/koktel_slike/sok.jpg",
        kava: "/koktel_slike/kava.jpg",
        bezalkoholno: "/koktel_slike/bezalkoholno.jpg",
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/featured-cocktails")
            .then((r) => r.json())
            .then((data) => setFeatured(data))
            .catch((err) => console.error("Featured cocktails error:", err))
            .finally(() => setLoading(false));
    }, []);

    function prevCat() {
        setActiveCat((i) => (i - 1 + categories.length) % categories.length);
    }

    function nextCat() {
        setActiveCat((i) => (i + 1) % categories.length);
    }

    // offset u rasponu [-N/2..N/2] da rubovi rade normalno
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

            {/* FEATURED (NE DIRAMO) */}
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
                                        <img
                                            src={cocktailImageSrc(c.name)}
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
                )}
            </section>

            {/* KATEGORIJE (featured-stil + stacked carousel) */}
            {/* ===== PREGLED PO KATEGORIJAMA ===== */}
            <section className="home-cats">
                <div className="home-cats-head">
                    <h2>Pregled po kategorijama</h2>
                </div>

                <div className="cats-stage" aria-label="Kategorije koktela">
                    {categories.map((cat, i) => {
                        const offset = getOffset(i); // -2, -1, 0, 1, 2...
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
                                        <img
                                            src={catImages[cat.slug]}
                                            alt={cat.label}
                                            loading="lazy"
                                        />

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
                    <button
                        type="button"
                        className="cat-arrow"
                        onClick={prevCat}
                        aria-label="Prethodna kategorija"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        className="cat-arrow"
                        onClick={nextCat}
                        aria-label="Sljedeća kategorija"
                    >
                        ›
                    </button>
                </div>
            </section>
        </>
    );
}
