import Ranking from "./Ranking";
import { renderWithRouter } from "../../../test-utils";
import { act, waitFor } from "@testing-library/react";
import { json } from "react-router";
import { beforeAll } from "vitest";

describe("Ranking", () => {
  beforeAll(() => {
    import.meta.env.VITE_BACKEND_URL = "backend/";
  });

  test("should display error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    await act(async () => renderWithRouter(<Ranking />));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się wyświetlić rankingu!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display ranking", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [
          { name: "name 1", category: "HOME", rating: 10 },
          { name: "name 2", category: "HOME", rating: 9 },
          { name: "name 3", category: "HOME", rating: 8 },
          { name: "name 4", category: "HEALTH", rating: 7 },
          { name: "name 5", category: "HEALTH", rating: 6 },
          { name: "name 6", category: "HEALTH", rating: 5 },
          { name: "name 7", category: "HEALTH", rating: 4 },
          { name: "name 8", category: "FINANCES", rating: 3 },
          { name: "name 9", category: "FINANCES", rating: 2 },
          { name: "name 10", category: "FINANCES", rating: 1 },
        ],
      })
    );
    await act(async () => renderWithRouter(<Ranking />));

    const section = screen.getByTestId("ranking-section");
    expect(section).toBeInTheDocument();
    expect(screen.getByText("Top 10 porad")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("Nazwa")).toBeInTheDocument();
    expect(screen.getByText("Kategoria")).toBeInTheDocument();
    expect(screen.getByText("Ocena")).toBeInTheDocument();
    expect(screen.getByText("Szczegóły")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith("backend/advices/ranking");
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(40);
    expect(cells[0]).toHaveTextContent("name 1");
    expect(cells[1]).toHaveTextContent("HOME");
    expect(cells[2]).toHaveTextContent("10");
    expect(cells[3]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[3].querySelector("a")).toHaveAttribute("href", "/TODO");
    expect(cells[36]).toHaveTextContent("name 10");
    expect(cells[37]).toHaveTextContent("FINANCES");
    expect(cells[38]).toHaveTextContent("1");
    expect(cells[39]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[39].querySelector("a")).toHaveAttribute("href", "/TODO");
  });

  test("should display info when ranking is loading", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    renderWithRouter(<Ranking />);
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.queryByText("Ładowanie...")).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Nie udało się wyświetlić rankingu!")
    ).toBeInTheDocument();
  });
});
