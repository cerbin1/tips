import { Link } from "react-router-dom";

export default function SecondaryLinkButton({ path, label }) {
  return (
    <Link
      to={path}
      className="px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
    >
      {label}
    </Link>
  );
}
