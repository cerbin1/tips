import { Link, NavLink, useRouteLoaderData } from "react-router-dom";
import Logo from "./Logo";
import NavigationItem from "./NavigationItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const token = useRouteLoaderData("root");

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
