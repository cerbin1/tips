export default function NavItem({ href, children }) {
  return (
    <a className="no-underline px-12 text-blue-to-light" href={href}>
      {children}
    </a>
  );
}
