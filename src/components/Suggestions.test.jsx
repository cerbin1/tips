import { renderWithAuth } from "../test/test-utils";
import Suggestions from "./Suggestions";

describe("Suggestions", () => {
  test("should render component", () => {
    renderWithAuth(<Suggestions />);

    expect(screen.getByTestId("suggestions-section")).toBeInTheDocument();
    const changeSuggestionTypeButton = screen.getByText(
      "Przejdź do propozycji kategorii"
    );
    expect(changeSuggestionTypeButton).toBeInTheDocument();
    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
  });

  test("should change to category suggestion on button click", async () => {
    renderWithAuth(<Suggestions />);

    await userEvent.click(screen.getByText("Przejdź do propozycji kategorii"));

    expect(screen.getByText("Zaproponuj kategorię")).toBeInTheDocument();
  });
});
