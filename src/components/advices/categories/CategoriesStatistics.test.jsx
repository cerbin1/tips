import CategoriesStatistics from "./CategoriesStatistics";
import { renderWithRouter } from "../../../test/test-utils";
import { act, waitFor } from "@testing-library/react";

describe("Categories", () => {
  test("should display errow when there is problem with fetching categories", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );
    await act(async () => renderWithRouter(<CategoriesStatistics />));

    expect(screen.getByText("Kategorie Porad")).toBeInTheDocument();
    const error = screen.getByText("Nie udało się wyświetlić kategorii!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(screen.queryByRole("table")).toBeNull();
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
  });

  test("should display categories", async () => {
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
              advcicesCount: 10,
            },
            {
              id: "4a9fb847-31fb-49bf-8f2e-1f6ccec69eda",
              category: { name: "HEALTH", displayName: "Zdrowie" },
              description: "Porady dotyczące zdrowia i dobrego samopoczucia.",
              advcicesCount: 20,
            },
          ]),
      })
    );
    await act(async () => renderWithRouter(<CategoriesStatistics />));

    const section = screen.getByTestId("categories-section");
    expect(section).toBeInTheDocument();
    expect(screen.getByText("Kategorie Porad")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.getAllByText("Wyświetl szczegóły")).toHaveLength(2);
    expect(screen.getAllByText("Wyświetl szczegóły")[0]).toHaveAttribute(
      "href",
      "/categories/cab77578-7452-4a6d-a52f-f95126bd2dd1"
    );
  });
});
