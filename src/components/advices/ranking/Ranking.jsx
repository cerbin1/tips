import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContainerSection from "../../common/ContainerSection";
import Table from "../../common/table/Table";
import TableBody from "../../common/table/TableBody";
import TableHeader from "../../common/table/TableHeader";
import RequestError from "../../common/RequestError";
import Loader from "../../common/Loader";
import TableRow from "../../common/table/TableRow";
import TableDataLink from "../../common/table/TableDataLink";
import TableData from "../../common/table/TableData";

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
    <TableRow key={advice.name}>
      <TableData>{advice.name}</TableData>
      <TableData>{advice.categoryDisplayName}</TableData>
      <TableData>{advice.rating}</TableData>
      <TableDataLink href={"/advices/" + advice.id}>
        Wyświetl szczegóły
      </TableDataLink>
    </TableRow>
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
      {loading && <Loader />}
      <RequestError content={error} />
    </ContainerSection>
  );
}
