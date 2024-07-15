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
    expect(table).toHaveClass("categories-table");
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getAllByRole("cell")).toHaveLength(20);
  });
});
