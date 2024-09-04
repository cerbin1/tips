import { act, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../../test/test-utils";
import CategoryDetails from "./CategoryDetails";

beforeAll(() => {
  vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
      ...actual,
      useParams: () => {
        return {
          categoryId: "342c97ec-e00a-4ccb-b235-b6d22fe34c56",
        };
      },
    };
  });

  import.meta.env.VITE_BACKEND_URL = "backend/";
});

describe("CategoryDetails", () => {
  test("should render component ", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => ({
          categoryDisplayName: "Dom",
          description: "Opis",
          advices: [
            {
              id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              name: "nazwa 1",
              categoryName: "HOME",
              categoryDisplayName: "Dom",
              content: "treść 1",
              rating: 10,
            },
            {
              id: "2d55e1da-704d-44cc-a207-bd45f42acb72",
              name: "nazwa 2",
              categoryName: "HOME",
              categoryDisplayName: "Dom",
              content: "treść 2",
              rating: 9,
            },
            {
              id: "bab01121-bd2f-465d-90e5-2000e0a1d95e",
              name: "nazwa 3",
              categoryName: "HOME",
              categoryDisplayName: "Dom",
              content: "treść 3",
              rating: 8,
            },
          ],
        }),
      })
    );

    await act(async () => renderWithRouter(<CategoryDetails />));

    expect(screen.getByTestId("category-details-section")).toBeInTheDocument();
    const categoryName = screen.getByRole("heading", { level: 1 });
    expect(categoryName).toBeInTheDocument();
    expect(categoryName).toHaveTextContent("Dom");
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Opis")).toBeInTheDocument();
    expect(screen.getByText("Liczba wszystkich porad: 3")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getAllByRole("cell")).toHaveLength(9);
    expect(screen.getByText("Dom")).toBeInTheDocument();
    expect(screen.getByText("nazwa 1")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/categories/342c97ec-e00a-4ccb-b235-b6d22fe34c56"
    );
  });

  test("should display info when advices are loading", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            categoryDisplayName: "Dom",
            description: "Opis",
            advices: [
              {
                id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
                name: "nazwa 1",
                categoryName: "HOME",
                categoryDisplayName: "Dom",
                content: "treść",
                rating: 10,
              },
            ],
          }),
      })
    );
    expect(screen.queryByRole("table")).toBeNull();
    renderWithRouter(<CategoryDetails />);
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/categories/342c97ec-e00a-4ccb-b235-b6d22fe34c56"
    );
  });

  test("should display error when fetching advices by category fails ", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }));

    await act(async () => renderWithRouter(<CategoryDetails />));

    const error = screen.getByText("Nie udało się wyświetlić porad!");
    expect(error);
    expect(error).toHaveClass("py-6 text-red-500");
    expect(screen.queryByRole("table")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/categories/342c97ec-e00a-4ccb-b235-b6d22fe34c56"
    );
  });

  test("should display error when response is not ok ", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => renderWithRouter(<CategoryDetails />));

    const error = screen.getByText("Nie udało się wyświetlić porad!");
    expect(error);
    expect(error).toHaveClass("py-6 text-red-500");
    expect(screen.queryByRole("table")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/categories/342c97ec-e00a-4ccb-b235-b6d22fe34c56"
    );
  });
});
