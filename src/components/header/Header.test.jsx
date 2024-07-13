import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { BrowserRouter } from "react-router-dom";

describe("Header", () => {
  test("should display logo", () => {
    render(<Header />, { wrapper: BrowserRouter });

    const logo = screen.getByText("Afterady");
    expect(logo).toBeInTheDocument(true);
  });

  test("should display three navbar items", () => {
    render(<Header />, { wrapper: BrowserRouter });

    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument(true);
    expect(navbar.children.length).toBe(3);
    expect(navbar.children[0]).toHaveTextContent("Kategorie");
    expect(navbar.children[1]).toHaveTextContent("Ranking");
    expect(navbar.children[2]).toHaveTextContent("Zaproponuj");
  });
});
