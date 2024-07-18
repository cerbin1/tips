import { Link } from "react-router-dom";

export default function NavItem({ href, children }) {
  return (
    <Link className="no-underline px-12 text-blue-to-light" to={href}>
      {children}
    </Link>
  );
}
