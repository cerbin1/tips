import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ContainerSection from "../../common/ContainerSection";
import Table from "../../common/table/Table";
import TableBody from "../../common/table/TableBody";
import TableData from "../../common/table/TableData";
import TableDataLink from "../../common/table/TableDataLink";
import TableHeader from "../../common/table/TableHeader";
import TableRow from "../../common/table/TableRow";
import RequestError from "../../common/RequestError";
import Loader from "../../common/Loader";

export default function CategoryDetails() {
  const [categoryDetails, setCategoryDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { categoryId } = useParams();

  let tableWithAdvices;
  if (categoryDetails) {
    const tableRows = categoryDetails.advices.map((advice) => (
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
        body={<TableBody rows={tableRows} />}
      />
    );
  }

  useEffect(() => {
    async function fetchAdvicesByCategory() {
      setLoading(true);
      setError();
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "categories/" + categoryId
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
      setLoading(false);
    }

    fetchAdvicesByCategory();
  }, []);

  return (
    <ContainerSection data-testid="category-details-section">
      {!error && !loading && categoryDetails && (
        <>
          <h1>{categoryDetails.categoryDisplayName}</h1>
          <h2>{categoryDetails.description}</h2>
          Liczba wszystkich porad: {categoryDetails.advices.length}
          {tableWithAdvices}
        </>
      )}
      {loading && <Loader />}
      <RequestError content={error} />
    </ContainerSection>
  );
}
