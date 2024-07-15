import { Link } from "react-router-dom";
import TableHeader from "../../common/table/TableHeader";
import TableRow from "../../common/table/TableRow";
import TableData from "../../common/table/TableData";
import TableDataLink from "../../common/table/TableDataLink";
import Table from "../../common/table/Table";
import TableBody from "../../common/table/TableBody";

const categories = [
  {
    id: 1,
    advicesCount: 15,
    name: "Rozwój osobisty",
    description: "Porady dotyczące samorozwoju i motywacji.",
  },
  {
    id: 2,
    advicesCount: 102,
    name: "Dom",
    description:
      "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.",
  },
  {
    id: 3,
    advicesCount: 52,
    name: "Zdrowie",
    description: "Porady dotyczące zdrowia i dobrego samopoczucia.",
  },
  {
    id: 4,
    advicesCount: 52,
    name: "Finanse",
    description: "Porady dotyczące zarządzania finansami.",
  },
  {
    id: 5,
    advicesCount: 0,
    name: "Technologia",
    description: "Porady dotyczące nowinek technologicznych.",
  },
];

const tableHeaders = ["Kategoria", "Opis", "Liczba porad", "Szczegóły"];
const rows = categories.map((category) => (
  <TableRow key={category.id}>
    <TableData>{category.name}</TableData>
    <TableData>{category.description}</TableData>
    <TableData>{category.advicesCount}</TableData>
    <TableDataLink href={"/categories/" + category.id}>
      Wyświetl szczegóły
    </TableDataLink>
  </TableRow>
));

export default function Categories() {
  return (
    <section className="container" data-testid="categories-section">
      <h1>Kategorie Porad</h1>
      <Table
        head={<TableHeader headers={tableHeaders} />}
        body={<TableBody rows={rows} />}
      />
    </section>
  );
}
