import { render, screen } from "@testing-library/react";
import TableRow from "./TableRow";
import { expect } from "vitest";

describe("TableRow", () => {
  test("should display table row", () => {
    render(
      <TableRow key="test">
        <td>test1</td> <td>test2</td> <td>test3</td> <td>test4</td>
      </TableRow>
    );

    const row = screen.getByRole("row");
    expect(row).toBeInTheDocument();
    expect(row).toHaveClass("hover:bg-slate-200 even:bg-slate-100");
    expect(screen.getAllByRole("cell")).toHaveLength(4);
  });
});
