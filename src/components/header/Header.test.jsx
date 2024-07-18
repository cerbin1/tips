import { screen } from "@testing-library/react";
import Header from "./Header";
import { renderWithRouter } from "../../test-utils";
import { expect } from "vitest";

describe("Header", () => {
  test("should display header", () => {
    renderWithRouter(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(
      "flex justify-between items-center px-4 border-b border-cyan-100"
    );
  });

  test("should display logo", () => {
    renderWithRouter(<Header />);

    expect(screen.getByText("Afterady")).toBeInTheDocument();
  });

  test("should display navbar with links", () => {
    renderWithRouter(<Header />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass("py-4");
    const randomAdviceLink = screen.getByText("Losowa porada");
    const categoriesLink = screen.getByText("Kategorie");
    const rankingLink = screen.getByText("Ranking");
    const suggestLink = screen.getByText("Zaproponuj");
    expect(randomAdviceLink).toBeInTheDocument();
    expect(randomAdviceLink).toHaveAttribute("href", "/random");
    expect(categoriesLink).toBeInTheDocument();
    expect(categoriesLink).toHaveAttribute("href", "/categories");
    expect(rankingLink).toBeInTheDocument();
    expect(rankingLink).toHaveAttribute("href", "/ranking");
    expect(suggestLink).toBeInTheDocument();
    expect(suggestLink).toHaveAttribute("href", "/suggest");
  });

  test("should get number of links", () => {
    renderWithRouter(<Header />);

    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  test("should display user buttons", () => {
    renderWithRouter(<Header />);

    expect(screen.getByText("Zaloguj | Zarejestruj się")).toBeInTheDocument();
    expect(screen.getByTitle("User")).toBeInTheDocument();
  });
});
