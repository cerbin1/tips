import Categories from "./Categories";
import { renderWithRouter } from "../../../test-utils";

describe("Categories", () => {
  test("should display categories", () => {
    renderWithRouter(<Categories />);

    const section = screen.getByTestId("categories-section");
    expect(section).toBeInTheDocument();
    expect(screen.getByText("Kategorie Porad")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
  });
});
