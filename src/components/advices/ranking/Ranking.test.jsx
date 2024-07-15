import { screen } from "@testing-library/react";
import Ranking from "./Ranking";
import { renderWithRouter } from "../../../test-utils";

describe("Ranking", () => {
  test("should display ranking", () => {
    renderWithRouter(<Ranking />);

    const section = screen.getByTestId("ranking-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("container");
    expect(screen.getByText("Top 10 porad")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(11);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass("mt-4");
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(11);
    rows.shift(); // first row is table header without className
    rows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-slate-200 even:bg-slate-100");
    });
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(30);
    cells.forEach((cell) => {
      expect(cell).toHaveClass("py-3 px-6 border border-slate-400");
    });

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(10);
    links.forEach((link) => {
      expect(link).toHaveClass("text-blue-to-dark text-lg");
    });
  });
});
