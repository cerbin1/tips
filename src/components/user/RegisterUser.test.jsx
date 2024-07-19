import { render, screen } from "@testing-library/react";
import RegisterUser from "./RegisterUser";

describe("RegisterUser", () => {
  test("should display form", () => {
    render(<RegisterUser />);

    expect(screen.getByTestId("register-user-section")).toBeInTheDocument();
    expect(screen.getByText("Rejestracja")).toBeInTheDocument();
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 w-1/3");
    expect(screen.getByLabelText("Adres e-mail")).toBeInTheDocument();
    expect(screen.getByText("Nazwa użytkownika")).toBeInTheDocument();
    expect(screen.getByText("Hasło")).toBeInTheDocument();
    expect(screen.getByText("Powtórz hasło")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    const resetButton = screen.getByText("Wyczyść formularz");
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveAttribute("type", "reset");
    expect(resetButton).toHaveClass(
      "px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
    );
    const submitButton = screen.getByText("Wyślij");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
  });
});
