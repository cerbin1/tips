import { useEffect, useState } from "react";
import ContainerSection from "../common/ContainerSection";
import Table from "../common/table/Table";
import TableHeader from "../common/table/TableHeader";
import TableBody from "../common/table/TableBody";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import RequestError from "../common/RequestError";

export default function Suggestions() {
  const [advicesView, setAdvicesView] = useState(true);
  const [suggestedAdvices, setSuggestedAdvices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchSuggestedAdvices() {
      try {
        setError();
        setLoading(true);
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "advices/suggested"
        );
        if (response.ok) {
          const responseData = await response.json();
          setSuggestedAdvices(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError("Nie udało się wyświetlić proponowanych porad!");
      }
      setLoading(false);
    }
    fetchSuggestedAdvices();
  }, []);

  function handleTypeChange() {
    setAdvicesView((previousType) => !previousType);
  }

  const tableHeaders = ["Nazwa", "Kategoria", "Ocena", "Szczegóły"];
  const tableRows = suggestedAdvices.map((advice) => (
    <tr key={advice.name} className="hover:bg-slate-200 even:bg-slate-100">
      <td className="py-3 px-6 border border-slate-400">{advice.name}</td>
      <td className="py-3 px-6 border border-slate-400">
        {advice.category.displayName}
      </td>
      <td className="py-3 px-6 border border-slate-400">{advice.rating}</td>
      <td className="py-3 px-6 border border-slate-400">
        <Link
          className="text-blue-to-dark text-lg"
          to={"/advices/suggested/" + advice.id}
        >
          Wyświetl szczegóły
        </Link>
      </td>
    </tr>
  ));

  return (
    <ContainerSection data-testid="suggestions">
      <p
        className="text-blue-to-light cursor-pointer"
        onClick={handleTypeChange}
      >
        {advicesView ? "Przejdź do kategorii" : "Przejdź do porad"}
      </p>
      <h1>Propozycje porad</h1>
      {loading && <Loader />}
      {suggestedAdvices && suggestedAdvices.length > 0 && (
        <Table
          head={<TableHeader headers={tableHeaders} />}
          body={<TableBody rows={tableRows} />}
        />
      )}
      {!loading &&
        !error &&
        suggestedAdvices &&
        suggestedAdvices.length === 0 && <p>Brak propozycji porad.</p>}
      <RequestError content={error} />
    </ContainerSection>
  );
}
