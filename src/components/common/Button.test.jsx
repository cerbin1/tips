import Button from "./Button";

describe("Button", () => {
  test("should display button", () => {
    render(<Button onClick={() => {}}>test</Button>);

    const button = screen.getByText("test");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "px-6 py-3 bg-sky-400 text-white text-lg rounded hover:bg-sky-500 transition-colors duration-300"
    );
    expect(button).toHaveProperty("onclick");
  });
});
