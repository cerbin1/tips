import { fireEvent } from "@testing-library/react";
import { renderWithRouter } from "../../test/test-utils";
import Register from "./Register";

beforeAll(() => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

beforeEach(() => {
  globalThis.fetch.mockClear();
});

describe("Register", () => {
  test("should render component and display Register form", () => {
    render(<Register />);

    expect(screen.getByTestId("register-user-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Rejestracja"
    );
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 w-1/3");
    const emailInput = screen.getByLabelText("Adres e-mail");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("id", "email");
    expect(emailInput).toBeRequired();
    const usernameInput = screen.getByLabelText("Nazwa użytkownika");
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
    expect(usernameInput).toHaveAttribute("id", "username");
    expect(usernameInput).toBeRequired();
    const passwordInput = screen.getByLabelText("Hasło");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("id", "password");
    expect(passwordInput).toHaveAttribute("minLength", "8");
    expect(passwordInput).toBeRequired();
    const repeatPasswordInput = screen.getByLabelText("Powtórz hasło");
    expect(repeatPasswordInput).toBeInTheDocument();
    expect(repeatPasswordInput).toHaveAttribute("type", "password");
    expect(repeatPasswordInput).toHaveAttribute("id", "password-repeat");
    expect(repeatPasswordInput).toHaveAttribute("minLength", "8");
    expect(repeatPasswordInput).toBeRequired();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    const resetButton = screen.getByText("Wyczyść formularz");
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveAttribute("type", "reset");
    expect(resetButton).toBeEnabled();
    expect(resetButton).toHaveClass(
      "px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
    );
    const submitButton = screen.getByText("Wyślij");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when email is empty", async () => {
    render(<Register />);
    const submitButton = screen.getByText("Wyślij");
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when username is empty", async () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    const submitButton = screen.getByText("Wyślij");
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when password is empty", async () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText("Adres e-mail"), {
      target: { value: "test@email" },
    });
    fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
      target: { value: "username" },
    });
    const submitButton = screen.getByText("Wyślij");
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when password repeat is empty", async () => {
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
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when username is empty after triming", async () => {
    render(<Register />);
    fillForm();
    fireEvent.change(screen.getByLabelText("Nazwa użytkownika"), {
      target: { value: "   " },
    });
    expect(screen.getByLabelText("Nazwa użytkownika")).toHaveValue("   ");
    const submitButton = screen.getByText("Wyślij");
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    const error = screen.getByText("Nazwa użytkownika nie może być pusta!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when password and password repeat are not equal", async () => {
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
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    const error = screen.getByText("Hasła muszą się zgadzać!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should display error when username is already in use", async () => {
    render(<Register />);
    fillForm();
    mockResponseAs422WithError("Error: Username is already in use.");
    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText("Nazwa użytkownika jest zajęta!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email",
        username: "username",
        password: "password",
        passwordRepeat: "password",
      }),
    });
  });

  test("should display error when email is already in use", async () => {
    render(<Register />);
    fillForm();
    mockResponseAs422WithError("Error: Email is already in use.");

    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText("Email jest zajęty!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email",
        username: "username",
        password: "password",
        passwordRepeat: "password",
      }),
    });
  });

  test("should display error when email is not valid", async () => {
    render(<Register />);
    fillForm();
    mockResponseAs422WithError("Error: Email is not valid.");

    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText("Email jest niepoprawny!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email",
        username: "username",
        password: "password",
        passwordRepeat: "password",
      }),
    });
  });

  test("should display error when password is not valid", async () => {
    render(<Register />);
    fillForm();
    mockResponseAs422WithError("Error: Password is not valid.");

    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText(
      "Hasło jest niepoprawne. Pole musi mieć conajmniej 8 znaków, przynajmniej jedną cyfrę, literę i znak specjalny."
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email",
        username: "username",
        password: "password",
        passwordRepeat: "password",
      }),
    });
  });

  test("should display error when passwords do not match", async () => {
    render(<Register />);
    fillForm();
    mockResponseAs422WithError("Error: Passwords do not match.");

    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText("Hasła musza być takie same!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email",
        username: "username",
        password: "password",
        passwordRepeat: "password",
      }),
    });
  });

  test("should display general error when response is not ok", async () => {
    render(<Register />);
    fillForm();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText("Nie udało się utworzyć użytkownika!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email",
        username: "username",
        password: "password",
        passwordRepeat: "password",
      }),
    });
  });

  test("should register user successfully", async () => {
    renderWithRouter(<Register />);
    expect(screen.getByRole("form")).toBeInTheDocument();

    await fillAndSubmitForm();

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
    const resendLinkButton = screen.getByText("Kliknij tutaj");
    expect(resendLinkButton).toBeInTheDocument();
    expect(resendLinkButton).toHaveRole("button");
    expect(resendLinkButton).toHaveClass("text-blue-to-dark underline");
    expect(
      screen.getByText("jeśli chcesz wysłać ponownie link.")
    ).toBeInTheDocument();
    const loginButton = screen.getByText("Przejdź do logowania");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("href", "/login");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
      body: JSON.stringify({
        email: "test@email",
        username: "username",
        password: "password",
        passwordRepeat: "password",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  });

  test("should display error and hide resend button when resend activation link failed", async () => {
    renderWithRouter(<Register />);
    await fillAndSubmitForm();
    const resendActivationLinkButton = screen.getByText("Kliknij tutaj");
    expect(resendActivationLinkButton).toBeInTheDocument();
    expect(resendActivationLinkButton).toBeEnabled();
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false });

    await userEvent.click(resendActivationLinkButton);

    const error = screen.getByText("Nie udało się ponownie wysłać linka!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(screen.queryByText("Kliknij tutaj")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/auth/resend/63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
  });

  test("should successfully resend activation link and then display info and hide resend button", async () => {
    renderWithRouter(<Register />);
    await fillAndSubmitForm();
    const resendActivationLinkButton = screen.getByText("Kliknij tutaj");
    expect(resendActivationLinkButton).toBeInTheDocument();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await userEvent.click(resendActivationLinkButton);

    expect(
      screen.getByText("Link został wysłany ponownie.")
    ).toBeInTheDocument();
    expect(screen.getByText("Przejdź do logowania")).toBeInTheDocument();
    expect(screen.queryByText("Kliknij tutaj")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/auth/resend/63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
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
  expect(screen.getByLabelText("Adres e-mail")).toHaveValue("test@email");
  expect(screen.getByLabelText("Nazwa użytkownika")).toHaveValue("username");
  expect(screen.getByLabelText("Hasło")).toHaveValue("password");
  expect(screen.getByLabelText("Powtórz hasło")).toHaveValue("password");
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
  expect(globalThis.fetch).toBeCalledTimes(1);
  expect(globalThis.fetch).toBeCalledWith("backend/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "test@email",
      username: "username",
      password: "password",
      passwordRepeat: "password",
    }),
  });
}

function mockResponseAs422WithError(errorMessage) {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: errorMessage }),
    })
  );
}
