import { render, screen } from "@testing-library/react";
import AdviceDetails from "./AdviceDetails";
import userEvent from "@testing-library/user-event";

describe("AdviceDetails", () => {
  test("should display advice name and content", () => {
    render(<AdviceDetails />);

    expect(screen.getByText("Nazwa porady")).toBeInTheDocument();
    expect(
      screen.getByText("Lorem ipsum", { exact: false })
    ).toBeInTheDocument();
  });

  test("should display advice rating and button to vote", () => {
    render(<AdviceDetails />);

    expect(screen.getByText("Ocena przydatności: 5")).toBeInTheDocument();
    expect(screen.getByText("Oceń jako przydatne")).toBeInTheDocument();
  });

  test("should increase rating after button clicking", async () => {
    render(<AdviceDetails />);

    await userEvent.click(screen.getByText("Oceń jako przydatne"));
    expect(screen.getByText("Ocena przydatności: 6")).toBeInTheDocument();
  });
});
