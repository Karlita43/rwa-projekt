import { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { LoginContext } from "../LoginContextProvider";
import "../featured_cocktails.css";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

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
        // 1) user profil
        const profileRes = await api.get("user/profile", authHeaders);

        // 2) userovi kokteli
        // ⚠️ Ako ti se endpoint zove drugačije, promijeni samo ovu liniju:
        // npr. "/user/cocktails" ili "/my-cocktails" ili "/cocktails/mine"
        const cocktailsRes = await api.get("user/cocktails", authHeaders);

        // podrška za: {data:[...]} ili samo [...]
        const list = (cocktailsRes.data?.data ?? cocktailsRes.data ?? []) as Cocktail[];

        if (!cancelled) {
          setUserData(profileRes.data as UserData);
          setCocktails(list);
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
      await api.delete("/cocktails/" + id, {headers: { Authorization: "Bearer " + localStorage.getItem("token") }});;
      setCocktails((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Greška pri brisanju koktela.");
    }
  }

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
          <h2>Vaši kokteli</h2>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            Pozdrav {userData?.username ? <b>{userData.username}</b> : ""}!
          </p>
        </div>

        <Link
          to="/kokteli/novo"
          style={{
            padding: ".6rem .9rem",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,.12)",
            textDecoration: "none",
            height: "fit-content",
          }}
        >
          + Dodaj novi
        </Link>
      </div>

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
                    src={c.image_url ? c.image_url : cocktailImageSrc(c.name)}
                    alt={c.name}
                    loading="lazy"
                  />
                </div>

                <div className="cocktail-body">
                  <h3>{c.name}</h3>
                  {c.description && <p className="cocktail-desc">{c.description}</p>}
                </div>
              </Link>

              <div style={{ display: "flex", gap: 10, padding: "0 14px 14px" }}>
                <Link to={`/kokteli/${c.id}/uredi`} style={{ textDecoration: "none" }}>
                  Uredi
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  style={{ marginLeft: "auto" }}
                >
                  Obriši
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
