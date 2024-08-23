import CategoryDetails from "./CategoryDetails";
import { renderWithRouter } from "../../../test-utils";
import { act, waitFor } from "@testing-library/react";

beforeAll(() => {
  vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
      ...actual,
      useParams: () => {
        return {
          category: "CATEGORY_1",
        };
      },
    };
  });

  import.meta.env.VITE_BACKEND_URL = "backend/";
});

describe("CategoryDetails", () => {
  test("should display error when fetching advices by category fails ", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => renderWithRouter(<CategoryDetails />));

    const error = screen.getByText("Nie udało się wyświetlić porad!");
    expect(error);
    expect(error).toHaveClass("py-6 text-red-500");
    expect(screen.queryByRole("table")).toBeNull();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices/byCategory/CATEGORY_1"
    );
  });

  test("should display info when advices are loading", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(`{"categoryDisplayName": "Dom",
          "advicesCount": 1,
          "advices": [
            {
              "id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              "name": "name 1",
              "categoryName": "HOME",
              "categoryDisplayName": "Dom",
              "rating": 10
            }
          ]
        }`),
    });
    expect(screen.queryByRole("table")).toBeNull();
    renderWithRouter(<CategoryDetails />);
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("should display category details ", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(`{"categoryDisplayName": "Dom",
          "advicesCount": 1,
          "advices": [
            {
              "id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              "name": "name 1",
              "categoryName": "HOME",
              "categoryDisplayName": "Dom",
              "rating": 10
            },
            {
              "id": "2d55e1da-704d-44cc-a207-bd45f42acb72",
              "name": "name 2",
              "categoryName": "HOME",
              "categoryDisplayName": "Dom",
              "rating": 9
            },
            {
              "id": "bab01121-bd2f-465d-90e5-2000e0a1d95e",
              "name": "name 3",
              "categoryName": "HOME",
              "categoryDisplayName": "Dom",
              "rating": 8
            }
          ]
        }`),
    });
    await act(async () => renderWithRouter(<CategoryDetails />));

    const section = screen.getByTestId("category-details-section");
    expect(section).toBeInTheDocument();
    expect(screen.getByText("Dom")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.queryAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getByText("name 1")).toBeInTheDocument();
    expect(screen.getByText("Dom")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });
});
