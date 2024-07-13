import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  test("should get logo", () => {
    render(<Header />);

    const logo = screen.getByText("Afterady");
    expect(logo).toBeInTheDocument(true);
  });

  test("should get three navbar items", () => {
    render(<Header />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument(true);
    expect(navbar.children.length).toBe(3);
    expect(navbar.children[0]).toHaveTextContent("Kategorie");
    expect(navbar.children[1]).toHaveTextContent("Ranking");
    expect(navbar.children[2]).toHaveTextContent("Zaproponuj");
  });
});
