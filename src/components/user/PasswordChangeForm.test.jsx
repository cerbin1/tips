import { act, fireEvent, waitFor } from "@testing-library/react";
import PasswordChangeForm from "./PasswordChangeForm";
import { renderWithRouter } from "../../test/test-utils";

const mockedUseNavigate = vi.fn();

describe("PasswordChangeForm", () => {
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

  test("should render component", () => {
    renderWithRouter(<PasswordChangeForm />);

    expect(screen.getByTestId("password-change-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Zmiana hasła"
    );
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 w-1/3");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    const password = screen.getByLabelText("Nowe hasło");
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute("type", "password");
    expect(password).toBeRequired();
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when password is empty", async () => {
    renderWithRouter(<PasswordChangeForm />);

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when password is too short", async () => {
    renderWithRouter(<PasswordChangeForm />);
    const password = screen.getByLabelText("Nowe hasło");
    fireEvent.change(password, { target: { value: "pass" } });
    expect(password).toHaveValue("pass");

    await userEvent.click(screen.getByRole("button"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not change password when password is invalid", async () => {
    renderWithRouter(<PasswordChangeForm />);
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

    const error = screen.getByText(
      "Hasło jest niepoprawne. Pole musi mieć conajmniej 8 znaków, przynajmniej jedną cyfrę, literę i znak specjalny."
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expectChangeRequestWasSentWithPassword("password", globalThis);
  });

  test("should display general error when response is not ok", async () => {
    renderWithRouter(<PasswordChangeForm />);
    fillPasswordInput();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText("Nie udało się zmienić hasła!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expectChangeRequestWasSentWithPassword("password", globalThis);
  });

  test("should display error when link expired", async () => {
    renderWithRouter(<PasswordChangeForm />);
    fillPasswordInput();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ message: "Error: Link expired." }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij"));

    const error = screen.getByText("Nie udało się zmienić hasła! Link wygasł.");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expectChangeRequestWasSentWithPassword("password", globalThis);
  });

  test("should send form successfully", async () => {
    mockedUseNavigate.navigate = vi.fn();
    renderWithRouter(<PasswordChangeForm />);
    const password = screen.getByLabelText("Nowe hasło");
    fireEvent.change(password, { target: { value: "password123!" } });
    expect(password).toHaveValue("password123!");
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await userEvent.click(screen.getByRole("button"));

    expect(mockedUseNavigate).toBeCalledWith("/user/login");
    expectChangeRequestWasSentWithPassword("password123!", globalThis);
  });

  test("should block submit button and change text when submitting form", async () => {
    await act(async () => render(<PasswordChangeForm />));
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
    expect(mockedUseNavigate).toBeCalledWith("/user/login");
    expectChangeRequestWasSentWithPassword("password123!", globalThis);
  });

  function fillPasswordInput() {
    const password = screen.getByLabelText("Nowe hasło");
    fireEvent.change(password, { target: { value: "password" } });
    expect(password).toHaveValue("password");
  }

  function expectChangeRequestWasSentWithPassword(password, globalThis) {
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/auth/account/password-change/token",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: password,
      }
    );
  }
});
