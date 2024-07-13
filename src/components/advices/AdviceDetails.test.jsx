import { render, screen } from "@testing-library/react";
import AdviceDetails from "./AdviceDetails";

describe("AdviceDetails", () => {
  test("should display name", () => {
    render(<AdviceDetails />);

    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    expect(
      screen.getByText("Lorem ipsum", { exact: false })
    ).toBeInTheDocument();
  });
});
