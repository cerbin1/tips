import { Link } from "react-router-dom";
import Logo from "./Logo";
import NavItem from "./NavItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 border-b border-cyan-100">
      <Link className="logo" to="/">
        <Logo />
      </Link>

      <nav className="py-4">
        <NavItem href="/random">Losowa porada</NavItem>
        <NavItem href="/categories">Kategorie</NavItem>
        <NavItem href="/ranking">Ranking</NavItem>
        <NavItem href="/suggest">Zaproponuj</NavItem>
      </nav>

      <div>
        <FontAwesomeIcon icon={faUser} title="User" className="pr-2" />
        Zaloguj | Zarejestruj się
      </div>
    </header>
  );
}
