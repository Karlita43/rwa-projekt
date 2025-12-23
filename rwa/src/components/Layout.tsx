import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

import Login from "../pages/Login";
import Register from "../pages/Register";

type ModalType = "login" | "register" | null;

export default function Layout() {
    const [modal, setModal] = useState<ModalType>(null);
    const isModalOpen = modal !== null;

    return (
        <>
            {/* ===== STRANICA (blur kada je modal otvoren) ===== */}
            <div className={isModalOpen ? "page blur" : "page"}>
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

                            {/* LOGIN OTVARA MODAL */}
                            <button
                                type="button"
                                className="nav-link login-btn"
                                onClick={() => setModal("login")}
                            >
                                Log In
                            </button>
                        </nav>
                    </div>
                </header>

                <main>
                    <Outlet />
                </main>
            </div>

            {/* ===== LOGIN MODAL ===== */}
            {modal === "login" && (
                <Login
                    onClose={() => setModal(null)}
                    onSwitchToRegister={() => setModal("register")}
                />
            )}

            {/* ===== REGISTER MODAL ===== */}
            {modal === "register" && (
                <Register
                    onClose={() => setModal(null)}
                    onSwitchToLogin={() => setModal("login")}
                />
            )}
        </>
    );
}
