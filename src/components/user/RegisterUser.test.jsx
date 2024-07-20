import { fireEvent, render, screen } from "@testing-library/react";
import RegisterUser from "../../../RegisterUser";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, expect, vi } from "vitest";

const mockedUseNavigate = vi.fn();

beforeAll(() => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

  vi.mock("react-router", () => {
    return {
      ...vi.importActual("react-router-dom"),
      useNavigate: () => mockedUseNavigate,
    };
  });
});

beforeEach(() => {
  globalThis.fetch.mockClear();
});

describe("RegisterUser", () => {
  test("should display form", () => {
    render(<RegisterUser />);

    expect(screen.getByTestId("register-user-section")).toBeInTheDocument();
    expect(screen.getByText("Rejestracja")).toBeInTheDocument();
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 w-1/3");
    const emailInput = screen.getByLabelText("Adres e-mail");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();
    const usernameInput = screen.getByLabelText("Nazwa użytkownika");
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
    expect(usernameInput).toBeRequired();
    const passwordInput = screen.getByLabelText("Hasło");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("minLength", "8");
    expect(passwordInput).toBeRequired();
    const repeatPasswordInput = screen.getByLabelText("Powtórz hasło");
    expect(repeatPasswordInput).toBeInTheDocument();
    expect(repeatPasswordInput).toHaveAttribute("type", "password");
    expect(repeatPasswordInput).toHaveAttribute("minLength", "8");
    expect(repeatPasswordInput).toBeRequired();
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

  test("should not send form when email is empty", async () => {
    render(<RegisterUser />);

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when username is empty", async () => {
    render(<RegisterUser />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password is empty", async () => {
    render(<RegisterUser />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
      target: { value: "username" },
    });

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password repeat is empty", async () => {
    render(<RegisterUser />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
      target: { value: "username" },
    });
    fireEvent.change(screen.getByLabelText("Hasło"), {
      target: { value: "password" },
    });

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password and password repeat are not equal", async () => {
    render(<RegisterUser />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
      target: { value: "username" },
    });
    fireEvent.change(screen.getByLabelText("Hasło"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Powtórz hasło"), {
      target: { value: "password2" },
    });

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(screen.getByText("Hasła muszą się zgadzać!")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should display general error when response is not ok", async () => {
    render(<RegisterUser />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
      target: { value: "username" },
    });
    fireEvent.change(screen.getByLabelText("Hasło"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Powtórz hasło"), {
      target: { value: "password" },
    });

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się utworzyć użytkownika!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display error when username is already taken", async () => {
    render(<RegisterUser />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
      target: { value: "username" },
    });
    fireEvent.change(screen.getByLabelText("Hasło"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Powtórz hasło"), {
      target: { value: "password" },
    });
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({ message: "Error: Username is already taken." }),
      })
    );

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nazwa użytkownika jest zajęta!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });
});

test("should display error when email is already taken", async () => {
  render(<RegisterUser />);
  fireEvent.change(screen.getByLabelText("Adres e-mail"), {
    target: { value: "test@email" },
  });
  fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
    target: { value: "username" },
  });
  fireEvent.change(screen.getByLabelText("Hasło"), {
    target: { value: "password" },
  });
  fireEvent.change(screen.getByLabelText("Powtórz hasło"), {
    target: { value: "password" },
  });
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      status: 422,
      json: () =>
        Promise.resolve({ message: "Error: Email is already in use." }),
    })
  );

  const submitButton = screen.getByText("Wyślij");
  await userEvent.click(submitButton);

  expect(globalThis.fetch).toHaveBeenCalledOnce();
  const error = screen.getByText("Email jest zajęty!");
  expect(error).toBeInTheDocument();
  expect(error).toHaveClass("py-6 text-red-500");
});

test("should send form successfully", async () => {
  render(<RegisterUser />);
  fireEvent.change(screen.getByLabelText("Adres e-mail"), {
    target: { value: "test@email" },
  });
  fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
    target: { value: "username" },
  });
  fireEvent.change(screen.getByLabelText("Hasło"), {
    target: { value: "password" },
  });
  fireEvent.change(screen.getByLabelText("Powtórz hasło"), {
    target: { value: "password" },
  });
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

  const submitButton = screen.getByText("Wyślij");
  await userEvent.click(submitButton);

  expect(globalThis.fetch).toHaveBeenCalledOnce();
  expect(mockedUseNavigate).toHaveBeenCalledOnce();
});
