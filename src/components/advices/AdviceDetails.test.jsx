import userEvent from "@testing-library/user-event";
import AdviceDetails from "./AdviceDetails";

describe("AdviceDetails", () => {
  test("should display container", () => {
    render(<AdviceDetails />);

    expect(screen.getByTestId("advice-details-section")).toBeInTheDocument();
  });

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
    expect(screen.queryByText("Ocena przydatności: 5")).toBeNull();
    expect(screen.getByText("Ocena przydatności: 6")).toBeInTheDocument();
  });
});
