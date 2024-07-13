import { render, screen } from "@testing-library/react";
import Ranking from "./Ranking";
import { BrowserRouter } from "react-router-dom";

describe("Ranking", () => {
  test("should display ranking", () => {
    render(<Ranking />, { wrapper: BrowserRouter });

    expect(screen.getByText("Top 10 porad")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(11);
  });
});
