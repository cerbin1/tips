import Table from "../../common/table/Table";
import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";
import TableRow from "../../common/table/TableRow";
import TableData from "../../common/table/TableData";
import TableDataLink from "../../common/table/TableDataLink";

const advices = [
  {
    id: 1,
    name: "Porada 1",
    rating: 1542,
  },
  {
    id: 2,
    name: "Porada 2",
    rating: 523,
  },
  {
    id: 3,
    name: "Porada 3",
    rating: 152,
  },
  {
    id: 4,
    name: "Porada 4",
    rating: 23,
  },
  {
    id: 5,
    name: "Porada 5",
    rating: 12,
  },
];

const rows = advices.map((advice) => (
  <TableRow key={advice.id}>
    <TableData>{advice.name}</TableData>
    <TableData>{advice.rating}</TableData>
    <TableDataLink href={"/advices"}>Wyświetl szczegóły</TableDataLink>
  </TableRow>
));

export default function CategoryDetails() {
  return (
    <section data-testid="category-details-section" className="container">
      <h1>Nazwa kategorii</h1>
      <Table
        head={<TableHeader headers={["Porada", "Ocena", "Szczegóły"]} />}
        body={<TableBody rows={rows} />}
      />
    </section>
  );
}
