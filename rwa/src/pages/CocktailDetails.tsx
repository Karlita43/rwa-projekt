import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../cocktail_details.css";
import api from "../api";

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
  image_url?: string | null;
  ingredients: Ingredient[];
};

function resolveCocktailImage(image_url: string | undefined | null) {
  if (!image_url) return "/koktel_slike/placeholder.jpg";
  if (/^https?:\/\//i.test(image_url)) return image_url;
  return `/koktel_slike/${image_url.replace(/^\/+/, "")}`;
}

export default function CocktailDetails() {
  const { id } = useParams();
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setCocktail(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    api
      .get<Cocktail>(`/cocktails/${id}`, { signal: controller.signal })
      .then((res) => setCocktail(res.data))
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
          console.error("Cocktail details error:", err);
        }
        setCocktail(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  return (
    <section className="cocktail-details">
      {loading && <p>Učitavanje...</p>}

      {!loading && cocktail === null && (
        <>
            <h1 className="cocktail-title">Koktel nije pronađen</h1>
            <div className="cocktail-actions">
            <Link to="/kokteli" className="btn">
                ← Svi kokteli
            </Link>
            </div>
        </>
        )}

      {!loading && cocktail && (
        <div className="cocktail-layout">
          <header className="cocktail-header">
            <div className="cocktail-header-box">
              <h1 className="cocktail-title">{cocktail.name}</h1>
              {cocktail.description && (
                <p className="cocktail-description">{cocktail.description}</p>
              )}
            </div>
          </header>

          <div className="cocktail-left">
            <div className="cocktail-image-wrap">
              <img
                className="cocktail-image"
                src={resolveCocktailImage(cocktail.image_url)}
                alt={cocktail.name}
                loading="lazy"
              />
            </div>
          </div>

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
              <Link to="/kokteli" className="btn">
                ← Svi kokteli
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
