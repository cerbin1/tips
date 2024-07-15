import { render, screen } from "@testing-library/react";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import TableData from "./TableData";

describe("TableBody", () => {
  test("should display table body", () => {
    render(
      <TableBody
        rows={
          <TableRow rowKey={1}>
            <TableData>test1</TableData>
            <TableData>test2</TableData>
            <TableData>test3</TableData>
          </TableRow>
        }
      />
    );

    const tableBody = screen.getByRole("rowgroup");
    expect(tableBody).toBeInTheDocument();
    expect(screen.getByRole("row")).toBeInTheDocument();
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(3);
  });
});
