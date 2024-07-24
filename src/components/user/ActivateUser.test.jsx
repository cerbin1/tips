import { waitFor } from "@testing-library/react";
import ActivateUser from "./ActivateUser";
import { vi } from "vitest";
import { renderWithRouter } from "../../test-utils";

describe("ActivateUser", () => {
  test("should display user activating info", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    render(<ActivateUser />);

    expect(screen.getByText("Aktywacja konta...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Aktywacja konta...")).toBeNull();
    });
  });

  test("should display error when request to activate user fails", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    render(<ActivateUser />);

    const error = await screen.findByText(
      "Nie udało się aktywować użytkownika!"
    );
    expect(error).toBeInTheDocument();
  });

  test("should display info when user is activated", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    renderWithRouter(<ActivateUser />);

    const successInfo = await screen.findByText("Konto zostało aktywowane.");
    expect(successInfo).toHaveClass("py-6 text-green-600");
    expect(successInfo).toBeInTheDocument();
    const loginButton = screen.getByText("Przejdź do logowania");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("href", "/login");
  });
});
