import SuggestAdvice from "./SuggestAdvice";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { renderWithAuth } from "../../test/test-utils";

beforeEach(() => {
  globalThis.fetch = vi.fn((url) => {
    if (url === "backend/advices/categories") {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            { name: "CATEGORY_1", displayName: "category 1" },
            { name: "CATEGORY_2", displayName: "category 2" },
            { name: "CATEGORY_3", displayName: "category 3" },
          ]),
      });
    }
    if (url === "backend/advices") {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });
    }
    return Promise.reject(new Error("Not Found"));
  });

  vi.mock("../common/form/Captcha", () => ({
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

describe("SuggestAdvice", () => {
  test("should display message when categories are loading", async () => {
    renderWithAuth(<SuggestAdvice />);

    expect(screen.getByText("Ładowanie kategorii...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText("Ładowanie kategorii...")
      ).not.toBeInTheDocument();
    });
  });

  test("should display error when categories failed to load", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    renderWithAuth(<SuggestAdvice />);
    expect(screen.getByText("Ładowanie kategorii...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText("Ładowanie kategorii...")
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("Nie udało się pobrać kategorii!")
      ).toBeInTheDocument();
    });
  });

  test("should display form", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestAdvice />));

    expect(globalThis.fetch).toBeCalledWith("backend/advices/categories", {
      method: "GET",
      headers: { Authorization: "Bearer token" },
    });
    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex flex-col gap-4");
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    expect(screen.getByText("Kategoria")).toBeInTheDocument();
    const categoryOptions = screen.getByRole("combobox");
    expect(categoryOptions).toBeInTheDocument();
    expect(categoryOptions).toHaveLength(3);
    expect(categoryOptions[0]).toHaveValue("CATEGORY_1");
    expect(categoryOptions[0]).toHaveTextContent("category 1");
    expect(categoryOptions[1]).toHaveValue("CATEGORY_2");
    expect(categoryOptions[1]).toHaveTextContent("category 2");
    expect(categoryOptions[2]).toHaveValue("CATEGORY_3");
    expect(categoryOptions[2]).toHaveTextContent("category 3");
    expect(screen.getByText("Treść")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getByRole("combobox")).toBeInTheDocument(1);
    expect(screen.getByRole("button")).toBeInTheDocument();
    const captcha = screen.getByTestId("captcha");
    expect(captcha).toBeInTheDocument();
    expect(captcha).toHaveTextContent("Mock Captcha");
  });

  test("should not send form when name is empty", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const name = screen.getByLabelText("Nazwa porady");
    await waitFor(() => fireEvent.change(name, { target: { value: "" } }));
    expect(name).toHaveValue("");

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
  });

  test("should not send form when name is too long", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const name = screen.getByLabelText("Nazwa porady");
    const tooLongName = "x".repeat(31);
    await waitFor(() =>
      fireEvent.change(name, { target: { value: tooLongName } })
    );
    expect(name).toHaveValue(tooLongName);

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText("Nazwa jest zbyt długa!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should not send form when category is empty", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const category = screen.getByTestId("category");
    await waitFor(() =>
      fireEvent.change(category, {
        target: { value: "" },
      })
    );
    expect(category.target).toBeUndefined();

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
  });

  test("should not send form when content is empty", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const content = screen.getByLabelText("Treść");
    await userEvent.clear(content);
    expect(content).toHaveValue("");

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
  });

  test("should not send form when content is too long", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const content = screen.getByLabelText("Treść");
    const tooLongContent = "x".repeat(1001);
    await waitFor(() =>
      fireEvent.change(content, { target: { value: tooLongContent } })
    );
    expect(content).toHaveValue(tooLongContent);

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText("Treść jest zbyt długa!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should not send form when captcha is not resolved", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    expect(globalThis.fetch).toBeCalledTimes(1);

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText("Captcha nie została rozwiązana poprawnie!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should block submit button and change text when submitting form", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    await fillFormWithDefaultValues();
    globalThis.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );
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
    await act(async () => renderWithAuth(<SuggestAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    await fillFormWithDefaultValues();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText("Nie udało się wysłać propozycji!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display captcha error when server returns captcha validation error", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    await fillFormWithDefaultValues();
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

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText("Wystąpił problem z walidacją Captcha!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display server error when submitting form and response have validation error", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    await fillFormWithDefaultValues();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ message: "Error" }),
      })
    );

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledTimes(1);
    const error = screen.getByText(
      "Nie udało się zapisć propozycji. Walidacja nieudana."
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should send form successfully, display message, display button and hide form", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    await fillFormWithDefaultValues();
    expect(screen.getByRole("form")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(globalThis.fetch).toBeCalledWith("backend/advices", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      method: "POST",
      body: JSON.stringify({
        name: "name",
        category: "CATEGORY_1",
        content: "content",
        captchaToken: "mock-token",
      }),
    });
    const success = screen.getByText("Propozycja została wysłana!");
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass("py-6 text-green-500");
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.getByText("Zaproponuj kolejną poradę")).toBeInTheDocument();
  });

  test("should hide button and success message and display new form when clicking button to suggest new advice", async () => {
    localStorage.setItem("token", "token");
    await act(async () => renderWithAuth(<SuggestAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    await fillFormWithDefaultValues();
    expect(screen.getByRole("form")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    await userEvent.click(screen.getByText("Wyślij propozycję"));
    expect(globalThis.fetch).toBeCalledWith("backend/advices", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      method: "POST",
      body: JSON.stringify({
        name: "name",
        category: "CATEGORY_1",
        content: "content",
        captchaToken: "mock-token",
      }),
    });
    const success = screen.getByText("Propozycja została wysłana!");
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass("py-6 text-green-500");
    expect(screen.queryByRole("form")).toBeNull();
    const newAdviceButton = screen.getByText("Zaproponuj kolejną poradę");
    expect(newAdviceButton).toBeInTheDocument();

    await userEvent.click(newAdviceButton);

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwa porady")).toHaveValue("");
    expect(screen.getByTestId("category")).toHaveValue("CATEGORY_1");
    expect(screen.getByLabelText("Treść")).toHaveValue("");
    expect(success).not.toBeInTheDocument();
    expect(newAdviceButton).not.toBeInTheDocument();
  });

  async function fillFormWithDefaultValues() {
    const name = screen.getByLabelText("Nazwa porady");
    const category = screen.getByTestId("category");
    const content = screen.getByLabelText("Treść");
    await act(async () => {
      fireEvent.change(name, { target: { value: "name" } });
      fireEvent.change(category, { target: { value: "CATEGORY_1" } });
      fireEvent.change(content, { target: { value: "content" } });
    });
    await waitFor(() => expect(name).toHaveValue("name"));
    await waitFor(() => expect(category).toHaveValue("CATEGORY_1"));
    await waitFor(() => expect(content).toHaveValue("content"));
  }
});
