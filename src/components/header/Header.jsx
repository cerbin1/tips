import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import NavigationItem from "./NavigationItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 border-b border-cyan-100">
      <Link className="logo" to="/">
        <Logo />
      </Link>
      <nav className="py-4">
        <NavigationItem href="/random">Losowa porada</NavigationItem>
        <NavigationItem href="/categories">Kategorie</NavigationItem>
        <NavigationItem href="/ranking">Ranking</NavigationItem>
        <NavigationItem href="/suggest">Zaproponuj</NavigationItem>
      </nav>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "px-2 text-blue-to-light underline"
              : "px-2 text-blue-to-light"
          }
          to="/user/login"
        >
          Login
        </NavLink>
        <FontAwesomeIcon icon={faUser} title="User" />
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "px-2 text-blue-to-light underline"
              : "px-2 text-blue-to-light"
          }
          to="/user/register"
        >
          Rejestracja
        </NavLink>
      </div>
    </header>
  );
}
