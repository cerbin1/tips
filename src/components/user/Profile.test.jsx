import { waitFor } from "@testing-library/react";
import { act } from "react";
import { renderWithAuth, renderWithRouterAndAuth } from "../../test/test-utils";
import Profile from "./Profile";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

beforeEach(() => {
  localStorage.setItem("token", "token");
});

afterEach(() => {
  localStorage.clear();
});

describe("Profile", () => {
  test("should render component and display user profile", async () => {
    localStorage.setItem("userEmail", "test@test");
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
      });

    await act(async () => renderWithRouterAndAuth(<Profile />));

    expect(screen.getByTestId("profile-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Profil"
    );
    expect(screen.getAllByRole("table")).toHaveLength(3);
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getAllByRole("columnheader")).toHaveLength(6);
    expect(screen.getByText("Ocenione porady:")).toBeInTheDocument();
    expect(screen.getAllByRole("table")[0]).toHaveTextContent(
      "Nazwa ocenionej porady"
    );
    expect(screen.getAllByRole("table")[0]).toHaveTextContent("Zdrowie");
    expect(screen.getByText("Proponowane porady:")).toBeInTheDocument();
    expect(screen.getAllByRole("table")[1]).toHaveTextContent(
      "Nazwa proponowanej porady"
    );
    expect(screen.getAllByRole("table")[1]).toHaveTextContent("Zdrowie");
    expect(screen.getByText("Proponowane kategorie:")).toBeInTheDocument();
    expect(screen.getAllByRole("table")[2]).toHaveTextContent(
      "Nazwa proponowanej kategorii"
    );
    expect(globalThis.fetch).toBeCalledTimes(3);
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices?userEmail=test@test"
    );
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
    expect(globalThis.fetch).toBeCalledWith("backend/categories/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });

  test("should display info when there are no voted advices", async () => {
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Brak ocenionych porad")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices?userEmail=test@test"
    );
  });

  test("should display info when fetching rated advices fails", async () => {
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    const error = screen.getByText("Nie udało się pobrać ocenionych porad!");
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices?userEmail=test@test"
    );
  });

  test("should display info when profile details are loading", async () => {
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "63b4072b-b8c8-4f9a-acf4-76d0948adc6e",
              name: "Nazwa porady",
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
      });

    renderWithRouterAndAuth(<Profile />);

    expect(screen.getAllByRole("status")).toHaveLength(3);
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    expect(screen.getByText("Nazwa proponowanej porady")).toBeInTheDocument();
    expect(
      screen.getByText("Nazwa proponowanej kategorii")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith(
      "backend/advices?userEmail=test@test"
    );
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
    expect(globalThis.fetch).toBeCalledWith("backend/categories/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });

  test("should display info when there are no suggested advices", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Brak proponowanych porad")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested", {
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

    const error = screen.getByText("Nie udało się pobrać proponowanych porad!");
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith("backend/advices/suggested", {
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
        ok: true,
        json: () => Promise.resolve([]),
      });

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(
      screen.getByText("Brak proponowanych kategorii")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledWith("backend/categories/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });

  test("should display info when fetching suggested categories fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await act(async () => renderWithAuth(<Profile />));

    const error = screen.getByText(
      "Nie udało się pobrać proponowanych kategorii!"
    );
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(3);
    expect(globalThis.fetch).toBeCalledWith("backend/categories/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });
});
