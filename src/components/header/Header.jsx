import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/">Afterady</Link>
      </div>

      <nav>
        <Link className="nav-item" to="/categories">
          Kategorie
        </Link>
        <Link className="nav-item" to="/ranking">
          Ranking
        </Link>
        <a href="#" className="nav-item">
          Zaproponuj
        </a>
      </nav>
      <span>Search</span>
    </header>
  );
}
