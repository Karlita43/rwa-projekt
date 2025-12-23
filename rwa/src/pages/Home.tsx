import { Link } from "react-router-dom";

export default function Home() {
    return (
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
    );
}
