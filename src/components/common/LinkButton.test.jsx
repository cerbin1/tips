import LinkButton from "./LinkButton";

describe("LinkButton", () => {
  test("should display link button", () => {
    render(<LinkButton onClick={() => {}}>test</LinkButton>);

    const button = screen.getByText("test");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("text-blue-to-light cursor-pointer");
    expect(button).toHaveProperty("onclick");
  });
});
