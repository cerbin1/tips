import { screen } from "@testing-library/react";
import Categories from "./Categories";
import { renderWithRouter } from "../../../test-utils";

describe("Categories", () => {
  test("should display categories", () => {
    renderWithRouter(<Categories />);

    expect(screen.getByText("Kategorie")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(5);
  });
});
