import { act, waitFor } from "@testing-library/react";
import RandomAdvice from "./RandomAdvice";
import { expect, vi } from "vitest";

describe("RandomAdvice", () => {
  test("should display error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => render(<RandomAdvice />));

    expect(screen.queryByRole("heading")).toBeNull();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się wyświetlić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    expect(
      screen.getByRole("button", { name: "Spróbuj ponownie" })
    ).toBeInTheDocument();
  });

  test("should display error when getting random advice fails and second clicking button to try again fails too", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    await act(async () => render(<RandomAdvice />));
    expect(screen.queryByRole("heading")).toBeNull();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się wyświetlić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    const button = screen.getByRole("button", { name: "Spróbuj ponownie" });

    await userEvent.click(button);

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(
      screen.getByText("Nie udało się wyświetlić porady!")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Spróbuj ponownie" })
    ).toBeInTheDocument();
  });

  test("should display advice when first time getting random advice fails and second clicking button to try again succeed", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          JSON.parse(`{"name": "Woda", "content": "Pij dużo wody"}`),
      });
    await act(async () => render(<RandomAdvice />));
    expect(screen.queryByRole("heading")).toBeNull();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const error = screen.getByText("Nie udało się wyświetlić porady!");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("py-6 text-red-500");
    const button = screen.getByRole("button", { name: "Spróbuj ponownie" });

    await userEvent.click(button);

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(screen.queryByText("Nie udało się wyświetlić porady!")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Spróbuj ponownie" })
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Wylosuj nową poradę" })
    ).toBeInTheDocument();
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(screen.getByText("Pij dużo wody")).toBeInTheDocument();
  });

  test("should display info when loading component", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => JSON.parse(`{"name": "Woda", "content": "Pij dużo wody"}`),
    });

    render(<RandomAdvice />);

    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Ładowanie...")).toBeNull();
    });
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(screen.getByText("Pij dużo wody")).toBeInTheDocument();
  });

  test("should display info when loading new random advice after clicking button", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => JSON.parse(`{"name": "Woda", "content": "Pij dużo wody"}`),
    });
    await act(async () => render(<RandomAdvice />));
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Woda");
    const newAdviceButton = screen.getByRole("button");
    expect(newAdviceButton).toHaveTextContent("Wylosuj nową poradę");

    userEvent.click(newAdviceButton);

    await waitFor(() => {
      expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
      expect(screen.queryByText("Wylosuj nową poradę")).toBeNull();
    });
    expect(screen.queryByText("Ładowanie...")).toBeNull();
    expect(screen.getByText("Wylosuj nową poradę")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(screen.getByText("Pij dużo wody")).toBeInTheDocument();
  });

  test("should display info when loading advice after clicking retry button", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });
    await act(async () => render(<RandomAdvice />));
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const retryButton = screen.getByRole("button");
    expect(retryButton).toHaveTextContent("Spróbuj ponownie");

    userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
      expect(screen.queryByText("Spróbuj ponownie")).toBeNull();
    });
    expect(screen.queryByText("Ładowanie...")).toBeNull();
    expect(screen.getByText("Spróbuj ponownie")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  test("should display random advice", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => JSON.parse(`{"name": "Woda", "content": "Pij dużo wody"}`),
    });

    await act(async () => render(<RandomAdvice />));

    const section = screen.getByTestId("random-advice-section");
    expect(section).toBeInTheDocument();
    const adviceName = screen.getByRole("heading", { level: 1 });
    expect(adviceName).toHaveTextContent("Woda");
    const adviceContent = screen.getByRole("paragraph");
    expect(adviceContent).toHaveTextContent("Pij dużo wody");
    expect(adviceContent).toHaveClass(
      "border border-sky-500 rounded py-6 px-6"
    );
    expect(
      screen.getByRole("button", {
        name: "Wylosuj nową poradę",
      })
    ).toBeInTheDocument();
  });

  test("should display new random advice after button click", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => JSON.parse(`{"name": "Woda", "content": "Pij dużo wody"}`),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          JSON.parse(
            `{"name": "Słońce", "content": "Korzystaj przynajmniej 15 minut dziennie ze słońca"}`
          ),
      });
    await act(async () => render(<RandomAdvice />));
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(screen.getByText("Pij dużo wody")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Słońce")).toBeInTheDocument();
    expect(
      screen.getByText("Korzystaj przynajmniej 15 minut dziennie ze słońca")
    ).toBeInTheDocument();
  });
});
