import TableRow from "./TableRow";

describe("TableRow", () => {
  test("should render component", () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>test1</td>
            <td>test2</td>
            <td>test3</td>
            <td>test4</td>
          </TableRow>
        </tbody>
      </table>
    );

    expect(screen.getByRole("row")).toHaveClass(
      "hover:bg-slate-200 even:bg-slate-100"
    );
    expect(screen.getAllByRole("cell")).toHaveLength(4);
  });
});
