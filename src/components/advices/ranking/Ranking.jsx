import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContainerSection from "../../common/ContainerSection";
import Table from "../../common/table/Table";
import TableBody from "../../common/table/TableBody";
import TableHeader from "../../common/table/TableHeader";

export default function rating() {
  const [topAdvices, setTopAdvices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchRanking() {
      try {
        setError();
        setLoading(true);
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "advices/ranking"
        );
        if (response.ok) {
          const responseData = await response.json();
          setTopAdvices(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError("Nie udało się wyświetlić rankingu!");
      }
      setLoading(false);
    }

    fetchRanking();
  }, []);

  const tableHeaders = ["Nazwa", "Kategoria", "Ocena", "Szczegóły"];
  const tableRows = topAdvices.map((advice) => (
    <tr key={advice.name} className="hover:bg-slate-200 even:bg-slate-100">
      <td className="py-3 px-6 border border-slate-400">{advice.name}</td>
      <td className="py-3 px-6 border border-slate-400">
        {advice.categoryDisplayName}
      </td>
      <td className="py-3 px-6 border border-slate-400">{advice.rating}</td>
      <td className="py-3 px-6 border border-slate-400">
        <Link
          className="text-blue-to-dark text-lg"
          to={"/advices/" + advice.id}
        >
          Wyświetl szczegóły
        </Link>
      </td>
    </tr>
  ));

  return (
    <ContainerSection data-testid="ranking-section">
      <h1>Top 10 porad</h1>
      {!loading && !error && (
        <Table
          head={<TableHeader headers={tableHeaders} />}
          body={<TableBody rows={tableRows} />}
        />
      )}
      {loading && <div className="py-6">Ładowanie...</div>}
      {error && <div className="py-6 text-red-500">{error}</div>}
    </ContainerSection>
  );
}
