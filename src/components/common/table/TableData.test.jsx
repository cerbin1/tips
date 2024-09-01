import TableData from "./TableData";

describe("TableData", () => {
  test("should render component", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableData>test</TableData>
          </tr>
        </tbody>
      </table>
    );

    const content = screen.getByRole("cell");
    expect(content).toHaveTextContent("test");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("py-3 px-6 border border-slate-400");
  });
});
