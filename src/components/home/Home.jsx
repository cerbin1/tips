import { Link } from "react-router-dom";
import Button from "../common/Button";

export default function Home() {
  return (
    <>
      <section
        data-testid="hero-section"
        className="flex justify-center text-center"
      >
        <div className="px-8 py-12 bg-slate-100 rounded-lg">
          <h1>Witamy na naszej stronie!</h1>
          <p className="text-2xl mb-8">
            Odkryj najlepsze porady i wskazówki, które pomogą Ci w codziennym
            życiu.
          </p>
          <Button>
            <Link to="/random">Rozpocznij</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
