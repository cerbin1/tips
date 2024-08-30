import { renderWithAuth } from "../test/test-utils";
import Suggestions from "./Suggestions";

describe("Suggestions", () => {
  test("should display button to change suggestion type", () => {
    renderWithAuth(<Suggestions />);

    expect(screen.getByTestId("suggestions-section")).toBeInTheDocument();
    expect(
      screen.getByText("Przejdź do propozycji kategorii")
    ).toBeInTheDocument();
  });

  test("should display advice suggestion on component render", () => {
    renderWithAuth(<Suggestions />);

    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
  });

  test("should change to category suggestion on button click", () => {
    renderWithAuth(<Suggestions />);

    userEvent.click(screen.getByText("Przejdź do propozycji kategorii"));
  });
});
