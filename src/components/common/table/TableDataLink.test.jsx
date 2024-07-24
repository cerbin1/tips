import { renderWithRouter } from "../../../test-utils";
import TableDataLink from "./TableDataLink";

describe("TableDataLink", () => {
  test("should display table data link", () => {
    renderWithRouter(
      <table>
        <tbody>
          <tr>
            <TableDataLink href="/test">test</TableDataLink>
          </tr>
        </tbody>
      </table>
    );

    const content = screen.getByRole("cell");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("py-3 px-6 border border-slate-400");
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("text-blue-to-dark text-lg");
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveTextContent("test");
  });
});
