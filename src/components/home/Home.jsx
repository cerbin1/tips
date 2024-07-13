import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section data-testid="hero-section" className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Witamy na naszej stronie!</h1>
          <p className="hero-description">
            Odkryj najlepsze porady i wskazówki, które pomogą Ci w codziennym
            życiu.
          </p>
          <Link className="hero-button" to="/random">
            Rozpocznij
          </Link>
        </div>
      </section>
    </>
  );
}
