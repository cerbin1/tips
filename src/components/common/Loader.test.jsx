import Loader from "./Loader";

describe("Loader", () => {
  test("should render component", () => {
    render(<Loader />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    const spinner = screen.getByRole("status").firstChild;
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      "w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-sky-400"
    );
    expect(spinner).toHaveAttribute("aria-hidden", "true");
    expect(spinner).toHaveAttribute("viewBox", "0 0 100 101");
    expect(spinner).toHaveAttribute("fill", "none");
    expect(spinner).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    const textForReaders = screen.getByText("Ładowanie...");
    expect(textForReaders).toBeInTheDocument();
    expect(textForReaders).toHaveClass("sr-only");
  });
});
