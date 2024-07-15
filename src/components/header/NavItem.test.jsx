import { screen } from "@testing-library/react";
import { renderWithRouter } from "../../test-utils";
import NavItem from "./NavItem";

describe("NavItem", () => {
  test("should render component", () => {
    renderWithRouter(<NavItem href="/link">Link</NavItem>);

    const test = screen.getByText("Link");
    expect(test).toBeInTheDocument();
    expect(test).toHaveClass("no-underline");
    expect(test).toHaveClass("text-blue-to-light");
    expect(test).toHaveClass("px-12");
    expect(test).toHaveAttribute("href", "/link");
  });
});
