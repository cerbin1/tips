import { screen } from "@testing-library/react";
import Header from "./Header";
import { renderWithRouter } from "../../test-utils";

describe("Header", () => {
  test("should display logo", () => {
    renderWithRouter(<Header />);

    const logoElement = screen.getByText(/Afterady/);
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveClass("logo");
    expect(logoElement).toHaveAttribute("href", "/");
  });

  test("should display navigation links", () => {
    renderWithRouter(<Header />);

    const categoriesLink = screen.getByText(/Kategorie/);
    const rankingLink = screen.getByText(/Ranking/);
    const suggestLink = screen.getByText(/Zaproponuj/);
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

  test("renders the search text", () => {
    renderWithRouter(<Header />);

    const searchText = screen.getByText(/Search-TODO/);
    expect(searchText).toBeInTheDocument();
  });
});
