import TableHeader from "./TableHeader";

describe("TableHeader", () => {
  test("should render component", () => {
    const headers = ["header1", "header2", "header3", "header4"];
    render(
      <table>
        <TableHeader headers={headers} />
      </table>
    );

    expect(screen.getByRole("rowgroup")).toHaveClass("cursor-default");
    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    headers.forEach((header) => {
      expect(screen.getByText(header)).toHaveClass(
        "py-3 px-6 border border-slate-300 bg-slate-400"
      );
    });
  });
});
