import SecondaryButton from "./SecondaryButton";

describe("SecondaryButton", () => {
  test("should render component", () => {
    render(<SecondaryButton onClick={() => {}}>Button</SecondaryButton>);

    const button = screen.getByText("Button");
    expect(button).toHaveClass(
      "px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
    );
    expect(button).toHaveProperty("onclick");
  });
});
