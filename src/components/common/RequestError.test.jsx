import RequestError from "./RequestError";

describe("RequestError", () => {
  test("should render component", () => {
    render(<RequestError content="error message" />);

    const error = screen.getByRole("paragraph");
    expect(error).toHaveClass(
      "py-3 my-3 px-12 text-red-600 border border-red-300 border-dashed rounded"
    );
    expect(error).toHaveTextContent("error message");
  });

  test("should not display message when error is empty", () => {
    render(<RequestError />);

    expect(screen.queryByRole("paragraph")).toBeNull();
  });
});
