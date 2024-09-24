import { act, fireEvent, waitFor } from "@testing-library/react";
import { renderWithAuth } from "../../test/test-utils";
import SuggestAdvice from "./SuggestAdvice";
import { expect } from "vitest";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

beforeEach(() => {
  localStorage.setItem("token", "token");
  globalThis.fetch = vi.fn((url) => {
    if (url === "backend/categories") {
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
    if (url === "backend/advices/suggested") {
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
});

afterEach(() => {
  localStorage.clear();
  vi.resetAllMocks();
});

describe("SuggestAdvice", () => {
  test("should render component and display form", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));

    expect(screen.getByText("Zaproponuj poradę")).toBeInTheDocument();
    expect(screen.getByRole("form")).toHaveClass(
      "flex flex-col gap-4 text-lg w-1/3"
    );
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
    expect(screen.getByRole("combobox")).toHaveLength(3);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    const nameInput = screen.getByLabelText("Nazwa porady");
    expect(nameInput).toBeRequired();
    expect(nameInput).toHaveAttribute("id", "name");
    expect(nameInput).toHaveAttribute("name", "name");
    expect(nameInput).toHaveAttribute("maxLength", "30");
    const categoryInput = screen.getByLabelText("Kategoria");
    expect(categoryInput).toBeRequired();
    expect(categoryInput).toHaveClass("bg-slate-200 rounded py-2");
    expect(categoryInput).toHaveAttribute("id", "category");
    expect(categoryInput).toHaveAttribute("name", "category");
    const categoryOptions = screen.getByRole("combobox");
    expect(categoryOptions).toHaveLength(3);
    expect(categoryOptions[0]).toHaveValue("CATEGORY_1");
    expect(categoryOptions[1]).toHaveValue("CATEGORY_2");
    expect(categoryOptions[2]).toHaveValue("CATEGORY_3");
    expect(categoryOptions[0]).toHaveTextContent("category 1");
    expect(categoryOptions[1]).toHaveTextContent("category 2");
    expect(categoryOptions[2]).toHaveTextContent("category 3");
    const contentInput = screen.getByLabelText("Treść");
    expect(contentInput).toBeRequired();
    expect(contentInput).toHaveAttribute("id", "content");
    expect(contentInput).toHaveAttribute("name", "content");
    expect(contentInput).toHaveAttribute("maxLength", "1000");
    const sourceInput = screen.getByLabelText("Źródło");
    expect(sourceInput).toHaveAttribute("id", "source");
    expect(sourceInput).toHaveAttribute("name", "source");
    expect(sourceInput).toHaveAttribute("maxLength", "200");
    expect(screen.getByRole("button")).toHaveTextContent("Wyślij propozycję");
    expect(screen.getByTestId("captcha")).toHaveTextContent("Mock Captcha");
    assertFetchCategoriesRequestExecuted();
  });

  test("should not submit form when name is empty", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const name = screen.getByLabelText("Nazwa porady");
    await waitFor(() => fireEvent.change(name, { target: { value: "" } }));
    expect(name).toHaveValue("");

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(screen.queryByText("Propozycja została wysłana!")).toBeNull();
    assertFetchCategoriesRequestExecuted();
  });

  test("should not submit form when name is too long", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const name = screen.getByLabelText("Nazwa porady");
    const tooLongName = "x".repeat(31);
    await waitFor(() =>
      fireEvent.change(name, { target: { value: tooLongName } })
    );
    expect(name).toHaveValue(tooLongName);

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(screen.getByText("Nazwa jest zbyt długa!")).toBeInTheDocument();
    expect(screen.queryByText("Propozycja została wysłana!")).toBeNull();
    assertFetchCategoriesRequestExecuted();
  });

  test("should not submit form when category is empty", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const category = screen.getByLabelText("Kategoria");
    await waitFor(() => fireEvent.change(category, { target: { value: "" } }));
    expect(category.target).toBeUndefined();

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(screen.queryByText("Propozycja została wysłana!")).toBeNull();
    assertFetchCategoriesRequestExecuted();
  });

  test("should not submit form when content is empty", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const content = screen.getByLabelText("Treść");
    await userEvent.clear(content);
    expect(content).toHaveValue("");

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(screen.queryByText("Propozycja została wysłana!")).toBeNull();
    assertFetchCategoriesRequestExecuted();
  });

  test("should not submit form when content is too long", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    await fillFormWithDefaultValues();
    const content = screen.getByLabelText("Treść");
    const tooLongContent = "x".repeat(1001);
    await waitFor(() =>
      fireEvent.change(content, { target: { value: tooLongContent } })
    );
    expect(content).toHaveValue(tooLongContent);

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(screen.getByText("Treść jest zbyt długa!")).toBeInTheDocument();
    expect(screen.queryByText("Propozycja została wysłana!")).toBeNull();
    assertFetchCategoriesRequestExecuted();
  });

  test("should not submit form when captcha is not resolved", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    assertFetchCategoriesRequestExecuted();
    await fillFormWithDefaultValues();

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(
      screen.getByText("Captcha nie została rozwiązana poprawnie!")
    ).toBeInTheDocument();
    expect(screen.queryByText("Propozycja została wysłana!")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
  });

  test("should display message when categories are loading", async () => {
    renderWithAuth(<SuggestAdvice />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("form")).toBeInTheDocument();
    assertFetchCategoriesRequestExecuted();
  });

  test("should display error when categories failed to load", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<SuggestAdvice />));

    expect(
      screen.getByText("Nie udało się pobrać kategorii!")
    ).toBeInTheDocument();
    assertFetchCategoriesRequestExecuted();
  });

  test("should block submit button and change text when submitting form", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    assertFetchCategoriesRequestExecuted();
    await fillFormWithDefaultValues();
    await userEvent.click(screen.getByTestId("captcha"));
    const submitButton = screen.getByText("Wyślij propozycję");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
    expect(globalThis.fetch).toBeCalledTimes(2);
    assertSubmitFormRequestIsExecuted();
  });

  test("should display general error when submitting form and response is not ok", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    assertFetchCategoriesRequestExecuted();
    await fillFormWithDefaultValues();
    await userEvent.click(screen.getByTestId("captcha"));
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(
      screen.getByText("Nie udało się wysłać propozycji!")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    assertSubmitFormRequestIsExecuted();
  });

  test("should display error when submitting form and response have captcha validation error", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    assertFetchCategoriesRequestExecuted();
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

    expect(
      screen.getByText("Wystąpił problem z walidacją Captcha!")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    assertSubmitFormRequestIsExecuted();
  });

  test("should display server error when submitting form and response have validation error", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    assertFetchCategoriesRequestExecuted();
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

    expect(
      screen.getByText("Nie udało się zapisć propozycji. Walidacja nieudana.")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    assertSubmitFormRequestIsExecuted();
  });

  test("should submit form successfully, display message, display button and hide form", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    assertFetchCategoriesRequestExecuted();
    await fillFormWithDefaultValues();
    expect(screen.getByRole("form")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("captcha"));

    await userEvent.click(screen.getByText("Wyślij propozycję"));

    expect(screen.getByText("Propozycja została wysłana!")).toHaveClass(
      "py-6 text-green-500"
    );
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.getByRole("button")).toHaveTextContent(
      "Zaproponuj kolejną poradę"
    );
    expect(globalThis.fetch).toBeCalledTimes(2);
    assertSubmitFormRequestIsExecuted();
  });

  test("should hide button and success message and display new form when clicking button to suggest new advice", async () => {
    await act(async () => renderWithAuth(<SuggestAdvice />));
    assertFetchCategoriesRequestExecuted();
    await fillFormWithDefaultValues();
    expect(screen.getByRole("form")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("captcha"));
    await userEvent.click(screen.getByText("Wyślij propozycję"));
    expect(globalThis.fetch).toBeCalledTimes(2);
    assertSubmitFormRequestIsExecuted();
    expect(screen.queryByRole("form")).toBeNull();
    const success = screen.getByText("Propozycja została wysłana!");
    expect(success).toHaveClass("py-6 text-green-500");
    const newAdviceButton = screen.getByText("Zaproponuj kolejną poradę");

    await userEvent.click(newAdviceButton);

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwa porady")).toHaveValue("");
    expect(screen.getByLabelText("Kategoria")).toHaveValue("CATEGORY_1");
    expect(screen.getByLabelText("Treść")).toHaveValue("");
    expect(success).not.toBeInTheDocument();
    expect(newAdviceButton).not.toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(2);
  });
});

async function fillFormWithDefaultValues() {
  const name = screen.getByLabelText("Nazwa porady");
  const category = screen.getByLabelText("Kategoria");
  const content = screen.getByLabelText("Treść");
  const source = screen.getByLabelText("Źródło");
  fireEvent.change(name, { target: { value: "name" } });
  fireEvent.change(category, { target: { value: "CATEGORY_1" } });
  fireEvent.change(content, { target: { value: "content" } });
  fireEvent.change(source, { target: { value: "source" } });
  await waitFor(() => expect(name).toHaveValue("name"));
  await waitFor(() => expect(category).toHaveValue("CATEGORY_1"));
  await waitFor(() => expect(content).toHaveValue("content"));
  await waitFor(() => expect(source).toHaveValue("source"));
}

function assertFetchCategoriesRequestExecuted() {
  expect(globalThis.fetch).nthCalledWith(1, "backend/categories", {
    headers: { Authorization: "Bearer token" },
  });
}

function assertSubmitFormRequestIsExecuted() {
  expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested", {
    method: "POST",
    headers: {
      Authorization: "Bearer token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "name",
      category: "CATEGORY_1",
      content: "content",
      source: "source",
      captchaToken: "mock-token",
    }),
  });
}
