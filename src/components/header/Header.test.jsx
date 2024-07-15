import { screen } from "@testing-library/react";
import Header from "./Header";
import { renderWithRouter } from "../../test-utils";

describe("Header", () => {
  test("should display logo", () => {
    renderWithRouter(<Header />);

    expect(screen.getByText("Afterady")).toBeInTheDocument();
  });

  test("should display navigation links", () => {
    renderWithRouter(<Header />);

    const categoriesLink = screen.getByText("Kategorie");
    const rankingLink = screen.getByText("Ranking");
    const suggestLink = screen.getByText("Zaproponuj");
    expect(categoriesLink).toBeInTheDocument();
    expect(categoriesLink).toHaveClass("nav-item");
    expect(categoriesLink).toHaveAttribute("href", "/categories");
    expect(rankingLink).toBeInTheDocument();
    expect(rankingLink).toHaveClass("nav-item");
    expect(rankingLink).toHaveAttribute("href", "/ranking");
    expect(suggestLink).toBeInTheDocument();
    expect(suggestLink).toHaveClass("nav-item");
    expect(suggestLink).toHaveAttribute("href", "/suggest");
  });

  test("should get number of links", () => {
    renderWithRouter(<Header />);

    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  test("renders the search text", () => {
    renderWithRouter(<Header />);

    const searchText = screen.getByText("Search-TODO");
    expect(searchText).toBeInTheDocument();
  });
});
