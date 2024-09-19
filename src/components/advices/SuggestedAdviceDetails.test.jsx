import { act, waitFor } from "@testing-library/react";
import { renderWithAuth } from "../../test/test-utils";
import SuggestedAdviceDetails from "./SuggestedAdviceDetails";

beforeAll(() => {
  vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
      ...actual,
      useParams: () => {
        return {
          id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
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
  vi.resetAllMocks();
});

describe("SuggestedAdviceDetails", () => {
  test("should render component", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.getByTestId("suggested-advice-details")).toBeInTheDocument();
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
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    const rateDownButton = buttons[0];
    expect(rateDownButton).toBeInTheDocument();
    expect(rateDownButton).toHaveTextContent("Oceń jako nieprzydatne");
    const rateUpButton = buttons[1];
    expect(rateUpButton).toBeInTheDocument();
    expect(rateUpButton).toHaveTextContent("Oceń jako przydatne");
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should display info when suggested advice details are loading", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));

    renderWithAuth(<SuggestedAdviceDetails />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should display error when suggested advice is not found", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: false });

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.getByText("Nie znaleziono porady!")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should display general error when fetching suggested advice details response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(
      screen.getByText("Nie udało się wyświetlić porady!")
    ).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should display error when fetching user rated advice info response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(
      screen.getByText("Nie udało się pobrać informacji o głosowaniu!")
    ).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should rating button not appear when user is not logged in", async () => {
    localStorage.setItem("token", "");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.getByText("Zaloguj się aby zagłosować")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(2);
  });

  test("should display error when rating advice up fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce({ ok: false });
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.queryByText("Nie udało się ocenić porady!")).toBeNull();

    await userEvent.click(screen.getByText("Oceń jako przydatne"));

    expect(
      screen.getByText("Nie udało się ocenić porady!")
    ).toBeInTheDocument();
    assertAdviceRatedRequestExecuted(true);
  });

  test("should display error when rating advice down fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce({ ok: false });
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.queryByText("Nie udało się ocenić porady!")).toBeNull();

    await userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    expect(
      screen.getByText("Nie udało się ocenić porady!")
    ).toBeInTheDocument();
    assertAdviceRatedRequestExecuted(false);
  });

  test("should block button and change text when rating advice up", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce(ratedUpResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Oceń jako przydatne")).toBeEnabled();

    userEvent.click(screen.getByText("Oceń jako przydatne"));

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie oceny...")).toBeDisabled();
      expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    });
    expect(screen.getByText("Oceniono")).toBeDisabled();
    expect(screen.getByText("6")).toBeInTheDocument();
    assertAdviceRatedRequestExecuted(true);
  });

  test("should block button and change text when rating advice down", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce(ratedDownResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Oceń jako nieprzydatne")).toBeEnabled();

    userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie oceny...")).toBeDisabled();
      expect(screen.queryByText("Oceń jako nieprzydatne")).toBeNull();
    });
    expect(screen.getByText("Oceniono")).toBeDisabled();
    expect(screen.getByText("4")).toBeInTheDocument();
    assertAdviceRatedRequestExecuted(false);
  });

  test("should buttons be visible and enabled when user did not rate advice", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    const rateUpButton = screen.getByText("Oceń jako przydatne");
    expect(rateUpButton).toBeEnabled();
    const rateDownButton = screen.getByText("Oceń jako nieprzydatne");
    expect(rateDownButton).toBeEnabled();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should buttons be hidden and display info when user rated advice up", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(ratedUpResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(true));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText("Oceniono poradę.")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should buttons be hidden and display info when user rated advice down", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(ratedDownResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(true));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText("Oceniono poradę.")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should successfully rate advice up and display info", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce(ratedUpResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Oceń jako przydatne"));

    expect(screen.getByText("6")).toBeInTheDocument();
    const rateSuccess = screen.getByText("Ocena podwyższona pomyślnie.");
    expect(rateSuccess).toBeInTheDocument();
    expect(rateSuccess).toHaveClass("py-6 text-green-500");
    expect(screen.getByText("Oceniono")).toBeDisabled();
    assertAdviceRatedRequestExecuted(true);
  });

  test("should successfully rate advice down and display info", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(ratedAdviceResponse(false))
      .mockResolvedValueOnce(ratedDownResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    expect(screen.getByText("4")).toBeInTheDocument();
    const rateSuccess = screen.getByText("Ocena obniżona pomyślnie.");
    expect(rateSuccess).toBeInTheDocument();
    expect(rateSuccess).toHaveClass("py-6 text-green-500");
    expect(screen.getByText("Oceniono")).toBeDisabled();
    assertAdviceRatedRequestExecuted(false);
  });
});

function assertFetchAdviceDetailsRequestsExecuted() {
  expect(globalThis.fetch).toBeCalledTimes(2);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
  );
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/rated?userEmail=test@email",
    {
      headers: {
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      },
    }
  );
}
function suggestedAdviceDetailsResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
        name: "Nazwa porady",
        categoryDisplayName: "Zdrowie",
        content: "Treść",
        rating: 5,
      }),
  };
}

function ratedAdviceResponse(isRated) {
  return {
    ok: true,
    json: () => Promise.resolve({ rated: isRated }),
  };
}

function assertAdviceRatedRequestExecuted(rateType) {
  expect(globalThis.fetch).toBeCalledTimes(3);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/rate?rateType=" +
      rateType,
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

function ratedUpResponse() {
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

function ratedDownResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Nazwa porady",
        categoryName: "Health",
        categoryDisplayName: "Zdrowie",
        content: "Treść",
        rating: 4,
      }),
  };
}
