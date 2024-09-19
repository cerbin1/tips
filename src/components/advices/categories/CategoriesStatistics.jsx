import { useEffect, useState } from "react";
import ContainerSection from "../../common/ContainerSection";
import Table from "../../common/table/Table";
import TableBody from "../../common/table/TableBody";
import TableData from "../../common/table/TableData";
import TableDataLink from "../../common/table/TableDataLink";
import TableHeader from "../../common/table/TableHeader";
import TableRow from "../../common/table/TableRow";
import RequestError from "../../common/RequestError";
import Loader from "../../common/Loader";
import { getCategoriesUrl } from "../../../util/endpoints";

export default function CategoriesStatistics() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchCategories() {
      setError();
      setLoading(true);
      try {
        const response = await fetch(getCategoriesUrl());
        if (response.ok) {
          const responseData = await response.json();
          setCategories(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError("Nie udało się wyświetlić kategorii!");
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const tableHeaders = ["Kategoria", "Opis", "Liczba porad", "Szczegóły"];
  const tableRows = categories.map((categoryDetails) => (
    <TableRow key={categoryDetails.id}>
      <TableData>{categoryDetails.category.displayName}</TableData>
      <TableData>{categoryDetails.description}</TableData>
      <TableData>{categoryDetails.advicesCount}</TableData>
      <TableDataLink href={"/categories/" + categoryDetails.id}>
        Wyświetl szczegóły
      </TableDataLink>
    </TableRow>
  ));

  return (
    <ContainerSection data-testid="categories-section">
      <h1>Kategorie Porad</h1>
      <RequestError content={error} />
      {loading && <Loader />}
      {!error && !loading && categories && (
        <Table
          head={<TableHeader headers={tableHeaders} />}
          body={<TableBody rows={tableRows} />}
        />
      )}
    </ContainerSection>
  );
}
