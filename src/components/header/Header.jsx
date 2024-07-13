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
          <Link to="/ranking">Ranking</Link>
        </a>
        <a href="#" className="nav-item">
          Zaproponuj
        </a>
      </nav>
      <span>Search</span>
    </header>
  );
}
