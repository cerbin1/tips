import { renderWithRouter } from "../../test/test-utils";
import Home from "./Home";

describe("Home", () => {
  test("should render component", () => {
    renderWithRouter(<Home />);

    const heroSection = screen.getByTestId("hero-section");
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveClass("flex justify-center text-center");
    const title = screen.getByRole("heading", {
      name: "Witamy na naszej stronie!",
    });
    expect(title).toBeInTheDocument();
    const description = screen.getByText(
      "Odkryj najlepsze porady i wskazówki, które pomogą Ci w codziennym życiu."
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-2xl mb-8");
    const link = screen.getByText("Rozpocznij");
    expect(link).toBeInTheDocument();
    expect(link.parentNode).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
    expect(link).toHaveAttribute("href", "/random");
  });
});
