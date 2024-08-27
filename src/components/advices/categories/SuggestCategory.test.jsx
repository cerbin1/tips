import { act, fireEvent, waitFor } from "@testing-library/react";
import SuggestCategory from "./SuggestCategory";

describe("SuggestCategory", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });
    });

    vi.mock("../../common/Captcha", () => ({
      default: ({ onCaptchaChange }) => {
        const mockToken = "mock-token";
        return (
          <div
            onClick={() => {
              onCaptchaChange(mockToken);
            }}
            data-testid="captcha"
          >
            Mock Captcha
          </div>
        );
      },
    }));
    import.meta.env.VITE_BACKEND_URL = "backend/";
    import.meta.env.VITE_HCAPTCHA_SITE_KEY = "site-key";
    localStorage.setItem("token", "token");
  });

  test("should display form", async () => {
    await act(async () => render(<SuggestCategory />));

    expect(screen.getByText("Zaproponuj kategorię")).toBeInTheDocument();
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4");
    expect(screen.getByText("Nazwa kategorii")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    const captcha = screen.getByTestId("captcha");
    expect(captcha).toBeInTheDocument();
    expect(captcha).toHaveTextContent("Mock Captcha");
  });

  test("should not send form when name is empty", async () => {
    await act(async () => render(<SuggestCategory />));
    expect(screen.getByLabelText("Nazwa kategorii")).toHaveValue("");

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toHaveBeenCalledTimes(0);
  });

  test("should not send form when name is too long", async () => {
    await act(async () => render(<SuggestCategory />));
    const name = screen.getByLabelText("Nazwa kategorii");
    const tooLongName = "x".repeat(101);
    await waitFor(() =>
      fireEvent.change(name, { target: { value: tooLongName } })
    );
    expect(name).toHaveValue(tooLongName);

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toHaveBeenCalledTimes(0);
    const error = screen.getByText("Nazwa jest zbyt długa!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should not send form when captcha is not resolved", async () => {
    await act(async () => render(<SuggestCategory />));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toHaveBeenCalledTimes(0);
    const error = screen.getByText("Captcha nie została rozwiązana poprawnie!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should block submit button and change text when submitting form", async () => {
    await act(async () => render(<SuggestCategory />));
    globalThis.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );
    await fillName();
    await userEvent.click(screen.getByTestId("captcha"));
    const submitButton = screen.getByText("Wyślij propozycję");

    await act(async () => {
      userEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(screen.getByText("Wysyłanie...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  test("should display general error when submitting form and response is not ok", async () => {
    await act(async () => render(<SuggestCategory />));
    await userEvent.click(screen.getByTestId("captcha"));
    await fillName();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const error = screen.getByText("Nie udało się wysłać propozycji!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display captcha error when server returns captcha validation error", async () => {
    await act(async () => render(<SuggestCategory />));
    await fillName();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({ message: "Error: captcha is not valid." }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Wystąpił problem z walidacją Captcha!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display server error when submitting form and response have validation error", async () => {
    await act(async () => render(<SuggestCategory />));
    await fillName();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            message: "Error",
          }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText(
      "Nie udało się zapisć propozycji. Walidacja nieudana."
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should send form successfully, display message, display button and hide form", async () => {
    await act(async () => render(<SuggestCategory />));
    await fillName();
    expect(screen.getByRole("form")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toHaveBeenCalledWith("backend/categories", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      method: "POST",
      body: JSON.stringify({
        name: "name",
        captchaToken: "mock-token",
      }),
    });
    const success = screen.getByText("Propozycja została wysłana!");
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass("py-6 text-green-500");
    expect(screen.queryByRole("form")).toBeNull();
    expect(
      screen.getByText("Zaproponuj kolejną kategorię")
    ).toBeInTheDocument();
  });

  test("should hide button and success message and display new form when clicking button to suggest new category", async () => {
    await act(async () => render(<SuggestCategory />));
    await fillName();
    expect(screen.getByRole("form")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    await userEvent.click(screen.getByText("Wyślij propozycję"));
    expect(globalThis.fetch).toHaveBeenCalledWith("backend/categories", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      method: "POST",
      body: JSON.stringify({
        name: "name",
        captchaToken: "mock-token",
      }),
    });
    const success = screen.getByText("Propozycja została wysłana!");
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass("py-6 text-green-500");
    expect(screen.queryByRole("form")).toBeNull();
    const newCategoryButton = screen.getByText("Zaproponuj kolejną kategorię");
    expect(newCategoryButton).toBeInTheDocument();

    await userEvent.click(newCategoryButton);

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwa kategorii")).toHaveValue("");
    expect(success).not.toBeInTheDocument();
    expect(newCategoryButton).not.toBeInTheDocument();
  });

  async function fillName() {
    const name = screen.getByLabelText("Nazwa kategorii");
    await waitFor(() => fireEvent.change(name, { target: { value: "name" } }));
    expect(name).toHaveValue("name");
  }
});
