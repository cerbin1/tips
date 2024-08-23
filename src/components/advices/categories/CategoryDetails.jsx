import Table from "../../common/table/Table";
import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";
import TableRow from "../../common/table/TableRow";
import TableData from "../../common/table/TableData";
import TableDataLink from "../../common/table/TableDataLink";
import ContainerSection from "../../common/ContainerSection";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CategoryDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [categoryDetails, setCategoryDetails] = useState();
  const { category } = useParams();

  let tableWithAdvices;
  if (categoryDetails) {
    const rows = categoryDetails.advices.map((advice) => (
      <TableRow key={advice.id}>
        <TableData>{advice.name}</TableData>
        <TableData>{advice.rating}</TableData>
        <TableDataLink href={"/advices/" + advice.id}>
          Wyświetl szczegóły
        </TableDataLink>
      </TableRow>
    ));
    tableWithAdvices = (
      <Table
        head={<TableHeader headers={["Porada", "Ocena", "Szczegóły"]} />}
        body={<TableBody rows={rows} />}
      />
    );
  }

  useEffect(() => {
    async function fetchAdvicesByCategory() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "advices/byCategory/" + category
        );
        if (response.ok) {
          const categoryDetails = await response.json();
          setCategoryDetails(categoryDetails);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError("Nie udało się wyświetlić porad!");
      }
      setIsLoading(false);
    }

    fetchAdvicesByCategory();
  }, []);

  return (
    <ContainerSection data-testid="category-details-section">
      {!error && !isLoading && categoryDetails && (
        <>
          <h1>{categoryDetails.categoryDisplayName}</h1>
          Liczba: {categoryDetails.advicesCount}
          {tableWithAdvices}
        </>
      )}
      {isLoading && <p>Ładowanie...</p>}
      {error && <p className="py-6 text-red-500">{error}</p>}
    </ContainerSection>
  );
}
