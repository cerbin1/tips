import { render, screen } from "@testing-library/react";
import Home from "./Home";
import "@testing-library/jest-dom";

describe("Home", () => {
  test("should get hero section", () => {
    render(<Home />);

    expect(screen.getByText("HERO")).toBeInTheDocument(true);
  });

  test("should get subtext", () => {
    render(<Home />);

    expect(screen.getByText("Żyj lepiej z tymi poradami")).toBeInTheDocument(
      true
    );
  });
});
