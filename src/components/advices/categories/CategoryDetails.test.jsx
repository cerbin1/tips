import { screen } from "@testing-library/react";
import CategoryDetails from "./CategoryDetails";
import { renderWithRouter } from "../../../test-utils";

describe("CategoryDetails", () => {
  test("should display category details ", () => {
    renderWithRouter(<CategoryDetails />);

    expect(screen.getByText("Nazwa kategorii")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(6);
  });
});
