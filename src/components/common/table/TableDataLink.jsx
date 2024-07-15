import { Link } from "react-router-dom";

export default function TableDataLink({ href, children }) {
  return (
    <td className="py-3 px-6 border border-slate-400">
      <Link className="text-blue-to-dark text-lg" to={href}>
        {children}
      </Link>
    </td>
  );
}
