import { act, waitFor } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";
import { renderWithAuth, renderWithRouterAndAuth } from "../../test/test-utils";
import AdviceDetails from "./AdviceDetails";

describe("AdviceDetails", () => {
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

  afterEach(() => {
    localStorage.clear();
  });

  test("should display error when advice is not found", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404 }));

    await act(async () => renderWithAuth(<AdviceDetails />));

    expect(globalThis.fetch).toBeCalledTimes(2);
    const error = screen.getByText("Nie znaleziono porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display general error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithAuth(<AdviceDetails />));

    expect(globalThis.fetch).toBeCalledTimes(2);
    const error = screen.getByText("Nie udało się wyświetlić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display info when advice details are loading", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(`{"rated": false}`),
      });

    renderWithAuth(<AdviceDetails />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(globalThis.fetch).toBeCalledTimes(2);
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
  });

  test("should display advice details", async () => {
    localStorage.setItem("token", "63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "55"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(`{"rated": false}`),
      });

    await act(async () => renderWithAuth(<AdviceDetails />));

    expect(screen.getByTestId("advice-details-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Nazwa porady"
    );
    const categorySection = screen.getByRole("heading", { level: 2 });
    expect(categorySection).toHaveTextContent("Kategoria:");
    expect(categorySection).toHaveClass("py-6 cursor-default");
    expect(screen.getByText("Zdrowie")).toHaveClass("text-sky-500 text-lg ");
    expect(screen.getByText("Treść")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("55")).toHaveClass("text-sky-500 text-lg");
    const rateButton = screen.getByRole("button");
    expect(rateButton).toHaveTextContent("Oceń jako przydatne");
  });

  test("should rating button not appear when user is not logged in", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(`{"rated": false}`),
      });

    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));

    expect(screen.getByText("Zaloguj się aby zagłosować")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Oceń jako przydatne" })
    ).toBeNull();
  });

  test("should display error when advice rate fails", async () => {
    localStorage.setItem("token", "63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: false,
      });
    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );

    await userEvent.click(screen.getByRole("button"));

    const error = screen.getByText("Nie udało się ocenić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toBeCalledTimes(3);
  });

  test("should block button and change text when rating advice", async () => {
    localStorage.setItem("token", "63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "6"}`
          ),
      });
    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));
    expect(globalThis.fetch).toBeCalledTimes(2);
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Oceń jako przydatne")).toBeEnabled();

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie oceny...")).toBeDisabled();
      expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    });
    expect(screen.getByText("Oceniono")).toBeDisabled();
    expect(globalThis.fetch).toBeCalledTimes(3);
  });

  test("should successfully rate advice and display info", async () => {
    localStorage.setItem("token", "63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(`{"rated": false}`),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "6"}`
          ),
      });
    localStorage.setItem("userEmail", "email@test");
    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));
    expect(globalThis.fetch).toBeCalledTimes(2);
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByText("6")).toBeInTheDocument();
    const rateSuccess = screen.getByText("Oceniono poradę.");
    expect(rateSuccess).toBeInTheDocument();
    expect(rateSuccess).toHaveClass("py-6 text-green-500");
    expect(globalThis.fetch).toBeCalledTimes(3);
    expect(screen.getByText("Oceniono")).toBeDisabled();
  });

  test("should button be enabled when user did not rate advice", async () => {
    localStorage.setItem("token", "63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(`{"rated": false}`),
      });

    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));

    expect(globalThis.fetch).toBeCalledTimes(2);
    const rateButton = screen.getByRole("button");
    expect(rateButton).toHaveTextContent("Oceń jako przydatne");
    expect(rateButton).toBeEnabled();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("should button be disabled and have changed text when user rated advice", async () => {
    localStorage.setItem("token", "63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "6"}`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(`{"rated": true}`),
      });

    await act(async () => renderWithRouterAndAuth(<AdviceDetails />));

    expect(globalThis.fetch).toBeCalledTimes(2);
    const rateButton = screen.getByRole("button");
    expect(rateButton).toHaveTextContent("Oceniono");
    expect(rateButton).toBeDisabled();
    expect(screen.getByText("Ocena przydatności:")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
