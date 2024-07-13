import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/">Afterady</Link>
      </div>

      <nav>
        <a href="#" className="nav-item">
          Kategorie
        </a>
        <a href="#" className="nav-item">
          Ranking
        </a>
        <a href="#" className="nav-item">
          Zaproponuj
        </a>
      </nav>
      <span>Search</span>
    </header>
  );
}
