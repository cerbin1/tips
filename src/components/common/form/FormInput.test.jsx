import FormInput from "./FormInput";

describe("FormInput", () => {
  test("should render text input", () => {
    render(<FormInput id="id" label="text input" />);

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
    expect(input).toHaveAttribute("id", "id");
    expect(input).toHaveAttribute("name", "id");
    expect(input).toHaveAttribute("type", "text");
  });

  test("should render password input", () => {
    render(<FormInput id="id" label="password input name" type="password" />);

    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(
      "flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200"
    );
    const input = screen.getByLabelText("password input name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("bg-slate-200 rounded py-2 px-1");
    expect(input).toHaveAttribute("id", "id");
    expect(input).toHaveAttribute("name", "id");
    expect(input).toHaveAttribute("type", "password");
  });

  test("should render email input", () => {
    render(<FormInput id="id" label="email input" type="email" />);

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
    expect(input).toHaveAttribute("id", "id");
    expect(input).toHaveAttribute("name", "id");
    expect(input).toHaveAttribute("type", "email");
  });

  test("should render input with html validation", () => {
    render(<FormInput id="id" label="input" minLength={5} required />);

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
    expect(input).toHaveAttribute("id", "id");
    expect(input).toHaveAttribute("name", "id");
    expect(input).toHaveAttribute("minlength", "5");
    expect(input).toBeRequired();
  });
});
