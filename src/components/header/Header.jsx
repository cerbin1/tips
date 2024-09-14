import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../store/auth-context";
import Logo from "./Logo";
import NavigationItem from "./NavigationItem";

export default function Header() {
  const { token } = useAuth();

  return (
    <header className="flex justify-between items-center px-4 border-b border-cyan-100">
      <Link className="logo" to="/">
        <Logo />
      </Link>
      <nav className="py-4">
        <NavigationItem href="/random">Losowa porada</NavigationItem>
        <NavigationItem href="/categories">Kategorie</NavigationItem>
        <NavigationItem href="/ranking">Ranking</NavigationItem>
        {token && <NavigationItem href="/suggest">Zaproponuj</NavigationItem>}
        {token && (
          <NavigationItem href="/suggestions">Propozycje</NavigationItem>
        )}
      </nav>
      {!token && (
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
      )}

      {token && (
        <div>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "px-2 text-blue-to-light underline"
                : "px-2 text-blue-to-light"
            }
            to="/user/profile"
          >
            Profil
          </NavLink>
          <FontAwesomeIcon icon={faUser} title="User" />

          <NavLink className="px-2" to="/user/logout">
            Wyloguj
          </NavLink>
        </div>
      )}
    </header>
  );
}
