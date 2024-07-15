import { screen } from "@testing-library/react";
import CategoryDetails from "./CategoryDetails";
import { renderWithRouter } from "../../../test-utils";

describe("CategoryDetails", () => {
  test("should display category details ", () => {
    renderWithRouter(<CategoryDetails />);

    const section = screen.getByTestId("category-details-section");
    expect(section).toBeInTheDocument();
    expect(screen.getByText("Nazwa kategorii")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.queryAllByRole("columnheader")).toHaveLength(3);
  });
});
