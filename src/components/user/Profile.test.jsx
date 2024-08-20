import { act } from "react";
import Profile from "./Profile";
import { renderWithRouter } from "../../test-utils";
import { render, waitFor } from "@testing-library/react";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});
describe("Profile", () => {
  test("should display profile", async () => {
    localStorage.setItem("roles", "ROLE_USER");
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          JSON.parse(
            `[{"id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e", "name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść"}]`
          ),
      })
    );

    await act(async () => renderWithRouter(<Profile />));

    expect(screen.getByTestId("profile-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Profil"
    );
    expect(screen.getByText("Użytkownik jest zalogowany")).toBeInTheDocument();
    expect(
      screen.getByText("Adres email użytkownika: test@test")
    ).toBeInTheDocument();
    expect(screen.getByText("Role użytkownika: ROLE_USER")).toBeInTheDocument();
    expect(screen.getByText("Role użytkownika: ROLE_USER")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Ocenione porady:"
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getByRole("table")).toHaveTextContent("Nazwa porady");
    expect(screen.getByRole("table")).toHaveTextContent("Zdrowie");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices?userEmail=test@test"
    );
  });

  test("should display info when there are no voted advices", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => JSON.parse("[]"),
      })
    );

    await act(async () => render(<Profile />));

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

    await act(async () => render(<Profile />));

    const error = screen.getByText("Nie udało się pobrać ocenionych porad!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display info when rated advices are loading", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          JSON.parse(
            `[{"id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e", "name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść"}]`
          ),
      })
    );

    renderWithRouter(<Profile />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices?userEmail=test@test"
    );
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
  });
});
