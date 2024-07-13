import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./Home";
import { BrowserRouter } from "react-router-dom";

describe("Home", () => {
  test("should display hero section", () => {
    render(<Home />);

    expect(screen.getByText("HERO")).toBeInTheDocument();
  });

  test("should display subtext", () => {
    render(<Home />);

    expect(screen.getByText("Żyj lepiej z tymi poradami")).toBeInTheDocument();
  });

  test("should display button for getting advice", () => {
    render(<Home />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("should display advice, hide subtitle and change buttons after clicking to get random advice button", async () => {
    render(<Home />, { wrapper: BrowserRouter });

    const button = screen.getByRole("button");
    userEvent.click(button);

    const advice = await screen.findByText("Porada");
    expect(advice).toBeInTheDocument();
    expect(screen.getByText("Losuj poradę")).toBeInTheDocument();
    expect(screen.getByText("Szczegóły")).toBeInTheDocument();
    expect(screen.queryByText("Żyj lepiej z tymi poradami")).toBeNull();
  });

  test("should display advices ranking", () => {
    render(<Home />);

    expect(screen.getByText("Najpopularniejsze")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });
});
