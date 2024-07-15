import { render, screen } from "@testing-library/react";
import TableData from "./TableData";

describe("TableData", () => {
  test("should display table data", () => {
    render(<TableData>test</TableData>);

    const content = screen.getByText("test");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("py-3 px-6 border border-slate-400");
  });
});
