import { render, screen } from "@testing-library/react";
import Home from "./Home";
import "@testing-library/jest-dom";

describe("Home", () => {
  test("should display hero section", () => {
    render(<Home />);

    expect(screen.getByText("HERO")).toBeInTheDocument();
  });

  test("should display subtext", () => {
    render(<Home />);

    expect(screen.getByText("Żyj lepiej z tymi poradami")).toBeInTheDocument();
  });
});
