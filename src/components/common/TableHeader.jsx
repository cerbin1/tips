export default function TableHeader({ headers }) {
  return (
    <thead className="cursor-default">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="py-3 px-6 border border-slate-300 bg-slate-400"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
