import FormInput from "./FormInput";

describe("FormInput", () => {
  test("should render component", () => {
    render(<FormInput id="input" label="text input" />);

    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(
      "flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200"
    );
    const label = screen.getByText("text input");
    expect(label).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("bg-slate-200 rounded py-2 px-1");
    expect(input).toHaveAttribute("id", "input");
    expect(input).toHaveAttribute("name", "input");
    expect(input).toHaveAttribute("type", "text");
  });

  test("should display password input", () => {
    render(
      <FormInput id="password" label="password input name" type="password" />
    );

    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(
      "flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200"
    );
    const input = screen.getByLabelText("password input name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("bg-slate-200 rounded py-2 px-1");
    expect(input).toHaveAttribute("id", "password");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toHaveAttribute("type", "password");
  });

  test("should display email input", () => {
    render(<FormInput id="email" label="email input" type="email" />);

    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(
      "flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200"
    );
    const label = screen.getByText("email input");
    expect(label).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("bg-slate-200 rounded py-2 px-1");
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
  });

  test("should display input with html validation", () => {
    render(<FormInput id="input" label="input" minLength={5} required />);

    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(
      "flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200"
    );
    const label = screen.getByText("input");
    expect(label).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("bg-slate-200 rounded py-2 px-1");
    expect(input).toHaveAttribute("id", "input");
    expect(input).toHaveAttribute("name", "input");
    expect(input).toHaveAttribute("minlength", "5");
    expect(input).toBeRequired();
  });
});
