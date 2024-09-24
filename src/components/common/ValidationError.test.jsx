import ValidationError from "./ValidationError";

describe("ValidationError", () => {
  test("should render component", () => {
    render(<ValidationError content="error message" />);

    const error = screen.getByRole("paragraph");
    expect(error).toHaveClass("py-3 my-3 px-12 text-red-600");
    expect(error).toHaveTextContent("error message");
  });

  test("should not display message when error is empty", () => {
    render(<ValidationError />);

    expect(screen.queryByRole("paragraph")).toBeNull();
  });
});
