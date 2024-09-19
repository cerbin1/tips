import { act, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../../test/test-utils";
import Ranking from "./Ranking";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("Ranking", () => {
  test("should render component", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 1",
            categoryName: "HOME",
            categoryDisplayName: "Dom",
            rating: 10,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 2",
            categoryName: "HOME",
            categoryDisplayName: "Dom",
            rating: 9,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 3",
            categoryName: "HOME",
            categoryDisplayName: "Dom",
            rating: 8,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 4",
            categoryName: "HEALTH",
            categoryDisplayName: "Zdrowie",
            rating: 7,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 5",
            categoryName: "HEALTH",
            categoryDisplayName: "Zdrowie",
            rating: 6,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 6",
            categoryName: "HEALTH",
            categoryDisplayName: "Zdrowie",
            rating: 5,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 7",
            categoryName: "HEALTH",
            categoryDisplayName: "Zdrowie",
            rating: 4,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 8",
            categoryName: "FINANCES",
            categoryDisplayName: "Finanse",
            rating: 3,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 9",
            categoryName: "FINANCES",
            categoryDisplayName: "Finanse",
            rating: 2,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 10",
            categoryName: "FINANCES",
            categoryDisplayName: "Finanse",
            rating: 1,
          },
        ],
      })
    );

    await act(async () => renderWithRouter(<Ranking />));

    expect(screen.getByTestId("ranking-section")).toBeInTheDocument();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Top 10 porad");
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Nazwa");
    expect(screen.getAllByRole("columnheader")[1]).toHaveTextContent(
      "Kategoria"
    );
    expect(screen.getAllByRole("columnheader")[2]).toHaveTextContent("Ocena");
    expect(screen.getAllByRole("columnheader")[3]).toHaveTextContent(
      "Szczegóły"
    );
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(40);
    expect(cells[0]).toHaveTextContent("name 1");
    expect(cells[1]).toHaveTextContent("Dom");
    expect(cells[2]).toHaveTextContent("10");
    expect(cells[3]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[3].querySelector("a")).toHaveAttribute(
      "href",
      "/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
    expect(cells[36]).toHaveTextContent("name 10");
    expect(cells[37]).toHaveTextContent("Finanse");
    expect(cells[38]).toHaveTextContent("1");
    expect(cells[39]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[39].querySelector("a")).toHaveAttribute(
      "href",
      "/advices/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/ranking");
  });

  test("should display info when ranking is loading", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 1",
            categoryName: "HOME",
            categoryDisplayName: "Dom",
            rating: 10,
          },
        ],
      })
    );

    renderWithRouter(<Ranking />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(async () => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getAllByRole("cell")).toHaveLength(4);
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/ranking");
  });

  test("should display error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithRouter(<Ranking />));

    const error = screen.getByText("Nie udało się wyświetlić rankingu!");
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/ranking");
  });
});
