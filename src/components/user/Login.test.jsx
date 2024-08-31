import { act, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { renderWithRouterAndAuth } from "../../test/test-utils";

beforeAll(() => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

  import.meta.env.VITE_BACKEND_URL = "backend/";
});

describe("Login", () => {
  test("should render component", () => {
    act(() => renderWithRouterAndAuth(<Login />));

    expect(screen.getByTestId("login-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Login"
    );
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 w-1/3");
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    const emailInput = screen.getByLabelText("Adres e-mail");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();
    const passwordInput = screen.getByLabelText("Hasło");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toBeRequired();
    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveTextContent("Zaloguj");
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
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when email is empty", async () => {
    renderWithRouterAndAuth(<Login />);
    const loginButton = screen.getByText("Zaloguj");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();

    await userEvent.click(loginButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when email is empty after trimming", async () => {
    renderWithRouterAndAuth(<Login />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "   " },
    });
    const loginButton = screen.getByText("Zaloguj");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();

    await userEvent.click(loginButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password is empty", async () => {
    renderWithRouterAndAuth(<Login />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    const loginButton = screen.getByText("Zaloguj");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();

    await userEvent.click(loginButton);

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
    expectLoginAuthRequestSent();
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
    expectLoginAuthRequestSent();
  });

  test("should change button text and disable it when form is submitting", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          JSON.parse(
            `{"jwt": "token", "roles": ["user"], "userEmail": "email"}`
          ),
      })
    );
    renderWithRouterAndAuth(<Login />);
    await fillForm();
    let loginButton = screen.getByRole("button");
    expect(loginButton).toHaveTextContent("Zaloguj");
    expect(loginButton).not.toBeDisabled();

    userEvent.click(loginButton);

    await waitFor(() => {
      const loggingButton = screen.getByRole("button");
      expect(loggingButton).toBeInTheDocument();
      expect(loggingButton).toHaveTextContent("Logowanie...");
      expect(loggingButton).toBeDisabled();
    });
    expect(screen.queryByText("Logowanie...")).toBeNull();
    loginButton = screen.getByRole("button");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();
    expectLoginAuthRequestSent(globalThis);
  });

  test("should login successfully", async () => {
    localStorage.setItem("token", "token");
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          JSON.parse(
            `{"jwt": "token", "roles": ["user"], "userEmail": "email"}`
          ),
      })
    );
    renderWithRouterAndAuth(<Login />);
    await fillForm();

    await act(async () => {
      await userEvent.click(screen.getByRole("button"));
    });

    expect(localStorage.getItem("token")).toBe("token");
    expect(localStorage.getItem("roles")).toBe('["user"]');
    expect(localStorage.getItem("userEmail")).toBe("email");
    expectLoginAuthRequestSent();
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

function expectLoginAuthRequestSent() {
  expect(globalThis.fetch).toBeCalledTimes(1);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/auth/login",
    expect.objectContaining({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email",
        password: "password",
      }),
    })
  );
}
