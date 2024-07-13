import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./Home";

describe("Home", () => {
  test("should display hero section", () => {
    render(<Home />);

    expect(screen.getByText("HERO")).toBeInTheDocument();
  });

  test("should display subtext", () => {
    render(<Home />);

    expect(screen.getByText("Żyj lepiej z tymi poradami")).toBeInTheDocument();
  });

  test("should display button for getting tip", () => {
    render(<Home />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("should display tip and change buttons after clicking to get random tip button", async () => {
    render(<Home />);

    const button = screen.getByRole("button");
    userEvent.click(button);

    const tip = await screen.findByText("Porada");
    expect(tip).toBeInTheDocument();
    expect(screen.getByText("Losuj poradę")).toBeInTheDocument();
    expect(screen.getByText("Szczegóły")).toBeInTheDocument();
  });
});
