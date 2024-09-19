import { useEffect, useState } from "react";
import ContainerSection from "../common/ContainerSection";
import Table from "../common/table/Table";
import TableHeader from "../common/table/TableHeader";
import TableBody from "../common/table/TableBody";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import RequestError from "../common/RequestError";
import TableRow from "../common/table/TableRow";
import TableData from "../common/table/TableData";
import TableDataLink from "../common/table/TableDataLink";

export default function Suggestions() {
  const [advicesView, setAdvicesView] = useState(true);
  const [suggestedAdvices, setSuggestedAdvices] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
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

    async function fetchSuggestedCategories() {
      try {
        setError();
        setLoading(true);
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "advices/categories/suggested"
        );
        if (response.ok) {
          const responseData = await response.json();
          setSuggestedCategories(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError("Nie udało się wyświetlić proponowanych kategorii!");
      }
      setLoading(false);
    }

    if (advicesView) {
      fetchSuggestedAdvices();
    } else {
      fetchSuggestedCategories();
    }
  }, [advicesView]);

  function handleTypeChange() {
    setAdvicesView((previousType) => !previousType);
  }

  const suggestedAdvicesTableHeaders = [
    "Nazwa",
    "Kategoria",
    "Ocena",
    "Szczegóły",
  ];
  const suggestedAdvicesTableRows = suggestedAdvices.map((advice) => (
    <TableRow key={advice.id}>
      <TableData>{advice.name}</TableData>
      <TableData>{advice.category.displayName}</TableData>
      <TableData>{advice.rating}</TableData>
      <TableDataLink href={"/advices/suggested/" + advice.id}>
        Wyświetl szczegóły
      </TableDataLink>
    </TableRow>
  ));

  const suggestedCategoriesTableHeaders = ["Nazwa", "Ocena", "Szczegóły"];
  const suggestedCategoriesTableRows = suggestedCategories.map((category) => (
    <TableRow key={category.name}>
      <TableData>{category.name}</TableData>
      <TableData>{category.rating}</TableData>
      <TableDataLink href={"/categories/suggested/" + category.id}>
        Wyświetl szczegóły
      </TableDataLink>
    </TableRow>
  ));

  return (
    <ContainerSection data-testid="suggestions">
      <p
        className="text-blue-to-light cursor-pointer"
        onClick={handleTypeChange}
      >
        {advicesView ? "Przejdź do kategorii" : "Przejdź do porad"}
      </p>
      {advicesView && (
        <>
          <h1>Propozycje porad</h1>
          {loading && <Loader />}
          {!loading && suggestedAdvices && suggestedAdvices.length > 0 && (
            <Table
              head={<TableHeader headers={suggestedAdvicesTableHeaders} />}
              body={<TableBody rows={suggestedAdvicesTableRows} />}
            />
          )}
          {!loading &&
            !error &&
            suggestedAdvices &&
            suggestedAdvices.length === 0 && <p>Brak propozycji porad.</p>}
          <RequestError content={error} />
        </>
      )}
      {!advicesView && (
        <>
          <h1>Propozycje kategorii</h1>
          {loading && <Loader />}
          {!loading &&
            suggestedCategories &&
            suggestedCategories.length > 0 && (
              <Table
                head={<TableHeader headers={suggestedCategoriesTableHeaders} />}
                body={<TableBody rows={suggestedCategoriesTableRows} />}
              />
            )}

          {!loading &&
            !error &&
            suggestedCategories &&
            suggestedCategories.length === 0 && (
              <p>Brak propozycji kategorii.</p>
            )}
          <RequestError content={error} />
        </>
      )}
    </ContainerSection>
  );
}
