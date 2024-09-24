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
      .mockResolvedValueOnce(votedAdviceResponse(false));
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.getByTestId("suggested-advice-details")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Nazwa porady"
    );
    const categorySection = screen.getByRole("heading", { level: 2 });
    expect(categorySection).toHaveTextContent("Kategoria:");
    expect(categorySection).toHaveClass("py-6 cursor-default");
    expect(screen.getByText("Zdrowie")).toHaveClass("text-sky-500 text-lg ");
    expect(screen.getByText("Treść")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toHaveClass("text-sky-500 text-lg");
    const sourceHeading = screen.getByText("Źródło:");
    expect(sourceHeading).toHaveRole("heading", { level: 3 });
    expect(screen.getByText("Pokaż źródło")).toHaveClass(
      "text-sky-500 cursor-pointer"
    );
    expect(screen.queryByText("Źródło porady")).toBeNull();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    const voteDownButton = buttons[0];
    expect(voteDownButton).toHaveTextContent("Oceń jako nieprzydatne");
    const voteUpButton = buttons[1];
    expect(voteUpButton).toHaveTextContent("Oceń jako przydatne");
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should display info when suggested advice details are loading", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false));

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

  test("should display error when fetching user voted advice info response is not ok", async () => {
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
      .mockResolvedValueOnce(votedAdviceResponse(false));

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
      .mockResolvedValueOnce(votedAdviceResponse(false))
      .mockResolvedValueOnce({ ok: false });
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.queryByText("Nie udało się ocenić porady!")).toBeNull();

    await userEvent.click(screen.getByText("Oceń jako przydatne"));

    expect(
      screen.getByText("Nie udało się ocenić porady!")
    ).toBeInTheDocument();
    assertAdviceVotedRequestExecuted(true);
  });

  test("should display error when rating advice down fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false))
      .mockResolvedValueOnce({ ok: false });
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    expect(screen.queryByText("Nie udało się ocenić porady!")).toBeNull();

    await userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    expect(
      screen.getByText("Nie udało się ocenić porady!")
    ).toBeInTheDocument();
    assertAdviceVotedRequestExecuted(false);
  });

  test("should block button and change text when rating advice up", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false))
      .mockResolvedValueOnce(votedUpResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    assertAdviceNotVoted();

    userEvent.click(screen.getByText("Oceń jako przydatne"));

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie oceny...")).toBeDisabled();
      expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    });
    expect(screen.getByText("Oceniono")).toBeDisabled();
    expect(screen.getByText("6")).toBeInTheDocument();
    assertAdviceVotedRequestExecuted(true);
  });

  test("should block button and change text when rating advice down", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false))
      .mockResolvedValueOnce(votedDownResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    assertAdviceNotVoted();

    userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie oceny...")).toBeDisabled();
      expect(screen.queryByText("Oceń jako nieprzydatne")).toBeNull();
    });
    expect(screen.getByText("Oceniono")).toBeDisabled();
    expect(screen.getByText("4")).toBeInTheDocument();
    assertAdviceVotedRequestExecuted(false);
  });

  test("should buttons be visible and enabled when user did not vote advice", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    assertAdviceNotVoted();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should buttons be hidden and display info when user voted advice up", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(votedUpResponse())
      .mockResolvedValueOnce(votedAdviceResponse(true));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText("Oceniono poradę.")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should buttons be hidden and display info when user voted advice down", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(votedDownResponse())
      .mockResolvedValueOnce(votedAdviceResponse(true));

    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText("Oceniono poradę.")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    assertFetchAdviceDetailsRequestsExecuted();
  });

  test("should successfully vote advice up and display info", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false))
      .mockResolvedValueOnce(votedUpResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    assertAdviceNotVoted();

    await userEvent.click(screen.getByText("Oceń jako przydatne"));

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("Ocena podwyższona pomyślnie.")).toHaveClass(
      "py-6 text-green-500"
    );
    expect(screen.getByText("Oceniono")).toBeDisabled();
    assertAdviceVotedRequestExecuted(true);
  });

  test("should successfully vote advice down and display info", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false))
      .mockResolvedValueOnce(votedDownResponse());
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    assertAdviceNotVoted();

    await userEvent.click(screen.getByText("Oceń jako nieprzydatne"));

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Ocena obniżona pomyślnie.")).toHaveClass(
      "py-6 text-green-500"
    );
    expect(screen.getByText("Oceniono")).toBeDisabled();
    assertAdviceVotedRequestExecuted(false);
  });

  test("should show source on button click", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(suggestedAdviceDetailsResponse())
      .mockResolvedValueOnce(votedAdviceResponse(false));
    await act(async () => renderWithAuth(<SuggestedAdviceDetails />));
    assertFetchAdviceDetailsRequestsExecuted();
    const showSourceButton = screen.getByText("Pokaż źródło");
    expect(screen.queryByText("Źródło porady")).toBeNull();

    await userEvent.click(showSourceButton);

    expect(screen.getByText("Źródło porady")).toBeInTheDocument();
  });
});

function assertFetchAdviceDetailsRequestsExecuted() {
  expect(globalThis.fetch).toBeCalledTimes(2);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
  );
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/vote/check?userEmail=test@email",
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
        source: "Źródło porady",
        rating: 5,
      }),
  };
}

function votedAdviceResponse(isVoted) {
  return {
    ok: true,
    json: () => Promise.resolve({ voted: isVoted }),
  };
}

function assertAdviceVotedRequestExecuted(voteType) {
  expect(globalThis.fetch).toBeCalledTimes(3);
  expect(globalThis.fetch).toBeCalledWith(
    "backend/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e/vote?voteType=" +
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
        name: "Nazwa porady",
        categoryName: "Health",
        categoryDisplayName: "Zdrowie",
        content: "Treść",
        rating: 6,
      }),
  };
}

function votedDownResponse() {
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

function assertAdviceNotVoted() {
  expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
  expect(screen.getByText("5")).toBeInTheDocument();
  expect(screen.getByText("Oceń jako nieprzydatne")).toBeEnabled();
  expect(screen.getByText("Oceń jako przydatne")).toBeEnabled();
}
