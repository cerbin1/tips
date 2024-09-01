export default function SecondaryButton({ children, ...props }) {
  return (
    <button
      className="px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
      {...props}
    >
      {children}
    </button>
  );
}
