import { Outlet, Link } from "react-router-dom";



export default function Layout() {
    return (
        <>
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

                        <Link className="nav-link" to="/o-nama">O nama</Link>
                        <Link className="nav-link" to="/login">Log In</Link>
                    </nav>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    );
}
