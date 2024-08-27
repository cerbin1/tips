import { act } from "react";
import Profile from "./Profile";
import { renderWithAuthProvider, renderWithRouter } from "../../test-utils";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "../../store/auth-context";

const RouterAndAuthProvider = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});
describe("Profile", () => {
  test("should display profile", async () => {
    localStorage.setItem("roles", "ROLE_USER");
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          JSON.parse(
            `[{"id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e", "name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść"}]`
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse("[]"),
      });

    await act(async () =>
      render(<Profile />, { wrapper: RouterAndAuthProvider })
    );

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
    localStorage.setItem("userEmail", "test@test");
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => JSON.parse("[]"),
      })
    );

    await act(async () => renderWithAuthProvider(<Profile />));

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

    await act(async () => renderWithAuthProvider(<Profile />));

    const error = screen.getByText("Nie udało się pobrać ocenionych porad!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
  });

  test("should display info when rated advices are loading", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        JSON.parse(
          `[{"id": "63b4072b-b8c8-4f9a-acf4-76d0948adc6e", "name": "Nazwa porady", "categoryName": "Health",  "categoryDisplayName": "Zdrowie", "content": "Treść"}]`
        ),
    });

    render(<Profile />, { wrapper: RouterAndAuthProvider });

    expect(
      screen.getByText("Ładowanie ocenionych porad...")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie ocenionych porad...")).toBeNull();
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
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

    await act(async () => renderWithAuthProvider(<Profile />));

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("Brak proponowanych porad")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  test("should display info when fetching suggested advices fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await act(async () => renderWithAuthProvider(<Profile />));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "backend/advices?userEmail=test@test"
    );
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    const error = screen.getByText("Nie udało się pobrać proponowanych porad!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
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

    render(<Profile />, { wrapper: RouterAndAuthProvider });

    expect(
      screen.getByText("Ładowanie proponowanych porad...")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie proponowanych porad...")).toBeNull();
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Nazwa proponowanej porady")).toBeInTheDocument();
  });
});
