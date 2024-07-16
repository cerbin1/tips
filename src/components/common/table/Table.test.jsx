import { screen } from "@testing-library/react";
import TableDataLink from "./TableDataLink";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Table from "./Table";
import TableData from "./TableData";
import { renderWithRouter } from "../../../test-utils";
import TableBody from "./TableBody";

describe("Table", () => {
  test("should display table", () => {
    const ids = [1, 2, 3, 4];
    const tableRows = ids.map((id) => (
      <TableRow key={id} rowKey={id}>
        <TableData>test1</TableData>
        <TableData>test2</TableData>
        <TableData>test3</TableData>
        <TableDataLink href="/test">test4</TableDataLink>
      </TableRow>
    ));
    renderWithRouter(
      <Table
        head={
          <TableHeader headers={["header1", "header2", "header3", "header4"]} />
        }
        body={<TableBody rows={tableRows} />}
      ></Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass("mt-4");
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
