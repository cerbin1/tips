import Logo from "./Logo";

describe("Logo", () => {
  test("should render component", () => {
    render(<Logo />);

    const content = screen.getByText("Afterady");
    expect(content).toHaveClass(
      "no-underline text-2xl font-bold text-blue-to-dark"
    );
    expect(content.parentElement).toHaveClass("flex gap-1");
    const logoImg = screen.getByRole("img");
    expect(logoImg).toHaveAttribute("alt", "logo-bulb-icon");
  });
});
