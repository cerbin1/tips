import { render, screen } from "@testing-library/react";
import SuggestAdvice from "./SuggestAdvice";

describe("SuggestAdvice", () => {
  it("should display form", () => {
    render(<SuggestAdvice />);

    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    expect(screen.getByText("Kategoria")).toBeInTheDocument();
    expect(screen.getByText("Treść")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getByRole("combobox")).toBeInTheDocument(1);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
