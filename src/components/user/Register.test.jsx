import { fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithRouter } from "../../test-utils";
import Register from "./Register";

beforeAll(() => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

beforeEach(() => {
  globalThis.fetch.mockClear();
});

describe("Register", () => {
  test("should display form", () => {
    render(<Register />);

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
    render(<Register />);

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when username is empty", async () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not send form when password is empty", async () => {
    render(<Register />);
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

  test("should not send form when password is invalid", async () => {
    render(<Register />);
    fillForm();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({ message: "Error: Password is not valid." }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(
      screen.getByText(
        "Hasło jest niepoprawne. Pole musi mieć conajmniej 8 znaków, przynajmniej jedną cyfrę, literę i znak specjalny."
      )
    ).toBeInTheDocument();
  });

  test("should not send form when password repeat is empty", async () => {
    render(<Register />);
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
    render(<Register />);
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
    render(<Register />);
    fillForm();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij"));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się utworzyć użytkownika!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display error when username is already taken", async () => {
    render(<Register />);
    fillForm();
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

  test("should display error when passwords do not match", async () => {
    render(<Register />);
    fillForm();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({ message: "Error: Passwords do not match." }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij"));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Hasła musza być takie same!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display error when email is already taken", async () => {
    render(<Register />);
    fillForm();
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

  test("should display error when email is invalid", async () => {
    render(<Register />);
    fillForm();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ message: "Error: Email is not valid." }),
      })
    );

    const submitButton = screen.getByText("Wyślij");
    await userEvent.click(submitButton);

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Email jest niepoprawny!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should send form successfully", async () => {
    renderWithRouter(<Register />);
    expect(screen.getByRole("form")).toBeInTheDocument();

    await fillAndSubmitForm();

    expect(globalThis.fetch).toHaveBeenCalledWith("backend/auth/register", {
      body: '{"email":"test@email","username":"username","password":"password","passwordRepeat":"password"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.getAllByRole("generic").at(2)).toHaveClass(
      "my-4 py-2 px-8 border border-cyan-200 radius-2xl text-green-600 leading-loose"
    );
    expect(
      screen.getByText("Rejestracja przebiegła pomyślnie.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Na Twój adres e-mail został wysłany link aktywacyjny.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Link wygaśnie po 15 minutach.")
    ).toBeInTheDocument();
    const button = screen.getByText("Kliknij tutaj");
    expect(button).toBeInTheDocument();
    expect(button).toHaveRole("button");
    expect(button).toHaveClass("text-blue-to-dark underline");
    expect(
      screen.getByText("jeśli chcesz wysłać ponownie link.")
    ).toBeInTheDocument();
    const loginButton = screen.getByText("Przejdź do logowania");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("href", "/login");
  });

  test("should display error and hide resend button when resend activation link failed", async () => {
    renderWithRouter(<Register />);
    await fillAndSubmitForm();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const resendActivationLinkButton = screen.getByText("Kliknij tutaj");
    expect(resendActivationLinkButton).toBeInTheDocument();

    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    await userEvent.click(resendActivationLinkButton);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/auth/resend/63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    const error = screen.getByText("Nie udało się ponownie wysłać linka!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(screen.queryByText("Kliknij tutaj")).toBeNull();
  });

  test("should successfully resend activation link and then display info and hide resend button", async () => {
    renderWithRouter(<Register />);
    await fillAndSubmitForm();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const resendActivationLinkButton = screen.getByText("Kliknij tutaj");
    expect(resendActivationLinkButton).toBeInTheDocument();

    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    await userEvent.click(resendActivationLinkButton);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/auth/resend/63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    expect(
      screen.getByText("Link został wysłany ponownie.")
    ).toBeInTheDocument();
    expect(screen.getByText("Przejdź do logowania")).toBeInTheDocument();
    expect(screen.queryByText("Kliknij tutaj")).toBeNull();
  });
});

function fillForm() {
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
}

async function fillAndSubmitForm() {
  fillForm();
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve("63b4072b-b8c8-4f9a-acf4-76d0948adc6e"),
    })
  );
  await userEvent.click(screen.getByText("Wyślij"));
}
