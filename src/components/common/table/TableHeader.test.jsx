import { render, screen } from "@testing-library/react";
import TableHeader from "./TableHeader";

describe("TableHeader", () => {
  test("should display table header", () => {
    const tableHeaders = ["header1", "header2", "header3", "header4"];
    render(<TableHeader headers={tableHeaders} />);

    const tableHeader = screen.getByRole("rowgroup");
    tableHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
    expect(tableHeader).toBeInTheDocument();
    expect(tableHeader).toHaveClass("cursor-default");
    expect(screen.getByRole("row")).toBeInTheDocument();
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(4);
    headers.forEach((header) => {
      expect(header).toHaveClass(
        "py-3 px-6 border border-slate-300 bg-slate-400"
      );
    });
  });
});
