import { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { LoginContext } from "../LoginContextProvider";
import "../featured_cocktails.css";
import "../user_page.css";

type UserData = {
  username: string;
  email: string;
};

type Cocktail = {
  id: number;
  name: string;
  description?: string;
  image_url?: string | null;
};

function cocktailImageSrc(name: string) {
  const fileName = name.toLowerCase().trim().replace(/\s+/g, "_");
  return `/koktel_slike/${fileName}.jpg`;
}

function resolveCocktailImage(image_url?: string | null, name?: string) {
  if (image_url && /^https?:\/\//i.test(image_url)) return image_url;
  if (image_url) return `/koktel_slike/${image_url}`;
  return name ? cocktailImageSrc(name) : "/koktel_slike/placeholder.jpg";
}

export default function User_page() {
  const { isLoggedIn } = useContext(LoginContext);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: "Bearer " + token },
    }),
    [token]
  );

  const [userData, setUserData] = useState<UserData | null>(null);

  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [favoriteCocktails, setFavoriteCocktails] = useState<Cocktail[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // ✅ DOTS PAGINATION (favoriti)
  const FAVS_PER_PAGE = 3;
  const [favPage, setFavPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const profileRes = await api.get("/user/profile", authHeaders);
        const cocktailsRes = await api.get("/user/cocktails", authHeaders);
        const favoritesRes = await api.get("/user/favorites", authHeaders);

        const myList = (cocktailsRes.data?.data ?? cocktailsRes.data ?? []) as Cocktail[];
        const favList = (favoritesRes.data?.data ?? favoritesRes.data ?? []) as Cocktail[];

        if (!cancelled) {
          setUserData(profileRes.data as UserData);
          setCocktails(myList);

          setFavoriteCocktails(favList);
          setFavoriteIds(new Set(favList.map((c) => c.id)));

          // kad se učita lista favorita, kreni od prve stranice
          setFavPage(1);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.response?.data?.message || "Ne mogu dohvatiti vaše podatke/koktele.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, authHeaders]);

  async function handleDelete(id: number) {
    if (!window.confirm("Jeste li sigurni da želite izbrisati koktel?")) return;

    try {
      await api.delete("/cocktails/" + id, authHeaders);
      setCocktails((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Greška pri brisanju koktela.");
    }
  }

  async function toggleFavorite(id: number) {
    // optimistički: makni/dodaj u set
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    // optimistički: ako je bio favorit, makni iz liste na profilu
    setFavoriteCocktails((prev) => {
      const exists = prev.some((c) => c.id === id);
      if (exists) return prev.filter((c) => c.id !== id);
      return prev;
    });

    try {
      await api.post(`/cocktails/${id}/favorite`, null, authHeaders);
    } catch (err) {
      console.error("Toggle favorite error:", err);

      // rollback: vrati set
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

      // rollback listu: re-fetch favorites
      try {
        const favoritesRes = await api.get("/user/favorites", authHeaders);
        const favList = (favoritesRes.data?.data ?? favoritesRes.data ?? []) as Cocktail[];
        setFavoriteCocktails(favList);
        setFavoriteIds(new Set(favList.map((c) => c.id)));
      } catch { }
    }
  }

  // ✅ favorites paging
  const favLastPage = Math.max(1, Math.ceil(favoriteCocktails.length / FAVS_PER_PAGE));
  const favPageItems = favoriteCocktails.slice(
    (favPage - 1) * FAVS_PER_PAGE,
    favPage * FAVS_PER_PAGE
  );

  // ✅ ako obrišeš favorit pa ostaneš na praznoj stranici -> vrati na zadnju valjanu
  useEffect(() => {
    if (favPage > favLastPage) setFavPage(favLastPage);
  }, [favPage, favLastPage]);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

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
        <div>
          <h2 className="user-title">
            Pozdrav, <span className="user-name">{userData?.username}</span> 👋
          </h2>
          <p className="user-subtitle">Vaši kokteli</p>
        </div>

        <Link to="/kokteli/novo" className="btn">
          🍸 Dodaj koktel
        </Link>
      </div>

      {/* Vaši kokteli */}
      {cocktails.length === 0 ? (
        <div className="page">
          <p>Još nemate dodanih koktela.</p>
        </div>
      ) : (
        <div className="featured-grid">
          {cocktails.map((c) => (
            <article key={c.id} className="cocktail-card">
              <Link to={`/kokteli/${c.id}`} className="card-link">
                <div className="cocktail-media">
                  <img
                    src={resolveCocktailImage(c.image_url, c.name)}
                    alt={c.name}
                    loading="lazy"
                  />
                </div>

                <div className="cocktail-body">
                  <h3>{c.name}</h3>
                  {c.description && <p className="cocktail-desc">{c.description}</p>}
                </div>
              </Link>

              <div className="card-actions">
                <Link to={`/kokteli/${c.id}/uredi`} className="btn-secondary">
                  Uredi
                </Link>

                <button type="button" onClick={() => handleDelete(c.id)} className="btn-danger">
                  Obriši
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Favoriti */}
      <div style={{ marginTop: "2.5rem" }}>
        <div className="featured-head">
          <h2>Favoriti</h2>
        </div>

        {favoriteCocktails.length === 0 ? (
          <p>Još nemaš favorite. Klikni ♥ na koktelima.</p>
        ) : (
          <>
            <div className="featured-grid">
              {favPageItems.map((c) => (
                <Link key={c.id} to={`/kokteli/${c.id}`} className="card-link">
                  <article className="cocktail-card">
                    <div className="cocktail-media">
                      <img
                        src={resolveCocktailImage(c.image_url, c.name)}
                        alt={c.name}
                        loading="lazy"
                      />
                    </div>

                    <div className="cocktail-body">
                      <h3>
                        {c.name}

                        <button
                          type="button"
                          className={`fav-btn ${favoriteIds.has(c.id) ? "active" : ""}`}
                          aria-label="Ukloni iz favorita"
                          aria-pressed={favoriteIds.has(c.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(c.id);
                          }}
                        >
                          ♥
                        </button>
                      </h3>

                      {c.description && <p className="cocktail-desc">{c.description}</p>}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* ✅ DOTS + kružno listanje */}
            {favLastPage > 1 && (
              <div className="pagination">
                <button
                  className="btn"
                  onClick={() => setFavPage((p) => (p === 1 ? favLastPage : p - 1))}
                  aria-label="Prethodna stranica favorita"
                >
                  ‹
                </button>

                {/* koristimo postojeći .cats-dots + .dot iz featured_cocktails.css */}
                <div className="cats-dots" aria-label="Stranice favorita">
                  {Array.from({ length: favLastPage }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        className={`dot ${page === favPage ? "active" : ""}`}
                        onClick={() => setFavPage(page)}
                        aria-label={`Stranica ${page}`}
                        aria-current={page === favPage ? "page" : undefined}
                      />
                    );
                  })}
                </div>

                <button
                  className="btn"
                  onClick={() => setFavPage((p) => (p === favLastPage ? 1 : p + 1))}
                  aria-label="Sljedeća stranica favorita"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
