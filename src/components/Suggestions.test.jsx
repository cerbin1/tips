import userEvent from "@testing-library/user-event";
import Suggestions from "./Suggestions";
import { renderWithAuthProvider } from "../test-utils";

describe("Suggestions", () => {
  test("should display button to change suggestion type", () => {
    renderWithAuthProvider(<Suggestions />);

    expect(screen.getByTestId("suggestions-section")).toBeInTheDocument();
    expect(
      screen.getByText("Przejdź do propozycji kategorii")
    ).toBeInTheDocument();
  });

  test("should display advice suggestion on component render", () => {
    renderWithAuthProvider(<Suggestions />);

    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
  });

  test("should change to category suggestion on button click", () => {
    renderWithAuthProvider(<Suggestions />);

    userEvent.click(screen.getByText("Przejdź do propozycji kategorii"));
  });
});
