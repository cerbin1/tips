import SecondaryButton from "./SecondaryButton";

describe("SecondaryButton", () => {
  test("should render component", () => {
    render(<SecondaryButton onClick={() => {}}>test</SecondaryButton>);

    const button = screen.getByText("test");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
    );
    expect(button).toHaveProperty("onclick");
  });
});
