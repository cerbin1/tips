import { act, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../../test/test-utils";
import CategoriesStatistics from "./CategoriesStatistics";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

describe("CategoriesStatistics", () => {
  test("should render component", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "cab77578-7452-4a6d-a52f-f95126bd2dd1",
              category: { name: "HOME", displayName: "Dom" },
              description:
                "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.",
              advicesCount: 10,
            },
            {
              id: "4a9fb847-31fb-49bf-8f2e-1f6ccec69eda",
              category: { name: "HEALTH", displayName: "Zdrowie" },
              description: "Porady dotyczące zdrowia i dobrego samopoczucia.",
              advicesCount: 20,
            },
          ]),
      })
    );
    await act(async () => renderWithRouter(<CategoriesStatistics />));

    expect(screen.getByTestId("categories-section")).toBeInTheDocument();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Kategorie Porad");
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.getAllByRole("cell")).toHaveLength(8);
    expect(screen.getAllByRole("cell")[0]).toHaveTextContent("Dom");
    expect(screen.getAllByRole("cell")[1]).toHaveTextContent(
      "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu."
    );
    expect(screen.getAllByRole("cell")[2]).toHaveTextContent("10");
    expect(screen.getAllByRole("cell")[3]).toHaveTextContent(
      "Wyświetl szczegóły"
    );
    expect(screen.getAllByText("Wyświetl szczegóły")[0]).toHaveAttribute(
      "href",
      "/categories/cab77578-7452-4a6d-a52f-f95126bd2dd1"
    );
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/categories-statistics");
  });

  test("should display info when categories are loading", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "cab77578-7452-4a6d-a52f-f95126bd2dd1",
            category: { name: "HOME", displayName: "Dom" },
            description:
              "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.",
            advicesCount: 10,
          },
          {
            id: "4a9fb847-31fb-49bf-8f2e-1f6ccec69eda",
            category: { name: "HEALTH", displayName: "Zdrowie" },
            description: "Porady dotyczące zdrowia i dobrego samopoczucia.",
            advicesCount: 20,
          },
        ]),
    });
    expect(screen.queryByRole("table")).toBeNull();
    renderWithRouter(<CategoriesStatistics />);
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/categories-statistics");
  });

  test("should display error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithRouter(<CategoriesStatistics />));

    const error = screen.getByText("Nie udało się wyświetlić kategorii!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(screen.queryByRole("table")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/categories-statistics");
  });
});
