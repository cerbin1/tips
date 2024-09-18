import Suggestions from "./Suggestions";
import { renderWithRouter } from "../../test/test-utils";
import { act, waitFor } from "@testing-library/react";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("Suggestions", () => {
  test("should render component", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 1",
            category: { name: "HOME", displayName: "Dom" },
            content: "Treść",
            creatorId: "1",
            rating: 3,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 2",
            category: { name: "Health", displayName: "Zdrowie" },
            content: "Treść",
            creatorId: "2",
            rating: 2,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 3",
            category: { name: "Finances", displayName: "Finanse" },
            content: "Treść",
            creatorId: "3",
            rating: 1,
          },
        ],
      })
    );
    await act(async () => renderWithRouter(<Suggestions />));

    expect(screen.getByTestId("suggestions")).toBeInTheDocument();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Propozycje porad");
    const changeTypeButton = screen.getByText("Przejdź do kategorii");
    expect(changeTypeButton).toBeInTheDocument();
    expect(changeTypeButton).toHaveClass("text-blue-to-light cursor-pointer");
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Nazwa");
    expect(screen.getAllByRole("columnheader")[1]).toHaveTextContent(
      "Kategoria"
    );
    expect(screen.getAllByRole("columnheader")[2]).toHaveTextContent("Ocena");
    expect(screen.getAllByRole("columnheader")[3]).toHaveTextContent(
      "Szczegóły"
    );
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(12);
    expect(cells[0]).toHaveTextContent("name 1");
    expect(cells[1]).toHaveTextContent("Dom");
    expect(cells[2]).toHaveTextContent("3");
    expect(cells[3]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[3].querySelector("a")).toHaveAttribute(
      "href",
      "/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
    expect(cells[8]).toHaveTextContent("name 3");
    expect(cells[9]).toHaveTextContent("Finanse");
    expect(cells[10]).toHaveTextContent("1");
    expect(cells[11]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[11].querySelector("a")).toHaveAttribute(
      "href",
      "/advices/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested");
  });

  test("should display info when there are no suggested advices", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [],
      })
    );

    await act(async () => renderWithRouter(<Suggestions />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Brak propozycji porad.")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested");
  });

  test("should display info when suggested advices are loading", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 1",
            category: { name: "Health", displayName: "Zdrowie" },
            content: "Treść",
            creatorId: "1",
            rating: 3,
          },
        ],
      })
    );

    renderWithRouter(<Suggestions />);

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
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested");
  });

  test("should display error when fetching suggested advices response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithRouter(<Suggestions />));

    const error = screen.getByText(
      "Nie udało się wyświetlić proponowanych porad!"
    );
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested");
  });

  test("should display suggested categories after button click", async () => {
    await act(async () => renderWithRouter(<Suggestions />));
    expect(screen.getByText("Propozycje porad")).toBeInTheDocument();
    expect(screen.queryByText("Propozycje kategorii")).toBeNull();
    expect(screen.getByText("Przejdź do kategorii")).toBeInTheDocument();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 1",
            rating: 3,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 2",
            rating: 2,
          },
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 3",
            rating: 1,
          },
        ],
      })
    );

    await act(async () => screen.getByText("Przejdź do kategorii").click());

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Nazwa");
    expect(screen.getAllByRole("columnheader")[1]).toHaveTextContent("Ocena");
    expect(screen.getAllByRole("columnheader")[2]).toHaveTextContent(
      "Szczegóły"
    );
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(9);
    expect(cells[0]).toHaveTextContent("name 1");
    expect(cells[1]).toHaveTextContent("3");
    expect(cells[2]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[2].querySelector("a")).toHaveAttribute(
      "href",
      "/categories/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
    expect(cells[6]).toHaveTextContent("name 3");
    expect(cells[7]).toHaveTextContent("1");
    expect(cells[8]).toHaveTextContent("Wyświetl szczegóły");
    expect(cells[8].querySelector("a")).toHaveAttribute(
      "href",
      "/categories/suggested/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"
    );
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/categories/suggested"
    );
  });

  test("should display info when there are no suggested categories", async () => {
    await act(async () => renderWithRouter(<Suggestions />));
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [],
      })
    );

    // screen.getByText("Przejdź do kategorii").click();
    act(() => screen.getByText("Przejdź do kategorii").click());
    waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Propozycje kategorii")).toBeInTheDocument();
    expect(screen.getByText("Brak propozycji kategorii.")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/categories/suggested"
    );
  });

  test("should display info when suggested categories are loading", async () => {
    renderWithRouter(<Suggestions />);
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => [
          {
            id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
            name: "name 1",
            rating: 3,
          },
        ],
      })
    );

    act(() => screen.getByText("Przejdź do kategorii").click());
    waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByText("Przejdź do porad")).toBeInTheDocument();
      expect(screen.queryByText("Przejdź do kategorii")).toBeNull();
    });
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getAllByRole("row")).toHaveLength(2);
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(3);
    expect(cells[0]).toHaveTextContent("name 1");
    expect(cells[1]).toHaveTextContent("3");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/categories/suggested"
    );
  });

  test("should display error when fetching suggested categories response is not ok", async () => {
    renderWithRouter(<Suggestions />);
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    screen.getByText("Przejdź do kategorii").click();
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });

    const error = screen.getByText(
      "Nie udało się wyświetlić proponowanych kategorii!"
    );
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices/categories/suggested"
    );
  });
});
