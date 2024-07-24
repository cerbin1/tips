import Logo from "./Logo";

describe("Logo", () => {
  test("should render component", () => {
    render(<Logo />);

    const content = screen.getByText("Afterady");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass(
      "no-underline text-2xl font-bold text-blue-to-dark"
    );
  });
});
