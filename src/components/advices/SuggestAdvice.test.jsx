import { render, screen } from "@testing-library/react";
import SuggestAdvice from "./SuggestAdvice";

describe("SuggestAdvice", () => {
  it("should display form", () => {
    render(<SuggestAdvice />);

    expect(screen.getByTestId("suggest-advice-section")).toBeInTheDocument();
    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4");
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    expect(screen.getByText("Kategoria")).toBeInTheDocument();
    expect(screen.getByText("Treść")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getByRole("combobox")).toBeInTheDocument(1);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
