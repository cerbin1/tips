import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <Link className="logo" to="/">
        Afterady
      </Link>

      <nav>
        <Link className="nav-item" to="/random">
          Losowa porada
        </Link>
        <Link className="nav-item" to="/categories">
          Kategorie
        </Link>
        <Link className="nav-item" to="/ranking">
          Ranking
        </Link>
        <Link className="nav-item" to="/suggest">
          Zaproponuj
        </Link>
      </nav>
      <span>Search-TODO</span>
    </header>
  );
}
