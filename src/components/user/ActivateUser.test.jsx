import { waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../test/test-utils";
import ActivateUser from "./ActivateUser";

describe("ActivateUser", () => {
  beforeAll(() => {
    import.meta.env.VITE_BACKEND_URL = "backend/";
  });

  test("should render component and display user activated successfully info", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    vi.mock("react-router", async () => {
      const actual = await vi.importActual("react-router");
      return {
        ...actual,
        useParams: () => {
          return {
            token: "token",
          };
        },
      };
    });

    renderWithRouter(<ActivateUser />);

    expect(screen.getByTestId("activate-user-section"));
    const successInfo = await screen.findByText("Konto zostało aktywowane.");
    expect(successInfo).toHaveClass("py-6 text-green-600");
    expect(successInfo).toBeInTheDocument();
    const loginButton = screen.getByText("Przejdź do logowania");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("href", "/login");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/activate/token");
  });

  test("should display message when sending activate user request", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    render(<ActivateUser />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/activate/token");
  });

  test("should display error when request to activate user fails", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    render(<ActivateUser />);

    const error = await screen.findByText(
      "Nie udało się aktywować użytkownika!"
    );
    expect(error).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/auth/activate/token");
  });
});
