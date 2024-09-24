import { renderWithAuth } from "../../test/test-utils";
import Suggest from "./Suggest";

describe("Suggest", () => {
  test("should render component", () => {
    renderWithAuth(<Suggest />);

    expect(screen.getByTestId("suggest-section")).toBeInTheDocument();
    expect(
      screen.getByText("Przejdź do propozycji kategorii")
    ).toBeInTheDocument();
    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
  });

  test("should change to category suggestion on button click", async () => {
    renderWithAuth(<Suggest />);

    await userEvent.click(screen.getByText("Przejdź do propozycji kategorii"));

    expect(screen.getByText("Zaproponuj kategorię")).toBeInTheDocument();
  });
});
