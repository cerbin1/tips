import { renderWithRouter } from "../../test/test-utils";
import NavigationItem from "./NavigationItem";

describe("NavigationItem", () => {
  test("should render component", () => {
    renderWithRouter(<NavigationItem href="/link">Link</NavigationItem>);

    const test = screen.getByText("Link");
    expect(test).toBeInTheDocument();
    expect(test).toHaveClass("no-underline px-12 text-blue-to-light");
    expect(test).toHaveAttribute("href", "/link");
  });
});
