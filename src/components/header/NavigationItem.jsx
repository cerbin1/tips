import { NavLink } from "react-router-dom";

export default function NavigationItem({ href, children }) {
  const classes = "px-8 text-blue-to-light";

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
