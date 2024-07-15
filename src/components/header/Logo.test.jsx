import { render, screen } from "@testing-library/react";
import Logo from "./Logo";

describe("Logo", () => {
  test("should render component", () => {
    render(<Logo />);

    const content = screen.getByText("Afterady");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("no-underline");
    expect(content).toHaveClass("text-2xl");
    expect(content).toHaveClass("font-bold");
    expect(content).toHaveClass("text-blue-to-dark");
  });
});
