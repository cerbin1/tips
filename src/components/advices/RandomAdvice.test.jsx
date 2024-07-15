import { render, screen } from "@testing-library/react";
import RandomAdvice from "./RandomAdvice";
import { vi } from "vitest";

const FIRST_ELEMENT_INDEX_BEFORE_MULTIPLICATION_BY_LENGTH = 0.125;

describe("RandomAdvice", () => {
  test("should display random advice", async () => {
    render(<RandomAdvice />);

    const section = screen.getByTestId("random-advice-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("container");
    const advice = screen.getByRole("heading", {
      name: "Pij dużo wody każdego dnia.",
    });
    expect(advice).toBeInTheDocument();
    expect(advice).toHaveClass("advice");
    const button = screen.getByRole("button", { name: "Wylosuj nową poradę" });
    expect(button).toBeInTheDocument();
  });

  test("should display new random advice after button click", async () => {
    render(<RandomAdvice />);
    vi.spyOn(global.Math, "random").mockReturnValue(
      FIRST_ELEMENT_INDEX_BEFORE_MULTIPLICATION_BY_LENGTH
    );
    expect(
      screen.getByRole("heading", { name: "Pij dużo wody każdego dnia." })
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Wylosuj nową poradę" });
    expect(button).toBeInTheDocument();
    button.click();

    const newAdvice = await screen.findByRole("heading", {
      name: "Regularnie uprawiaj sport.",
    });
    expect(newAdvice).toBeInTheDocument();
  });
});
