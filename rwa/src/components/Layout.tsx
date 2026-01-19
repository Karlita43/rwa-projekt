import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../LoginContextProvider";

export default function Layout() {
  const { isLoggedIn, logout } = useContext(LoginContext);

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
                <Link to="/kokteli/rum">Rum</Link>
                <Link to="/kokteli/vodka">Vodka</Link>
                <Link to="/kokteli/gin">Gin</Link>
              </div>
            </div>

            <Link className="nav-link" to="/o-nama">
              O nama
            </Link>

            <div className="nav-auth">
              {isLoggedIn ? (
                <button onClick={logout} className="nav-link btn-logout">
                  Odjavi se
                </button>
              ) : (
                <>
                  <Link to="/login" className="nav-link btn-login">
                    Prijavi se
                  </Link>
                </>
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
