import { renderWithRouter } from "../../test/test-utils";
import SecondaryLinkButton from "./SecondaryLinkButton";

describe("SecondaryLinkButton", () => {
  test("should render component", () => {
    renderWithRouter(<SecondaryLinkButton path="/path" label="label" />);

    const linkButton = screen.getByText("label");
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute("href", "/path");
    expect(linkButton).toHaveClass(
      "px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
    );
  });
});
