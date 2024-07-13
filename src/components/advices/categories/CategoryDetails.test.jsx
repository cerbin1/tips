import { render, screen } from "@testing-library/react";
import CategoryDetails from "./CategoryDetails";
import { BrowserRouter } from "react-router-dom";
describe("CategoryDetails", () => {
  test("should display category details ", () => {
    render(<CategoryDetails />, { wrapper: BrowserRouter });

    expect(screen.getByText("Nazwa kategorii")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(6);
  });
});
