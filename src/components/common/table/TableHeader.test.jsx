import TableHeader from "./TableHeader";

describe("TableHeader", () => {
  test("should display table header", () => {
    const headers = ["header1", "header2", "header3", "header4"];
    render(
      <table>
        <TableHeader headerNames={headers} />
      </table>
    );

    const tableHeader = screen.getByRole("rowgroup");
    expect(tableHeader).toBeInTheDocument();
    expect(tableHeader).toHaveClass("cursor-default");
    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    headers.forEach((header) => {
      const headerElement = screen.getByText(header);
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveClass(
        "py-3 px-6 border border-slate-300 bg-slate-400"
      );
    });
  });
});
