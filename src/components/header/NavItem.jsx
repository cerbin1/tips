export default function NavItem({ href, children }) {
  return (
    <a className="nav-item" href={href}>
      {children}
    </a>
  );
}
