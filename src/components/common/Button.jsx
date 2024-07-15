export default function Button({ children, ...props }) {
  return (
    <button
      className="px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
      {...props}
    >
      {children}
    </button>
  );
}
