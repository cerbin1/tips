import { render, screen } from "@testing-library/react";
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
});
