import { screen } from "@testing-library/react";
import Ranking from "./Ranking";
import { renderWithRouter } from "../../../test-utils";

describe("Ranking", () => {
  test("should display ranking", () => {
    renderWithRouter(<Ranking />);

    expect(screen.getByText("Top 10 porad")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(11);
  });
});
