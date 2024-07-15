export default function TableRow({ rowKey, children }) {
  return (
    <tr key={rowKey} className="hover:bg-slate-200 even:bg-slate-100">
      {children}
    </tr>
  );
}
