import { screen } from "@testing-library/react";
import { renderWithRouter } from "../../test-utils";
import NavItem from "./NavItem";

describe("NavItem", () => {
  test("should render component", () => {
    renderWithRouter(<NavItem href="/link">Link</NavItem>);

    const test = screen.getByText("Link");
    expect(test).toBeInTheDocument();
    expect(test).toHaveClass("no-underline px-12 text-blue-to-light");
    expect(test).toHaveAttribute("href", "/link");
  });
});
