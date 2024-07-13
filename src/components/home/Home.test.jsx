import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home", () => {
  test("should display hero section", () => {
    render(<Home />);

    const hero = screen.getByTestId("hero-section");
    expect(hero).toBeInTheDocument();
    expect(hero).toHaveClass("hero");
    const title = screen.getByRole("heading", {
      name: /Witamy na naszej stronie!/,
    });

    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("hero-title");

    const description = screen.getByText(
      /Odkryj najlepsze porady i wskazówki, które pomogą Ci w codziennym życiu./
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("hero-description");

    const button = screen.getByText(/Rozpocznij/);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("hero-button");
    expect(button).toHaveAttribute("href", "#");
  });
});

<section data-testid="hero-section" className="hero">
  <div className="hero-content">
    <h1 className="hero-title">Witamy na naszej stronie!</h1>
    <p className="hero-description">
      Odkryj najlepsze porady i wskazówki, które pomogą Ci w codziennym życiu.
    </p>
    <a href="#" className="hero-button">
      Rozpocznij
    </a>
  </div>
</section>;
