import { act, fireEvent, waitFor } from "@testing-library/react";
import PasswordChange from "./PasswordChange";
import { renderWithRouter } from "../../test/test-utils";
const mockedUseNavigate = vi.fn();

describe("PasswordChange", () => {
  beforeAll(() => {
    vi.mock("react-router", async () => {
      const actual = await vi.importActual("react-router");
      return {
        ...actual,
        useParams: () => {
          return {
            token: "token",
          };
        },
        useNavigate: () => mockedUseNavigate,
      };
    });

    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    import.meta.env.VITE_BACKEND_URL = "backend/";
  });

  test("should display password change form", () => {
    renderWithRouter(<PasswordChange />);

    expect(screen.getByTestId("password-change-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Zmiana hasła"
    );
    expect(screen.getByRole("form")).toBeInTheDocument();
    const password = screen.getByLabelText("Nowe hasło");
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute("type", "password");
    expect(password).toBeRequired();
    const submit = screen.getByRole("button");
    expect(submit).toBeInTheDocument();
    expect(submit).toHaveAttribute("type", "submit");
    expect(submit).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
  });

  test("should not submit form when password is empty", async () => {
    renderWithRouter(<PasswordChange />);

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when password is too short", async () => {
    renderWithRouter(<PasswordChange />);
    const password = screen.getByLabelText("Nowe hasło");
    fireEvent.change(password, { target: { value: "pass" } });
    expect(password).toHaveValue("pass");

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not change password when password is invalid", async () => {
    renderWithRouter(<PasswordChange />);
    fillPasswordInput();
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
    const error = screen.getByText(
      "Hasło jest niepoprawne. Pole musi mieć conajmniej 8 znaków, przynajmniej jedną cyfrę, literę i znak specjalny."
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display general error when response is not ok", async () => {
    renderWithRouter(<PasswordChange />);
    fillPasswordInput();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText("Nie udało się zmienić hasła!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display error when link expired", async () => {
    renderWithRouter(<PasswordChange />);
    fillPasswordInput();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ message: "Error: Link expired." }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText("Nie udało się zmienić hasła! Link wygasł.");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should send form successfully", async () => {
    mockedUseNavigate.navigate = vi.fn();
    renderWithRouter(<PasswordChange />);
    const password = screen.getByLabelText("Nowe hasło");
    fireEvent.change(password, { target: { value: "password123!" } });
    expect(password).toHaveValue("password123!");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledWith(
      "backend/auth/account/password-change/token",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: "password123!",
      }
    );
    expect(mockedUseNavigate).toHaveBeenCalledWith("/user/login");
  });

  test("should block submit button and change text when submitting form", async () => {
    await act(async () => render(<PasswordChange />));
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent("Wyślij");
    const password = screen.getByLabelText("Nowe hasło");
    fireEvent.change(password, { target: { value: "password123!" } });
    expect(password).toHaveValue("password123!");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  function fillPasswordInput() {
    const password = screen.getByLabelText("Nowe hasło");
    fireEvent.change(password, { target: { value: "password" } });
    expect(password).toHaveValue("password");
  }
});
