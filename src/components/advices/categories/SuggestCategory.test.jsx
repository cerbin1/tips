import { act, fireEvent, waitFor } from "@testing-library/react";
import { renderWithAuth } from "../../../test/test-utils";
import SuggestCategory from "./SuggestCategory";

beforeEach(() => {
  globalThis.fetch = vi.fn(() => {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });
  });

  vi.mock("../../common/form/Captcha", () => ({
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
});

afterEach(() => {
  localStorage.clear();
});
describe("SuggestCategory", () => {
  test("should render component", async () => {
    await act(async () => renderWithAuth(<SuggestCategory />));

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Zaproponuj kategorię");
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4 text-lg w-1/3");
    expect(screen.getByText("Nazwa kategorii")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    const captcha = screen.getByTestId("captcha");
    expect(captcha).toBeInTheDocument();
    expect(captcha).toHaveTextContent("Mock Captcha");
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    const nameInput = screen.getByLabelText("Nazwa kategorii");
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toBeRequired();
    expect(nameInput).toHaveAttribute("id", "name");
    expect(nameInput).toHaveAttribute("name", "name");
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when name is empty", async () => {
    await act(async () => renderWithAuth(<SuggestCategory />));
    expect(screen.getByLabelText("Nazwa kategorii")).toHaveValue("");

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when name is too long", async () => {
    await act(async () => renderWithAuth(<SuggestCategory />));
    const name = screen.getByLabelText("Nazwa kategorii");
    const tooLongName = "x".repeat(101);
    await waitFor(() =>
      fireEvent.change(name, { target: { value: tooLongName } })
    );
    expect(name).toHaveValue(tooLongName);

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    const error = screen.getByText("Nazwa jest zbyt długa!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should not submit form when captcha is not resolved", async () => {
    await act(async () => renderWithAuth(<SuggestCategory />));
    await fillName();

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    const error = screen.getByText("Captcha nie została rozwiązana poprawnie!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(0);
  });

  test("should block submit button and change text when submitting form", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestCategory />));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
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
    assertSubmitFormRequestExecuted();
  });

  test("should display error when submitting form and response is not ok", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestCategory />));
    await userEvent.click(screen.getByTestId("captcha"));
    await fillName();
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    const error = screen.getByText("Nie udało się wysłać propozycji!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    assertSubmitFormRequestExecuted();
  });

  test("should display error when server returns captcha validation error", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestCategory />));
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

    const error = screen.getByText("Wystąpił problem z walidacją Captcha!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    assertSubmitFormRequestExecuted();
  });

  test("should display error when submitting form and response have validation error", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestCategory />));
    await fillName();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ message: "Error" }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    const error = screen.getByText(
      "Nie udało się zapisć propozycji. Walidacja nieudana."
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    assertSubmitFormRequestExecuted();
  });

  test("should submit form successfully, display message and button and hide form", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestCategory />));
    await fillName();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Wyślij propozycję");
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    const success = screen.getByText("Propozycja została wysłana!");
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass("py-6 text-green-500");
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.getByRole("button")).toHaveTextContent(
      "Zaproponuj kolejną kategorię"
    );
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/categories", {
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
  });

  test("should hide button and success message and display new form when clicking button to suggest new category", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestCategory />));
    await fillName();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Wyślij propozycję");
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    await userEvent.click(screen.getByText("Wyślij propozycję"));
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/categories", {
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
    expect(screen.getByRole("button")).toHaveTextContent("Wyślij propozycję");
  });
});

async function fillName() {
  const name = screen.getByLabelText("Nazwa kategorii");
  await waitFor(() => fireEvent.change(name, { target: { value: "name" } }));
  expect(name).toHaveValue("name");
}

function assertSubmitFormRequestExecuted() {
  expect(globalThis.fetch).toBeCalledTimes(1);
  expect(globalThis.fetch).toBeCalledWith("backend/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    },
    body: JSON.stringify({ name: "name", captchaToken: "mock-token" }),
  });
}
