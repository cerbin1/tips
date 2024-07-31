import { fireEvent } from "@testing-library/react";
import Login from "./Login";
import { vi } from "vitest";
import { useActionData, useNavigation } from "react-router";
import { renderWithRouter } from "../../test-utils";

beforeAll(() => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

  vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
      ...actual,
      useActionData: vi.fn(),
      useNavigation: vi.fn(() => {
        return {
          state: "idle",
        };
      }),
    };
  });

  vi.mock("react-router-dom", async () => {
    return {
      ...(await vi.importActual("react-router-dom")),
      useRouteLoaderData: vi.fn(),
      Form: vi.fn(({ children, ...props }) => (
        <form {...props}>{children}</form>
      )),
    };
  });

  import.meta.env.VITE_BACKEND_URL = "backend/";
});

beforeEach(() => {
  globalThis.fetch.mockClear();
});

describe("Login", () => {
  test("should display form", () => {
    renderWithRouter(<Login />);

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
    renderWithRouter(<Login />);

    const submitButton = screen.getByText("Zaloguj");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password is empty", async () => {
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });

    const submitButton = screen.getByText("Zaloguj");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should display form errors", async () => {
    useActionData.mockReturnValue({
      errors: ["Nie udało się zalogować!"],
    });
    renderWithRouter(<Login />);
    await fillForm();

    fireEvent.submit(screen.getByRole("form"));

    const error = screen.getByText("Nie udało się zalogować!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should change button text when form is submitting", async () => {
    useNavigation.mockReturnValue({
      state: "submitting",
    });

    renderWithRouter(<Login />);

    expect(screen.getByText("Logowanie...")).toBeInTheDocument();
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
