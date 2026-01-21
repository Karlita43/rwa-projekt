import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../cocktail_details.css";

type Ingredient = {
    id?: number;
    name: string;
    pivot?: {
        quantity?: number;
        unit?: string;
    };
};

type Cocktail = {
    id: number;
    name: string;
    description?: string;
    instructions?: string;
    image_url?: string;
    ingredients: Ingredient[];
};


function cocktailImageSrc(name: string) {
  const fileName = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  return `/koktel_slike/${fileName}.jpg`;
}

export default function CocktailDetails() {
    const { id } = useParams();
    const [cocktail, setCocktail] = useState<Cocktail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/cocktails/${id}`)
            .then((r) => {
                if (!r.ok) throw new Error("Cocktail not found");
                return r.json();
            })
            .then((data) => setCocktail(data))
            .catch((err) => {
                console.error("Cocktail details error:", err);
                setCocktail(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <section className="cocktail-details">
                <p>Učitavanje...</p>
            </section>
        );
    }

    if (!cocktail) {
        return (
            <section className="cocktail-details">
                <h1 className="cocktail-title">Koktel nije pronađen</h1>
                <div className="cocktail-actions">
                    <Link to="/kokteli" className="btn">← Svi kokteli</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cocktail-details">
            <div className="cocktail-layout">

                {/* HEADER (preko oba stupca) */}
                <header className="cocktail-header">
                    <h1 className="cocktail-title">{cocktail.name}</h1>
                    {cocktail.description && (
                        <p className="cocktail-description">{cocktail.description}</p>
                    )}
                </header>

                {/* LEFT: IMAGE sticky */}
                <div className="cocktail-left">
                        <div className="cocktail-image-wrap">
                            <img className="cocktail-image" src={cocktailImageSrc(cocktail.name)} alt={cocktail.name} loading="lazy" />
                        </div>
                </div>

                {/* RIGHT: INGREDIENTS + INSTRUCTIONS */}
                <div className="cocktail-right">
                    <div className="cocktail-sections">
                        <section className="cocktail-card">
                            <h2>Sastojci</h2>

                            {cocktail.ingredients?.length ? (
                                <ul className="cocktail-ingredients">
                                    {cocktail.ingredients.map((i, idx) => {
                                        const q = i.pivot?.quantity;
                                        const u = i.pivot?.unit;
                                        const qty = q ? `${q}${u ? ` ${u}` : ""}` : "";
                                        return (
                                            <li key={i.id ?? idx}>
                                                <span className="cocktail-ing-name">{i.name}</span>
                                                {qty && <span className="cocktail-ing-qty">{qty}</span>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="cocktail-muted">Nema sastojaka.</p>
                            )}
                        </section>

                        <section className="cocktail-card">
                            <h2>Instrukcije</h2>

                            {cocktail.instructions ? (
                                <p className="cocktail-instructions">{cocktail.instructions}</p>
                            ) : (
                                <p className="cocktail-muted">Nema instrukcija.</p>
                            )}
                        </section>
                    </div>

                    <div className="cocktail-actions">
                        {/* vucem btn style iz style.css */}
                        <Link to="/kokteli" className="btn">← Svi kokteli</Link> 
                    </div>
                </div>
            </div>
        </section>
    );
}