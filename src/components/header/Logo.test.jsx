import { render, screen } from "@testing-library/react";
import Logo from "./Logo";

describe("Logo", () => {
  test("should render component", () => {
    render(<Logo />);

    const content = screen.getByText("Afterady");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("logo");
  });
});
