import "../featured_cocktails.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";



type Ingredient = {
    name: string;
    quantity?: number;
    unit?: string;
};

type Cocktail = {
    id: number;
    name: string;
    description?: string;
    image_url: string;
    ingredients: Ingredient[];
};

export default function Home() {
    const [featured, setFeatured] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/featured-cocktails")
            .then((r) => r.json())
            .then((data) => setFeatured(data))
            .catch((err) => console.error("Featured cocktails error:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
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
                            <Link
                                key={c.id}
                                to={`/kokteli/${c.id}`}
                                className="card-link"
                            >
                                <article className="cocktail-card">
                                    <div className="cocktail-media">
                                        <img src={c.image_url} alt={c.name} loading="lazy" />
                                    </div>

                                    <div className="cocktail-body">
                                        <h3>{c.name}</h3>
                                        {c.description && <p className="cocktail-desc">{c.description}</p>}
                                    </div>
                                </article>
                            </Link>

                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
