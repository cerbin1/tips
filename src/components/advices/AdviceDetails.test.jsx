import { act, waitFor } from "@testing-library/react";
import AdviceDetails from "./AdviceDetails";
import { beforeAll } from "vitest";
import { useParams } from "react-router";
import { useRouteLoaderData } from "react-router-dom";
import { renderWithRouter } from "../../test-utils";

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
    vi.mock("react-router-dom", async () => {
      return {
        ...(await vi.importActual("react-router-dom")),
        useRouteLoaderData: vi.fn(),
      };
    });

    import.meta.env.VITE_BACKEND_URL = "backend/";
  });

  test("should display error when advice is not found", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404 }));

    await act(async () => render(<AdviceDetails />));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie znaleziono porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display general error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => render(<AdviceDetails />));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się wyświetlić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display info when advice is loading", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(
          `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
        ),
    });

    render(<AdviceDetails />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
  });

  test("should display advice details", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(
          `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
        ),
    });
    useRouteLoaderData.mockReturnValue("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");

    await act(async () => render(<AdviceDetails />));

    expect(screen.getByTestId("advice-details-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Nazwa porady"
    );
    const category = screen.getByRole("heading", { level: 2 });
    expect(category).toHaveTextContent("Kategoria: Zdrowie");
    expect(category).toHaveClass("py-6");
    expect(screen.getByText("Treść")).toBeInTheDocument();
    const rating = screen.getByText("Ocena przydatności: 5");
    expect(rating).toBeInTheDocument();
    expect(rating).toHaveClass("py-6");
    const rateButton = screen.getByRole("button");
    expect(rateButton).toHaveTextContent("Oceń jako przydatne");
  });

  test("should rating button not appear when user is not logged in", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(
          `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "5"}`
        ),
    });
    useRouteLoaderData.mockReturnValue(null);

    await act(async () => renderWithRouter(<AdviceDetails />));

    expect(screen.getByText("Zaloguj się aby zagłosować")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Oceń jako przydatne" })
    ).toBeNull();
  });

  test("should display error when advice rate fails", async () => {
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
    useRouteLoaderData.mockReturnValue("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    await act(async () => renderWithRouter(<AdviceDetails />));
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );

    await userEvent.click(screen.getByRole("button"));

    const error = screen.getByText("Nie udało się ocenić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  test("should block button and change text when rating advice", async () => {
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
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "6"}`
          ),
      });
    useRouteLoaderData.mockReturnValue("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    await act(async () => renderWithRouter(<AdviceDetails />));
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(screen.getByText("Ocena przydatności: 5")).toBeInTheDocument();
    expect(screen.getByText("Oceń jako przydatne")).toBeEnabled();

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Wysyłanie oceny...")).toBeDisabled();
      expect(screen.queryByText("Oceń jako przydatne")).toBeNull();
    });
    expect(screen.getByText("Oceń jako przydatne")).toBeEnabled();
  });

  test("should successfully rate advice and display info", async () => {
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
        json: () =>
          JSON.parse(
            `{"name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść", "rating": "6"}`
          ),
      });
    useRouteLoaderData.mockReturnValue("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    await act(async () => renderWithRouter(<AdviceDetails />));
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(screen.getByText("Ocena przydatności: 5")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Ocena przydatności: 6")).toBeInTheDocument();
    const rateSuccess = screen.getByText("Oceniono poradę.");
    expect(rateSuccess).toBeInTheDocument();
    expect(rateSuccess).toHaveClass("py-6 text-green-500");
  });
});
