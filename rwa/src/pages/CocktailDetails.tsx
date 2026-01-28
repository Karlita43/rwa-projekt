import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../cocktail_details.css";
import api from "../api";

type TidalTrack = {
  id: string | number;
  title: string | null;
  artist: string | null;
  cover: string | null;
  url: string | null;
};

type TidalTrackResponse = {
  connected: boolean;
  needs_reconnect?: boolean; // ✅ DODANO (minimalno)
  query?: string;
  track: TidalTrack | null;
  message?: string;
};

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
  const [tidal, setTidal] = useState<TidalTrackResponse | null>(null);
  const [tidalLoading, setTidalLoading] = useState(false);
  

  const hasAppToken = !!localStorage.getItem("token");

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
          console.error("Cocktail error status:", err?.response?.status);
          console.error("Cocktail error data:", err?.response?.data);
        }
        setTidal(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
  if (!id) return;

  const token = localStorage.getItem("token");
  if (!token) {
    setTidal(null);
    setTidalLoading(false);
    return;
  }

  let alive = true;
  setTidalLoading(true);

  api
    .get<TidalTrackResponse>(`/cocktails/${id}/tidal-track`)
    .then((res) => {
      if (alive) setTidal(res.data);
    })
    .catch((err) => {
      if (!alive) return;

      console.log("TIDAL error message:", err?.message);
      console.log("TIDAL error code:", err?.code);
      console.log("TIDAL status:", err?.response?.status);
      console.log("TIDAL data:", err?.response?.data);
      setTidal(null);
    })
    .finally(() => {
      if (alive) setTidalLoading(false);
    });

  return () => {
    alive = false;
  };
}, [id]);



  // ✅ “Nema preporuke…” samo ako je stvarno connected === true
  const showNoRecommendation =
    !tidalLoading &&
    !!tidal &&
    tidal.connected === true &&
    !tidal.needs_reconnect &&
    !tidal.track;

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
            <div className="cocktail-header-box cocktail-header-row">
              <div className="cocktail-header-main">
                <h1 className="cocktail-title">{cocktail.name}</h1>
                {cocktail.description && (
                  <p className="cocktail-description">{cocktail.description}</p>
                )}
              </div>

              <aside className="tidal-mini">
                {tidalLoading && <div className="tidal-mini-muted">Tražim pjesmu…</div>}

                {!tidalLoading && tidal?.track && (
                  <a
                    className="tidal-mini-link"
                    href={tidal.track.url ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    title="Otvori u TIDAL-u"
                  >
                    {tidal.track.cover && (
                      <img
                        className="tidal-mini-cover"
                        src={tidal.track.cover}
                        alt=""
                        loading="lazy"
                      />
                    )}

                    <div className="tidal-mini-text">
                      <div className="tidal-mini-kicker">Preporuka (TIDAL)</div>
                      <div className="tidal-mini-title">{tidal.track.title ?? "Nepoznato"}</div>
                      <div className="tidal-mini-artist">{tidal.track.artist ?? ""}</div>
                    </div>
                  </a>
                )}

                {!tidalLoading && !tidal?.track && (
                  <div className="tidal-mini-muted">
                    {tidal?.needs_reconnect ? (
                      <a
                        className="tidal-mini-link"
                        href={`http://localhost:8000/auth/tidal/redirect?token=${encodeURIComponent(
                          localStorage.getItem("token") ?? ""
                        )}`}
                      >
                        Spoji TIDAL ponovno.
                      </a>

                    ) : tidal?.connected === false ? (
                      // ✅ nije spojen na TIDAL
                      "Spoji TIDAL za preporuke."
                    ) : showNoRecommendation ? (
                      // ✅ samo ako je connected === true
                      "Nema preporuke za ovaj naziv."
                    ) : (
                      // ✅ fallback (npr. tidal je null ili user nije ulogiran)
                      hasAppToken ? "Spoji TIDAL za preporuke." : ""
                    )}
                  </div>
                )}
              </aside>
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
