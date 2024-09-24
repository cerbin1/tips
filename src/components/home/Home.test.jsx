import { renderWithRouter } from "../../test/test-utils";
import Home from "./Home";

describe("Home", () => {
  test("should render component", () => {
    renderWithRouter(<Home />);

    expect(screen.getByTestId("hero-section")).toHaveClass(
      "flex justify-center text-center"
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Witamy na naszej stronie!"
    );
    expect(
      screen.getByText(
        "Odkryj najlepsze porady i wskazówki, które pomogą Ci w codziennym życiu."
      )
    ).toHaveClass("text-2xl mb-8");
    const link = screen.getByText("Rozpocznij");
    expect(link.parentNode).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
    expect(link).toHaveAttribute("href", "/random");
  });
});
