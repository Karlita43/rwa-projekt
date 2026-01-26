import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../LoginContextProvider";
import api from "../api";

export default function Layout() {
  const { isLoggedIn, logout } = useContext(LoginContext);

  const categories = [
    { label: "Rum", slug: "rum" },
    { label: "Votka", slug: "votka" },
    { label: "Gin", slug: "gin" },
    { label: "Tequila", slug: "tekila" },
    { label: "Sok", slug: "sok" },
    { label: "Kava", slug: "kava" },
    { label: "Bezalkoholni", slug: "bezalkoholno" },
  ];

  function handleLogout() {
    api
      .post(
        "/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .finally(() => logout());
  }

  return (
    <div className="page">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark">🍸</span>
            <span className="brand-name">Riteh Kokteli</span>
          </Link>

          <nav className="nav">
            <div className="dropdown">
              <Link className="dropdown-btn" to="/kokteli">
                Kokteli <span className="chev">▾</span>
              </Link>

              <div className="dropdown-menu">
                {categories.map((cat) => (
                  <Link key={cat.slug} to={`/kategorija/${cat.slug}`}>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link className="nav-link" to="/o-nama">
              O nama
            </Link>

            <div className="nav-auth">
              {isLoggedIn ? (
                <>
                  <Link to="/profil" className="nav-link">
                    Moj profil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="nav-link btn-logout"
                    type="button"
                  >
                    Odjavi se
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-link btn-login">
                  Prijavi se
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2026 Riteh Kokteli. Sva prava pridržana.</p>
      </footer>
    </div>
  );
}
