import TableRow from "./TableRow";

describe("TableRow", () => {
  test("should display table row", () => {
    render(
      <table>
        <tbody>
          <TableRow key="test">
            <td>test1</td>
            <td>test2</td>
            <td>test3</td>
            <td>test4</td>
          </TableRow>
        </tbody>
      </table>
    );

    const row = screen.getByRole("row");
    expect(row).toBeInTheDocument();
    expect(row).toHaveClass("hover:bg-slate-200 even:bg-slate-100");
    expect(screen.getAllByRole("cell")).toHaveLength(4);
  });
});
