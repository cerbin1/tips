import { act, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../test/test-utils";
import RandomAdvice from "./RandomAdvice";

beforeAll(() => {
  import.meta.env.VITE_BACKEND_URL = "backend/";
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("RandomAdvice", () => {
  test("should render component", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce(randomAdvice());

    await act(async () => renderWithRouter(<RandomAdvice />));

    expect(screen.getByTestId("random-advice-section")).toBeInTheDocument();
    const adviceName = screen.getByRole("heading", { level: 1 });
    expect(adviceName).toBeInTheDocument();
    expect(adviceName).toHaveTextContent("Woda");
    const adviceContent = screen.getByRole("paragraph");
    expect(adviceContent).toHaveTextContent("Pij dużo wody");
    expect(adviceContent).toHaveClass(
      "border border-sky-500 rounded py-6 px-6"
    );
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("Wylosuj nową poradę");
    const adviceDetailsLink = screen.getByRole("link");
    expect(adviceDetailsLink).toBeInTheDocument();
    expect(adviceDetailsLink).toHaveAttribute(
      "href",
      "/advices/264bdbc8-e6a7-44d8-9407-9d878ce27800"
    );
    expect(adviceDetailsLink).toHaveTextContent("Wyświetl szczegóły");
    expect(adviceDetailsLink).toHaveClass("text-blue-to-dark text-lg");
  });

  test("should display info when rendering component", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce(randomAdvice());

    act(() => renderWithRouter(<RandomAdvice />));

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Woda")).toBeNull();
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/random");
  });

  test("should display info when loading random advice after clicking retry button", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });
    await act(async () => render(<RandomAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/random");
    const retryButton = screen.getByRole("button");
    expect(retryButton).toHaveTextContent("Spróbuj ponownie");

    userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByText("Spróbuj ponownie")).toBeNull();
    });
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByText("Spróbuj ponownie")).toBeInTheDocument();
    expect(globalThis.fetch).nthCalledWith(2, "backend/advices/random");
  });

  test("should display info when loading new advice after clicking new random advice button", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(randomAdvice())
      .mockResolvedValueOnce(randomAdvice2());
    await act(async () => renderWithRouter(<RandomAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/random");
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(screen.getByText("Pij dużo wody")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Wylosuj nową poradę"));

    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByText("Woda")).toBeNull();
    expect(screen.queryByText("Pij dużo wody")).toBeNull();
    expect(screen.getByText("Wylosuj nową poradę")).toBeInTheDocument();
    expect(screen.getByText("Słońce")).toBeInTheDocument();
    expect(
      screen.getByText("Korzystaj przynajmniej 15 minut dziennie ze słońca")
    ).toBeInTheDocument();
    expect(globalThis.fetch).nthCalledWith(2, "backend/advices/random");
  });

  test("should display error when response is not ok", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    await act(async () => render(<RandomAdvice />));

    expect(screen.queryByRole("heading")).toBeNull();
    const error = screen.getByText("Nie udało się wyświetlić porady!");
    expect(error).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Spróbuj ponownie");
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/random");
  });

  test("should display error when getting random advice fails and clicking retry button fails too", async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    await act(async () => render(<RandomAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/random");
    expect(screen.queryByRole("heading")).toBeNull();
    expect(
      screen.getByText("Nie udało się wyświetlić porady!")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText("Spróbuj ponownie"));

    expect(
      screen.getByText("Nie udało się wyświetlić porady!")
    ).toBeInTheDocument();
    expect(screen.getByText("Spróbuj ponownie")).toBeInTheDocument();
    expect(globalThis.fetch).nthCalledWith(2, "backend/advices/random");
  });

  test("should display new random advice after button click", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(randomAdvice())
      .mockResolvedValueOnce(randomAdvice2());
    await act(async () => renderWithRouter(<RandomAdvice />));
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/random");
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(screen.getByText("Pij dużo wody")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Słońce")).toBeInTheDocument();
    expect(
      screen.getByText("Korzystaj przynajmniej 15 minut dziennie ze słońca")
    ).toBeInTheDocument();
    expect(globalThis.fetch).nthCalledWith(2, "backend/advices/random");
  });

  test("should display new random advice when first time getting random advice fails and clicking retry button succeed", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce(randomAdvice());
    await act(async () => renderWithRouter(<RandomAdvice />));
    expect(screen.queryByRole("heading")).toBeNull();
    expect(globalThis.fetch).toBeCalledTimes(1);
    expect(globalThis.fetch).toBeCalledWith("backend/advices/random");
    expect(
      screen.getByText("Nie udało się wyświetlić porady!")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText("Spróbuj ponownie"));

    expect(screen.queryByText("Nie udało się wyświetlić porady!")).toBeNull();
    expect(screen.queryByText("Spróbuj ponownie")).toBeNull();
    expect(screen.getByText("Wylosuj nową poradę")).toBeInTheDocument();
    expect(screen.getByText("Woda")).toBeInTheDocument();
    expect(screen.getByText("Pij dużo wody")).toBeInTheDocument();
    expect(globalThis.fetch).nthCalledWith(2, "backend/advices/random");
  });
});

function randomAdvice() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        id: "264bdbc8-e6a7-44d8-9407-9d878ce27800",
        name: "Woda",
        content: "Pij dużo wody",
      }),
  };
}

function randomAdvice2() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Słońce",
        content: "Korzystaj przynajmniej 15 minut dziennie ze słońca",
      }),
  };
}
