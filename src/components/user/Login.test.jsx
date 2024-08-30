import { act, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { renderWithRouterAndAuth } from "../../test/test-utils";

beforeAll(() => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

  import.meta.env.VITE_BACKEND_URL = "backend/";
});

beforeEach(() => {
  globalThis.fetch.mockClear();
});

describe("Login", () => {
  test("should display form", () => {
    renderWithRouterAndAuth(<Login />);

    expect(screen.getByTestId("login-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Login"
    );
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 w-1/3");
    const emailInput = screen.getByLabelText("Adres e-mail");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();
    const passwordInput = screen.getByLabelText("Hasło");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toBeRequired();
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    const loginButton = screen.getByText("Zaloguj");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("type", "submit");
    expect(loginButton).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
    const passwordResetButton = screen.getByText("Zresetuj hasło");
    expect(passwordResetButton).toBeInTheDocument();
    expect(passwordResetButton).toHaveAttribute("href", "/user/password-reset");
    expect(passwordResetButton).toHaveClass(
      "px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
    );
  });

  test("should not send form when email is empty", async () => {
    renderWithRouterAndAuth(<Login />);

    await userEvent.click(screen.getByText("Zaloguj"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when email is empty after trimming", async () => {
    renderWithRouterAndAuth(<Login />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "   " },
    });

    await userEvent.click(screen.getByText("Zaloguj"));
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password is empty", async () => {
    renderWithRouterAndAuth(<Login />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });

    const submitButton = screen.getByText("Zaloguj");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should display error when credentials are invalid", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: "Error: Bad credentials!",
      })
    );
    renderWithRouterAndAuth(<Login />);
    await fillForm();

    await userEvent.click(screen.getByRole("button"));

    const error = screen.getByText("Podano nieprawidłowe dane logowania!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display general error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );
    renderWithRouterAndAuth(<Login />);
    await fillForm();

    await userEvent.click(screen.getByRole("button"));

    const error = screen.getByText("Nie udało się zalogować!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should change button text and disable it when form is submitting", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(
          `{"jwt": "token", "roles": "[\"user\"]", "userEmail": "email"}`
        ),
    });
    renderWithRouterAndAuth(<Login />);
    await fillForm();
    const submitButton = screen.getByText("Zaloguj");
    expect(submitButton).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
    expect(submitButton).not.toBeDisabled();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Logowanie...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
    expect(screen.queryByText("Logowanie...")).toBeNull();
    expect(screen.getByText("Zaloguj")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  test("should login successfully", async () => {
    localStorage.setItem("token", "token");
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse('{"jwt": "token", "roles": ["user"], "userEmail": "email"}'),
    });
    renderWithRouterAndAuth(<Login />);
    await fillForm();

    await act(async () => {
      userEvent.click(screen.getByRole("button"));
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("backend/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@email",
          password: "password",
        }),
      });
    });
    expect(localStorage.getItem("token")).toBe("token");
    expect(localStorage.getItem("roles")).toBe('["user"]');
    expect(localStorage.getItem("userEmail")).toBe("email");
  });
});

async function fillForm() {
  fireEvent.change(screen.getByLabelText("Adres e-mail"), {
    target: { value: "test@email" },
  });
  fireEvent.change(screen.getByLabelText("Hasło"), {
    target: { value: "password" },
  });
}
