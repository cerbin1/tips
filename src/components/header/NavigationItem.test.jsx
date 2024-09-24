import { renderWithRouter } from "../../test/test-utils";
import NavigationItem from "./NavigationItem";

describe("NavigationItem", () => {
  test("should render component", () => {
    renderWithRouter(<NavigationItem href="/link">Link</NavigationItem>);

    const link = screen.getByText("Link");
    expect(link).toHaveClass("no-underline px-8 text-blue-to-light");
    expect(link).toHaveAttribute("href", "/link");
  });
});
