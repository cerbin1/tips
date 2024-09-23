import { act, waitFor } from "@testing-library/react";
import SuggestedCategoryDetails from "./SuggestedCategoryDetails";
import { renderWithAuth } from "../../../test/test-utils";

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
});

describe("SuggestedCategoryDetails", () => {
  test("should render component", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false));
    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    expect(
      screen.getByTestId("suggested-category-details")
    ).toBeInTheDocument();
    const categoryName = screen.getByRole("heading", { level: 1 });
    expect(categoryName).toBeInTheDocument();
    expect(categoryName).toHaveTextContent("Nazwa kategorii");
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toHaveClass("text-sky-500 text-lg");
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    const voteDownButton = buttons[0];
    expect(voteDownButton).toBeInTheDocument();
    expect(voteDownButton).toHaveTextContent("Oceń jako nieprzydatne");
    const voteUpButton = buttons[1];
    expect(voteUpButton).toBeInTheDocument();
    expect(voteUpButton).toHaveTextContent("Oceń jako przydatne");
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should display info when suggested category details are loading", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false));

    renderWithAuth(<SuggestedCategoryDetails />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
    expect(screen.getByText("Nazwa kategorii")).toBeInTheDocument();
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should display error when suggested category is not found", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: false });

    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    expect(screen.getByText("Nie znaleziono kategorii!")).toBeInTheDocument();
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should display general error when fetching suggested category details response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    expect(
      screen.getByText("Nie udało się wyświetlić kategorii!")
    ).toBeInTheDocument();
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should display error when fetching user voted category info response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    expect(
      screen.getByText("Nie udało się pobrać informacji o głosowaniu!")
    ).toBeInTheDocument();
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should rating buttons not appear when user is not logged in", async () => {
    localStorage.setItem("token", "");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false));

    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    expect(screen.getByText("Zaloguj się aby zagłosować")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(2);
  });

  test("should display error when rating category up fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false))
      .mockResolvedValueOnce({ ok: false });
    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));
    assertFetchCategoryDetailsRequestsExecuted();
    expect(screen.queryByText("Nie udało się ocenić kategorii!")).toBeNull();

    await userEvent.click(screen.getByText("Oceń jako przydatne"));

    expect(
      screen.getByText("Nie udało się ocenić kategorii!")
    ).toBeInTheDocument();
    assertCategoryVotedRequestExecuted(true);
  });

  test("should display error when rating category down fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false))
      .mockResolvedValueOnce({ ok: false });
    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));
    assertFetchCategoryDetailsRequestsExecuted();
    expect(screen.queryByText("Nie udało się ocenić kategorii!")).toBeNull();

    await userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    expect(
      screen.getByText("Nie udało się ocenić kategorii!")
    ).toBeInTheDocument();
    assertCategoryVotedRequestExecuted(false);
  });

  test("should block button and change text when rating category up", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false))
      .mockResolvedValueOnce(votedUpResponse());
    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));
    assertFetchCategoryDetailsRequestsExecuted();
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
    assertCategoryVotedRequestExecuted(true);
  });

  test("should block button and change text when rating category down", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false))
      .mockResolvedValueOnce(votedDownResponse());
    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));
    assertFetchCategoryDetailsRequestsExecuted();
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
    assertCategoryVotedRequestExecuted(false);
  });

  test("should buttons be visible and enabled when user did not vote category", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false));

    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    const voteUpButton = screen.getByText("Oceń jako przydatne");
    expect(voteUpButton).toBeEnabled();
    const voteDownButton = screen.getByText("Oceń jako nieprzydatne");
    expect(voteDownButton).toBeEnabled();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should buttons be hidden and display info when user voted category up", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(votedUpResponse())
      .mockResolvedValueOnce(votedCategoryResponse(true));

    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText("Oceniono kategorię.")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should buttons be hidden and display info when user voted category down", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(votedDownResponse())
      .mockResolvedValueOnce(votedCategoryResponse(true));

    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText("Oceniono kategorię.")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    assertFetchCategoryDetailsRequestsExecuted();
  });

  test("should successfully vote category up and display info", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false))
      .mockResolvedValueOnce(votedUpResponse());
    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));
    assertFetchCategoryDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Oceń jako przydatne"));

    expect(screen.getByText("6")).toBeInTheDocument();
    const voteSuccess = screen.getByText("Ocena podwyższona pomyślnie.");
    expect(voteSuccess).toBeInTheDocument();
    expect(voteSuccess).toHaveClass("py-6 text-green-500");
    expect(screen.getByText("Oceniono")).toBeDisabled();
    assertCategoryVotedRequestExecuted(true);
  });

  test("should successfully vote category down and display info", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedCategoryDetailsResponse())
      .mockResolvedValueOnce(votedCategoryResponse(false))
      .mockResolvedValueOnce(votedDownResponse());
    await act(async () => renderWithAuth(<SuggestedCategoryDetails />));
    assertFetchCategoryDetailsRequestsExecuted();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    expect(screen.getByText("4")).toBeInTheDocument();
    const voteSuccess = screen.getByText("Ocena obniżona pomyślnie.");
    expect(voteSuccess).toBeInTheDocument();
    expect(voteSuccess).toHaveClass("py-6 text-green-500");
    expect(screen.getByText("Oceniono")).toBeDisabled();
    assertCategoryVotedRequestExecuted(false);
  });
});

function suggestedCategoryDetailsResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
        name: "Nazwa kategorii",
        rating: 5,
      }),
  };
}

function assertFetchCategoryDetailsRequestsExecuted() {
  expect(globalThis.fetch).toBeCalledTimes(2);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/categories/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
  );
  expect(globalThis.fetch).toBeCalledWith(
    "backend/categories/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/vote/check?userEmail=test@email",
    {
      headers: {
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      },
    }
  );
}

function votedCategoryResponse(isVoted) {
  return {
    ok: true,
    json: () => Promise.resolve({ voted: isVoted }),
  };
}

function assertCategoryVotedRequestExecuted(voteType) {
  expect(globalThis.fetch).toBeCalledTimes(3);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/categories/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/vote?voteType=" +
      voteType,
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

function votedUpResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Nazwa kategorii",
        rating: 6,
      }),
  };
}

function votedDownResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Nazwa kategorii",
        rating: 4,
      }),
  };
}
