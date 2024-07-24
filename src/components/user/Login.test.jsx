import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./Login";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const someMock = vi.fn();

describe("Login", () => {
  beforeAll(() => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    vi.mock("react-router", () => {
      return {
        ...vi.importActual("react-router"),
        useNavigate: () => someMock,
      };
    });
  });

  beforeEach(() => {
    globalThis.fetch.mockClear();
  });

  test("should display form", () => {
    render(<Login />);

    expect(screen.getByTestId("login-section")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
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
  });

  test("should not send form when email is empty", async () => {
    render(<Login />);

    const submitButton = screen.getByText("Zaloguj");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password is empty", async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });

    const submitButton = screen.getByText("Zaloguj");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should display general error when response is not ok", async () => {
    render(<Login />);
    await fillForm();
    const loginButton = screen.getByRole("button");
    expect(loginButton).toHaveTextContent("Zaloguj");

    await userEvent.click(loginButton);

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się zalogować!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should send form successfully", async () => {
    render(<Login />);
    expect(screen.getByRole("form")).toBeInTheDocument();
    await fillForm();
    const loginButton = screen.getByRole("button");
    expect(loginButton).toHaveTextContent("Zaloguj");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await userEvent.click(loginButton);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/auth/login",
      {
        body: '{"email":"test@email","password":"password"}',
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    expect(someMock).toHaveBeenCalled();
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
