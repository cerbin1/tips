import { NavLink } from "react-router-dom";

export default function NavItem({ href, children }) {
  const classes = "px-12 text-blue-to-light";

  return (
    <NavLink
      className={({ isActive }) =>
        isActive ? classes + " underline" : classes + " no-underline"
      }
      to={href}
    >
      {children}
    </NavLink>
  );
}
