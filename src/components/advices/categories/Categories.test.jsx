import { screen } from "@testing-library/react";
import Categories from "./Categories";
import { renderWithRouter } from "../../../test-utils";
import { expect } from "vitest";

describe("Categories", () => {
  test("should display categories", () => {
    renderWithRouter(<Categories />);

    const section = screen.getByTestId("categories-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("container");
    expect(screen.getByText("Kategorie Porad")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass("mt-4");
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("rowgroup")[0]).toHaveClass("cursor-default");
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(4);
    headers.forEach((header) => {
      expect(header).toHaveClass(
        "py-3 px-6 border border-slate-300 bg-slate-400"
      );
    });
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(6);
    rows.shift(); // first row is table header without className
    rows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-slate-200 even:bg-slate-100");
    });
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(20);
    cells.forEach((cell) => {
      expect(cell).toHaveClass("py-3 px-6 border border-slate-400");
    });

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
    links.forEach((link) => {
      expect(link).toHaveClass("text-blue-to-dark text-lg");
    });
  });
});
