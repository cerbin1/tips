import { render, screen } from "@testing-library/react";
import Categories from "./Categories";
import { BrowserRouter } from "react-router-dom";

describe("Categories", () => {
  test("should display categories", () => {
    render(<Categories />, { wrapper: BrowserRouter });

    expect(screen.getByText("Kategorie")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(5);
  });
});
