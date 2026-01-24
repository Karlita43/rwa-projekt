import "../about.css";

export default function About() {
    return (
        <section className="about-page">
            {/* TEKST (čitljiv) */}
            <div className="about-text-block">
                <h2 className="about-title">O projektu</h2>
                <p>
                    <strong>RiTeh Kokteli</strong> je studentski projekt razvijen u sklopu kolegija razvoj web
                    aplikacija.
                </p>

                <p>
                    Projekt su razvila dva studenta s ciljem primjene znanja usvojenog na kolegiju.
                </p>

                <p>
                    Aplikacija omogućuje pregled koktela.
                    Također možete i dodati vaš koktel i proširiti našu ponudu koktela, ali za to se morate prijaviti na našu stranicu.
                </p>

                <p>
                    Projekt edukativnog karaktera, cilj je bio izraditi funkcionalnu i vizualno ugodnu
                    web aplikaciju.
                </p>

                

            </div>

            {/* SLIKA ISPOD (kako ti je “fora”) */}
            <div className="about-image-wrap">
                <img
                    className="about-image"
                    src="/koktel_slike/about_pixel.png"
                    alt="RiTeh tim u cocktail baru"
                />
                <p className="about-caption">
                    Karla i Antonio, ljubitelji koktela koji bi svoje znanje htjeli podijeliti sa svijetom!
                </p>
            </div>
        </section>
    );
}
