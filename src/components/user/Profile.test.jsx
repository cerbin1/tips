import { waitFor } from "@testing-library/react";
import { act } from "react";
import { renderWithAuth, renderWithRouterAndAuth } from "../../test/test-utils";
import Profile from "./Profile";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});
describe("Profile", () => {
  test("should display profile", async () => {
    localStorage.setItem("token", "token");
    localStorage.setItem("roles", "ROLE_USER");
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `[{"id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e", "name": "Nazwa ocenionej porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść"}]`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `[{"id": "00d0b44a-f701-4172-966e-cca3aec454dc", "name": "Nazwa proponowanej porady", "category": {"name": "Health",  "displayName": "Zdrowie"}, "content": "Treść", "creatorId": "1"}]`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `[{"id": "5131ba80-4d83-42ef-a8e9-e7bcab17b019", "name": "Nazwa proponowanej kategorii", "creatorId": "1"}]`
          ),
      });

    await act(async () => renderWithRouterAndAuth(<Profile />));

    expect(screen.getByTestId("profile-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Profil"
    );
    expect(screen.getByText("Użytkownik jest zalogowany")).toBeInTheDocument();
    expect(
      screen.getByText("Adres email użytkownika: test@test")
    ).toBeInTheDocument();
    expect(screen.getByText("Role użytkownika: ROLE_USER")).toBeInTheDocument();
    expect(screen.getByText("Ocenione porady:")).toBeInTheDocument();
    expect(screen.getAllByRole("table")).toHaveLength(3);
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getAllByRole("columnheader")).toHaveLength(6);
    expect(screen.getAllByRole("table")[0]).toHaveTextContent(
      "Nazwa ocenionej porady"
    );
    expect(screen.getAllByRole("table")[0]).toHaveTextContent("Zdrowie");
    expect(screen.getAllByRole("table")[1]).toHaveTextContent(
      "Nazwa proponowanej porady"
    );
    expect(screen.getAllByRole("table")[1]).toHaveTextContent("Zdrowie");
    expect(screen.getAllByRole("table")[2]).toHaveTextContent(
      "Nazwa proponowanej kategorii"
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices?userEmail=test@test"
    );
    expect(globalThis.fetch).toHaveBeenCalledWith("backend/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/categories/suggested",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      }
    );
  });

  test("should display info when there are no voted advices", async () => {
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => JSON.parse("[]"),
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Brak ocenionych porad")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices?userEmail=test@test"
    );
  });

  test("should display info when fetching rated advices fails", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => renderWithAuth(<Profile />));

    const error = screen.getByText("Nie udało się pobrać ocenionych porad!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices?userEmail=test@test"
    );
  });

  test("should display info when rated advices are loading", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(
          `[{"id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e", "name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść"}]`
        ),
    });

    renderWithRouterAndAuth(<Profile />);

    expect(
      screen.getByText("Ładowanie ocenionych porad...")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie ocenionych porad...")).toBeNull();
    });
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices?userEmail=test@test"
    );
  });

  test("should display info when there are no suggested advices", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse("[]"),
      });

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Brak proponowanych porad")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenCalledWith("backend/advices/suggested", {
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
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenCalledWith("backend/advices/suggested", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    });
  });

  test("should display info when suggested advices are loading", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `[{"id": "5131ba80-4d83-42ef-a8e9-e7bcab17b019", "name": "Nazwa proponowanej porady", "category": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść"}]`
          ),
      });

    renderWithRouterAndAuth(<Profile />);

    expect(
      screen.getByText("Ładowanie proponowanych porad...")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie proponowanych porad...")).toBeNull();
    });
    expect(screen.getByText("Nazwa proponowanej porady")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenCalledWith("backend/advices/suggested", {
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
        json: () => JSON.parse("[]"),
      });

    await act(async () => renderWithAuth(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(
      screen.getByText("Brak proponowanych kategorii")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/categories/suggested",
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

    const error = screen.getByText(
      "Nie udało się pobrać proponowanych kategorii!"
    );
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/categories/suggested",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      }
    );
  });

  test("should display info when suggested categories are loading", async () => {
    3;
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
        json: () =>
          JSON.parse(
            `[{"id": "5131ba80-4d83-42ef-a8e9-e7bcab17b019", "name": "Nazwa proponowanej kategorii", "creatorId": "1"}]`
          ),
      });

    renderWithRouterAndAuth(<Profile />);

    expect(
      screen.getByText("Ładowanie proponowanych kategorii...")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText("Ładowanie proponowanych kategorii...")
      ).toBeNull();
    });
    expect(
      screen.getByText("Nazwa proponowanej kategorii")
    ).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/categories/suggested",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      }
    );
  });
});
