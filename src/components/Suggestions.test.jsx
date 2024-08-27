import userEvent from "@testing-library/user-event";
import Suggestions from "./Suggestions";

describe("Suggestions", () => {
  test("should display button to change suggestion type", () => {
    render(<Suggestions />);

    expect(screen.getByTestId("suggestions-section")).toBeInTheDocument();
    expect(
      screen.getByText("Przejdź do propozycji kategorii")
    ).toBeInTheDocument();
  });

  test("should display advice suggestion on component render", () => {
    render(<Suggestions />);

    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
  });

  test("should change to category suggestion on button click", () => {
    render(<Suggestions />);

    userEvent.click(screen.getByText("Przejdź do propozycji kategorii"));
  });
});
