import { renderWithRouter } from "../../../test/test-utils";
import Table from "./Table";
import TableBody from "./TableBody";
import TableData from "./TableData";
import TableDataLink from "./TableDataLink";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

describe("Table", () => {
  test("should render component", () => {
    const ids = [1, 2, 3, 4];
    const tableRows = ids.map((id) => (
      <TableRow key={id}>
        <TableData>test1</TableData>
        <TableData>test2</TableData>
        <TableData>test3</TableData>
        <TableDataLink href="/test">test4</TableDataLink>
      </TableRow>
    ));
    renderWithRouter(
      <Table
        title="test title"
        head={
          <TableHeader headers={["header1", "header2", "header3", "header4"]} />
        }
        body={<TableBody rows={tableRows} />}
      ></Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "test title"
    );
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(5);
    rows.shift(); // first row is table header without className
    rows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-slate-200 even:bg-slate-100");
    });
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(16);
    cells.forEach((cell) => {
      expect(cell).toHaveClass("py-3 px-6 border border-slate-400");
    });
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
    links.forEach((link) => {
      expect(link).toHaveClass("text-blue-to-dark text-lg");
    });
  });
});
