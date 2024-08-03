import { act, waitFor } from "@testing-library/react";
import AdviceDetails from "./AdviceDetails";
import { beforeAll } from "vitest";
import { useParams } from "react-router";

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
          `{"name": "Nazwa porady", "category": "Zdrowie", "description": "Treść"}`
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
          `{"name": "Nazwa porady", "category": "Zdrowie", "content": "Treść", "rating": "5"}`
        ),
    });

    await act(async () => render(<AdviceDetails />));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
    expect(screen.getByTestId("advice-details-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Nazwa porady"
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Kategoria: Zdrowie"
    );
    expect(screen.getByText("Treść")).toBeInTheDocument();
    expect(screen.getByText("Ocena przydatności: 5")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Oceń jako przydatne" })
    ).toBeInTheDocument();
  });
});
