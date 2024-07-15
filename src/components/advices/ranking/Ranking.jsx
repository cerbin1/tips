import { Link } from "react-router-dom";
import Table from "../../common/table/Table";
import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";

export default function rating() {
  const topAdvices = [
    {
      id: 1,
      name: "Porada 1",
      rating: 89234,
    },
    {
      id: 2,
      name: "Porada 2",
      rating: 1242,
    },
    {
      id: 3,
      name: "Porada 3",
      rating: 523,
    },
    {
      id: 4,
      name: "Porada 4",
      rating: 423,
    },
    {
      id: 5,
      name: "Porada 5",
      rating: 231,
    },
    {
      id: 6,
      name: "Porada 6",
      rating: 120,
    },
    {
      id: 7,
      name: "Porada 7",
      rating: 112,
    },
    {
      id: 8,
      name: "Porada 8",
      rating: 86,
    },
    {
      id: 9,
      name: "Porada 9",
      rating: 74,
    },
    {
      id: 10,
      name: "Porada 10",
      rating: 52,
    },
  ];

  const tableHeaders = ["Porada", "Ocena", "Szczegóły"];
  const rows = topAdvices.map((topAdvice) => (
    <tr key={topAdvice.id} className="hover:bg-slate-200 even:bg-slate-100">
      <td className="py-3 px-6 border border-slate-400">{topAdvice.name}</td>
      <td className="py-3 px-6 border border-slate-400">{topAdvice.rating}</td>
      <td className="py-3 px-6 border border-slate-400">
        <Link className="text-blue-to-dark text-lg" to="/advices">
          Wyświetl szczegóły
        </Link>
      </td>
    </tr>
  ));

  return (
    <section className="container" data-testid="ranking-section">
      <h1>Top 10 porad</h1>
      <Table
        head={<TableHeader headers={tableHeaders} />}
        body={<TableBody rows={rows} />}
      />
    </section>
  );
}
