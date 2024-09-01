export default function TableHeader({ headerNames }) {
  return (
    <thead className="cursor-default">
      <tr>
        {headerNames.map((header) => (
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
