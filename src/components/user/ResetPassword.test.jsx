import userEvent from "@testing-library/user-event";
import ResetPassword from "./ResetPassword";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { beforeAll } from "vitest";

describe("ResetPassword", () => {
  beforeAll(() => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    import.meta.env.VITE_BACKEND_URL = "backend/";
  });

  test("should display form", () => {
    render(<ResetPassword />);

    expect(screen.getByTestId("reset-password-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Resetuj hasło"
    );
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 w-1/3");
    const emailInput = screen.getByLabelText("Adres e-mail");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
  });

  test("should not submit form when email is empty", async () => {
    render(<ResetPassword />);

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when email is not valid", async () => {
    render(<ResetPassword />);
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "invalid" },
    });
    expect(email).toHaveValue("invalid");

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should display general error when request fails on backend", async () => {
    render(<ResetPassword />);
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "test@test" },
    });
    expect(email).toHaveValue("test@test");

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/auth/account/password?email=test@test",
      { method: "PUT" }
    );
    const error = screen.getByText(
      "Nie udało się wysłać linku resetującego hasło!"
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display general error when request fails on backend", async () => {
    render(<ResetPassword />);
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "test@test" },
    });
    expect(email).toHaveValue("test@test");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/auth/account/password?email=test@test",
      { method: "PUT" }
    );
    const error = screen.getByText(
      "Nie udało się wysłać linku resetującego hasło!"
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should block submit button and change text when submitting form", async () => {
    await act(async () => render(<ResetPassword />));
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent("Wyślij");
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "test@test" },
    });
    expect(email).toHaveValue("test@test");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  test("should send form successfully", async () => {
    render(<ResetPassword />);
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "test@test" },
    });
    expect(email).toHaveValue("test@test");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const success = screen.getByText(
      "Link do resetowania hasła został wysłany."
    );
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass("py-6 text-green-500");
  });
});
