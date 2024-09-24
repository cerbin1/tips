import { act, waitFor } from "@testing-library/react";
import { renderWithAuth, renderWithRouterAndAuth } from "../../test/test-utils";
import Profile from "./Profile";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
  localStorage.setItem("token", "token");
  localStorage.setItem("userEmail", "test@test");
});

afterEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  localStorage.clear();
});

describe("Profile", () => {
  test("should render component", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              name: "Nazwa ocenionej porady",
              categoryName: "Health",
              categoryDisplayName: "Zdrowie",
              content: "Treść",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              name: "Nazwa ocenionej proponowanej porady",
              categoryDisplayName: "Zdrowie",
              content: "Treść",
              ranking: 1,
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "00d0b44a-f701-4172-966e-cca3aec454dc",
              name: "Nazwa proponowanej porady",
              category: { name: "Health", displayName: "Zdrowie" },
              content: "Treść",
              creatorId: "1",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "5131ba80-4d83-42ef-a8e9-e7bcab17b019",
              name: "Nazwa proponowanej kategorii",
              creatorId: "1",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "5131ba80-4d83-42ef-a8e9-e7bcab17b019",
              name: "Nazwa ocenionej proponowanej kategorii",
              rating: "1",
            },
          ]),
      });

    await act(async () => renderWithRouterAndAuth(<Profile />));

    expect(screen.getByTestId("profile-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Profil"
    );
    expect(screen.getAllByRole("table")).toHaveLength(5);
    expect(screen.getAllByRole("row")).toHaveLength(10);
    expect(screen.getAllByRole("columnheader")).toHaveLength(12);
    expect(screen.getByText("Ocenione porady:")).toBeInTheDocument();
    expect(screen.getAllByRole("table")[0]).toHaveTextContent(
      "Nazwa ocenionej porady"
    );
    expect(screen.getAllByRole("table")[0]).toHaveTextContent("Zdrowie");
    expect(
      screen.getByText("Ocenione proponowane porady:")
    ).toBeInTheDocument();
    expect(screen.getAllByRole("table")[1]).toHaveTextContent(
      "Nazwa ocenionej proponowanej porady"
    );
    expect(screen.getAllByRole("table")[1]).toHaveTextContent("Zdrowie");
    expect(screen.getByText("Proponowane porady:")).toBeInTheDocument();
    expect(screen.getAllByRole("table")[2]).toHaveTextContent(
      "Nazwa proponowanej porady"
    );
    expect(screen.getAllByRole("table")[2]).toHaveTextContent("Zdrowie");
    expect(screen.getByText("Proponowane kategorie:")).toBeInTheDocument();
    expect(screen.getAllByRole("table")[3]).toHaveTextContent(
      "Nazwa proponowanej kategorii"
    );
    expect(screen.getAllByRole("table")[4]).toHaveTextContent(
      "Nazwa ocenionej proponowanej kategorii"
    );
    expect(globalThis.fetch).toBeCalledTimes(5);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/voted?userEmail=test@test"
    );
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/suggested/voted?userEmail=test@test"
    );
    expect(globalThis.fetch).toBeCalledWith("backend/users/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      }
    );
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested/voted?userEmail=test@test"
    );
  });

  test("should display info when there are no voted advices", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Nie oceniłeś jeszcze żadnej porady.")).toHaveClass(
      "py-3"
    );
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/voted?userEmail=test@test"
    );
  });

  test("should display info when fetching voted suggested advices fails", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(
      screen.getByText("Nie udało się pobrać ocenionych proponowanych porad!")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/suggested/voted?userEmail=test@test"
    );
  });

  test("should display info when there are no voted suggested advices", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(
      screen.getByText("Nie oceniłeś jeszcze żadnej proponowanej porady.")
    ).toHaveClass("py-3");
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/suggested/voted?userEmail=test@test"
    );
  });

  test("should display info when fetching voted advices fails", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(
      screen.getByText("Nie udało się pobrać ocenionych porad!")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/voted?userEmail=test@test"
    );
  });

  test("should display info when profile details are loading", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              name: "Nazwa ocenionej porady",
              categoryName: "Health",
              categoryDisplayName: "Zdrowie",
              content: "Treść",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              name: "Nazwa ocenionej proponowanej porady",
              categoryDisplayName: "Zdrowie",
              content: "Treść",
              ranking: 1,
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "5131ba80-4d83-42ef-a8e9-e7bcab17b019",
              name: "Nazwa proponowanej porady",
              category: "Health",
              categoryDisplayName: "Zdrowie",
              content: "Treść",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "5131ba80-4d83-42ef-a8e9-e7bcab17b019",
              name: "Nazwa proponowanej kategorii",
              creatorId: "1",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "5131ba80-4d83-42ef-a8e9-e7bcab17b019",
              name: "Nazwa ocenionej proponowanej kategorii",
              rating: "1",
            },
          ]),
      });

    renderWithRouterAndAuth(<Profile />);

    expect(screen.getAllByRole("status")).toHaveLength(5);
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
    expect(screen.getByText("Nazwa ocenionej porady")).toBeInTheDocument();
    expect(
      screen.getByText("Nazwa ocenionej proponowanej porady")
    ).toBeInTheDocument();
    expect(screen.getByText("Nazwa proponowanej porady")).toBeInTheDocument();
    expect(
      screen.getByText("Nazwa proponowanej kategorii")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(5);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/voted?userEmail=test@test"
    );
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/advices/suggested/voted?userEmail=test@test"
    );
    expect(globalThis.fetch).toBeCalledWith("backend/users/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      }
    );
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested/voted?userEmail=test@test"
    );
  });

  test("should display info when there are no suggested advices", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(
      screen.getByText("Nie zaproponowałeś jeszcze żadnej porady.")
    ).toHaveClass("py-3");
    expect(globalThis.fetch).toBeCalledWith("backend/users/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });

  test("should display info when fetching suggested advices fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await act(async () => renderWithAuth(<Profile />));

    expect(
      screen.getByText("Nie udało się pobrać proponowanych porad!")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith("backend/users/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });

  test("should display info when there are no suggested categories", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(
      screen.getByText("Nie zaproponowałeś jeszcze żadnej kategorii.")
    ).toHaveClass("py-3");
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      }
    );
  });

  test("should display info when fetching suggested categories fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await act(async () => renderWithAuth(<Profile />));

    expect(
      screen.getByText("Nie udało się pobrać proponowanych kategorii!")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(5);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      }
    );
  });

  test("should display info when there are no voted suggested categories", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(
      screen.getByText("Nie oceniłeś jeszcze żadnej proponowanej kategorii.")
    ).toHaveClass("py-3");
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested/voted?userEmail=test@test"
    );
  });

  test("should display info when fetching voted categories fails", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(
      screen.getByText(
        "Nie udało się pobrać ocenionych proponowanych kategorii!"
      )
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith(
      "backend/users/categories/suggested/voted?userEmail=test@test"
    );
  });
});
