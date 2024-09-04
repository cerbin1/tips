import { act, waitFor } from "@testing-library/react";
import { renderWithAuth, renderWithRouterAndAuth } from "../../test/test-utils";
import AdviceDetails from "./AdviceDetails";

beforeAll(() => {
  vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
      ...actual,
      useParams: () => {
        return {
          adviceId: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
        };
      },
    };
  });

  import.meta.env.VITE_BACKEND_URL = "backend/";
});

beforeEach(() => {
  localStorage.setItem("token", "token");
  localStorage.setItem("userEmail", "test@email");
});

afterEach(() => {
  localStorage.clear();
});

describe("AdviceDetails", () => {
  test("should render component", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(adviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));

    await act(async () => renderWithAuth(<AdviceDetails />));

    expect(screen.getByTestId("advice-details-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Nazwa porady"
    );
    const categorySection = screen.getByRole("heading", { level: 2 });
    expect(categorySection).toHaveTextContent("Kategoria:");
    expect(categorySection).toHaveClass("py-6 cursor-default");
    const categoryName = screen.getByText("Zdrowie");
    expect(categoryName).toBeInTheDocument();
    expect(categoryName).toHaveClass("text-sky-500 text-lg ");
    expect(screen.getByText("Treść")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toHaveClass("text-sky-500 text-lg");
    const rateButton = screen.getByRole("button");
    expect(rateButton).toBeInTheDocument();
    expect(rateButton).toHaveTextContent("Oceń jako przydatne");
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should display info when advice details are loading", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(adviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));

    renderWithAuth(<AdviceDetails />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should display error when advice is not found", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: false });

    await act(async () => renderWithAuth(<AdviceDetails />));

    const error = screen.getByText("Nie znaleziono porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(2);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
  });

  test("should display general error when fetching advice details response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<AdviceDetails />));

    const error = screen.getByText("Nie udało się wyświetlić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(2);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
  });

  test("should display error when fetching user rated advice info response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<AdviceDetails />));

    const error = screen.getByText(
      "Nie udało się pobrać informacji o głosowaniu!"
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(2);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
  });

  test("should rating button not appear when user is not logged in", async () => {
    localStorage.setItem("token", "");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(adviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));

    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));

    expect(screen.getByText("Zaloguj się aby zagłosować")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(2);
  });

  test("should display error when rating advice fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(adviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce({ ok: false });
    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();

    await userEvent.click(screen.getByRole("button"));

    const error = screen.getByText("Nie udało się ocenić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    assertAdviceRatedRequestExecuted();
  });

  test("should block button and change text when rating advice", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(adviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce(ratedAdviceDetailsResponse());
    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Oceń jako przydatne")).toBeEnabled();

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie oceny...")).toBeDisabled();
      expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    });
    expect(screen.getByText("Oceniono")).toBeDisabled();
    expect(screen.getByText("6")).toBeInTheDocument();
    assertAdviceRatedRequestExecuted();
  });

  test("should button be enabled when user did not rate advice", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(adviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));

    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));

    const rateButton = screen.getByRole("button");
    expect(rateButton).toHaveTextContent("Oceń jako przydatne");
    expect(rateButton).toBeEnabled();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should button be disabled and have changed text when user rated advice", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(ratedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(true));

    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));

    const rateButton = screen.getByRole("button");
    expect(rateButton).toHaveTextContent("Oceniono");
    expect(rateButton).toBeDisabled();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should successfully rate advice and display info", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(adviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce(ratedAdviceDetailsResponse());
    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByText("6")).toBeInTheDocument();
    const rateSuccess = screen.getByText("Oceniono poradę.");
    expect(rateSuccess).toBeInTheDocument();
    expect(rateSuccess).toHaveClass("py-6 text-green-500");
    expect(screen.getByText("Oceniono")).toBeDisabled();
    assertAdviceRatedRequestExecuted();
  });
});

function assertFetchAdviceDetailsRequestsExecuted() {
  expect(globalThis.fetch).toBeCalledTimes(2);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
  );
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/rated?userEmail=test@email",
    {
      headers: {
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      },
    }
  );
}

function assertAdviceRatedRequestExecuted() {
  expect(globalThis.fetch).toBeCalledTimes(3);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/rate",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      },
      body: "test@email",
    }
  );
}

function adviceDetailsResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Nazwa porady",
        categoryName: "Health",
        categoryDisplayName: "Zdrowie",
        content: "Treść",
        rating: 5,
      }),
  };
}

function ratedAdviceDetailsResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Nazwa porady",
        categoryName: "Health",
        categoryDisplayName: "Zdrowie",
        content: "Treść",
        rating: 6,
      }),
  };
}

function ratedAdviceResponse(isRated) {
  return {
    ok: true,
    json: () => Promise.resolve({ rated: isRated }),
  };
}
