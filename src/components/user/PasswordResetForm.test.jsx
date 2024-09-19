import { act, fireEvent, waitFor } from "@testing-library/react";
import PasswordResetForm from "./PasswordResetForm";

beforeAll(() => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("PasswordResetForm", () => {
  test("should render component and display form", () => {
    render(<PasswordResetForm />);

    expect(screen.getByTestId("password-reset-section")).toBeInTheDocument();
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
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when email is empty", async () => {
    render(<PasswordResetForm />);
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when email is not valid", async () => {
    render(<PasswordResetForm />);
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "invalid" },
    });
    expect(email).toHaveValue("invalid");
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should display general error when submitting form and response is not ok", async () => {
    render(<PasswordResetForm />);
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "test@test" },
    });
    expect(email).toHaveValue("test@test");

    await userEvent.click(screen.getByRole("button"));

    const error = screen.getByText(
      "Nie udało się wysłać linku resetującego hasło!"
    );
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/auth/account/password-reset?email=test@test",
      { method: "PUT" }
    );
  });

  test("should block submit button and change text when submitting form", async () => {
    render(<PasswordResetForm />);
    let submitButton = screen.getByRole("button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent("Wyślij");
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "test@test" },
    });
    expect(email).toHaveValue("test@test");

    userEvent.click(submitButton);

    await waitFor(() => {
      const isSubmittingButton = screen.getByText("Wysyłanie...");
      expect(isSubmittingButton).toBeInTheDocument();
      expect(isSubmittingButton).toBeInTheDocument();
      expect(isSubmittingButton).toBeDisabled();
    });
    submitButton = screen.getByRole("button");
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent("Wyślij");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/auth/account/password-reset?email=test@test",
      { method: "PUT" }
    );
  });

  test("should send form successfully", async () => {
    render(<PasswordResetForm />);
    const email = screen.getByLabelText("Adres e-mail");
    fireEvent.change(email, {
      target: { value: "test@test" },
    });
    expect(email).toHaveValue("test@test");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await act(async () => userEvent.click(screen.getByRole("button")));

    const success = screen.getByText(
      "Link do resetowania hasła został wysłany."
    );
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass("py-6 text-green-500");
    expect(screen.queryByRole("button")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/auth/account/password-reset?email=test@test",
      { method: "PUT" }
    );
  });
});
