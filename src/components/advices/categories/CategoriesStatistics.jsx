import TableHeader from "../../common/table/TableHeader";
import TableRow from "../../common/table/TableRow";
import TableData from "../../common/table/TableData";
import TableDataLink from "../../common/table/TableDataLink";
import Table from "../../common/table/Table";
import TableBody from "../../common/table/TableBody";
import ContainerSection from "../../common/ContainerSection";
import { useEffect, useState } from "react";

export default function CategoriesStatistics() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "categories-statistics"
        );
        if (response.ok) {
          const responseData = await response.json();
          setCategories(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError("Nie udało się wyświetlić kategorii!");
      }
      setIsLoading(false);
    }
    fetchCategories();
  }, []);

  const tableHeaders = ["Kategoria", "Opis", "Liczba porad", "Szczegóły"];
  const rows = categories.map((categoryDetails) => (
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
      {error && <p className="py-6 text-red-500">{error}</p>}
      {isLoading && <p>Ładowanie...</p>}
      {!error && !isLoading && (
        <Table
          head={<TableHeader headerNames={tableHeaders} />}
          body={<TableBody rows={rows} />}
        />
      )}
    </ContainerSection>
  );
}
