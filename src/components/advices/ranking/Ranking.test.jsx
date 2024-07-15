import { screen } from "@testing-library/react";
import Ranking from "./Ranking";
import { renderWithRouter } from "../../../test-utils";

describe("Ranking", () => {
  test("should display ranking", () => {
    renderWithRouter(<Ranking />);

    const section = screen.getByTestId("ranking-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("container");
    expect(screen.getByText("Top 10 porad")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
  });
});
